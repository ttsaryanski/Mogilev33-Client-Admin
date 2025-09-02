import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { useError } from "../../../contexts/ErrorContext";

import { protocolServices } from "../../../services/protocolServices";

export default function EditProtocol() {
    const navigate = useNavigate();
    const { setError } = useError();
    const { protocolId } = useParams();

    const [pending, setPending] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [errors, setErrors] = useState({
        title: "",
        date: "",
        fileUrl: "",
    });

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        if (!protocolId) {
            return;
        }

        setError(null);
        const fetchProtocol = async () => {
            try {
                const result = await protocolServices.getProtocolById(
                    protocolId,
                    signal
                );
                setTitle(result.title || "");
                setDate(result.date || "");
                setFileUrl(result.fileUrl || "");
            } catch (error) {
                if (!signal.aborted) {
                    setError(`Error fetching protocol: ${error.message}`);
                }
            }
        };

        fetchProtocol();

        return () => {
            abortController.abort();
        };
    }, [protocolId, setError]);

    const submitHandler = async (e) => {
        e.preventDefault();

        const payload = { title, date, fileUrl };

        setPending(true);
        setError(null);
        try {
            await protocolServices.editProtocolById(protocolId, payload);

            navigate("/documents");
            clearForm();
        } catch (error) {
            setError(`Failed edit protocol: ${error.message}`);
        } finally {
            setPending(false);
        }
    };

    const validateTitle = (value) => {
        if (value.length < 3) {
            return "Title must be at least 3 characters long.";
        }
        return "";
    };

    const validateDate = (value) => {
        const dateRegex = /^(\d{4})\/(\d{2})\/(\d{2})$/;

        return dateRegex.test(value) ? "" : "Invalid date format.";
    };

    const validateFileUrl = (value) => {
        const urlRegex = /^https?:\/\//;
        return urlRegex.test(value)
            ? ""
            : "Please enter a valid file URL starting with http(s)://...";
    };

    const titleChangeHandler = (e) => {
        const value = e.target.value;
        setTitle(value);
        setErrors((prev) => ({ ...prev, title: validateTitle(value) }));
    };

    const dateChangeHandler = (e) => {
        const value = e.target.value;
        setDate(value);
        setErrors((prev) => ({ ...prev, date: validateDate(value) }));
    };

    const fileUrlChangeHandler = (e) => {
        const value = e.target.value;
        setFileUrl(value);
        setErrors((prev) => ({
            ...prev,
            fileUrl: validateFileUrl(value),
        }));
    };

    const clearForm = () => {
        setTitle("");
        setDate("");
        setFileUrl("");
    };

    const isFormValid =
        !errors.title &&
        !errors.date &&
        !errors.fileUrl &&
        title &&
        date &&
        fileUrl;

    return (
        <section
            id="register-page"
            className="site-header flex-center bgcolor-2 border-rounded auth"
        >
            <form onSubmit={submitHandler} id="register">
                <div className="container">
                    <h1>Едит протокол</h1>

                    <label className="label" htmlFor="title">
                        Title:
                    </label>
                    <input
                        className="input"
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        required
                        onChange={titleChangeHandler}
                    />
                    {errors.title && (
                        <p
                            style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            {errors.title}
                        </p>
                    )}

                    <label className="label" htmlFor="date">
                        Date:
                    </label>
                    <input
                        className="input"
                        type="text"
                        name="date"
                        id="date"
                        value={date}
                        required
                        onChange={dateChangeHandler}
                    />
                    {errors.date && (
                        <p
                            style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            {errors.date}
                        </p>
                    )}

                    <label className="label" htmlFor="fileUrl">
                        FileUrl:
                    </label>
                    <input
                        className="input"
                        type="text"
                        name="fileUrl"
                        id="fileUrl"
                        value={fileUrl}
                        required
                        onChange={fileUrlChangeHandler}
                    />
                    {errors.fileUrl && (
                        <p
                            style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            {errors.fileUrl}
                        </p>
                    )}

                    <input
                        className="btn submit input"
                        type="submit"
                        value="Edit"
                        disabled={!isFormValid || pending}
                        style={
                            !isFormValid || pending
                                ? {
                                      cursor: "not-allowed",
                                  }
                                : {}
                        }
                    />
                </div>
            </form>
        </section>
    );
}
