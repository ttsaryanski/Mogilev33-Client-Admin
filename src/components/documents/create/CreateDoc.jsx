import { useState } from "react";
import { useNavigate } from "react-router";

import { useError } from "../../../contexts/ErrorContext";

import { protocolServices } from "../../../services/protocolServices";
import { inviteServices } from "../../../services/inviteServices";

export default function CreateDoc() {
    const navigate = useNavigate();
    const { setError } = useError();

    const [type, setType] = useState("protocol");
    const [pending, setPending] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [errors, setErrors] = useState({
        title: "",
        date: "",
        fileUrl: "",
    });

    const submitHandler = async (e) => {
        e.preventDefault();

        const payload = { title, date, fileUrl };

        setPending(true);
        setError(null);
        try {
            if (type === "protocol") {
                await protocolServices.createProtocol(payload);
            } else if (type === "invite") {
                await inviteServices.createInvite(payload);
            }

            navigate("/documents");
            clearForm();
        } catch (error) {
            setError(`Failed create document: ${error.message}`);
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
                    <h1>Създай</h1>
                    <div className="type-selector">
                        <label style={{ color: "#1a7474" }}>
                            <input
                                style={{
                                    accentColor: "#1a7474",
                                }}
                                type="radio"
                                name="type"
                                value="protocol"
                                checked={type === "protocol"}
                                onChange={(e) => setType(e.target.value)}
                            />
                            Протокол
                        </label>
                        <label style={{ color: "#1a7474" }}>
                            <input
                                style={{ accentColor: "#1a7474" }}
                                type="radio"
                                name="type"
                                value="invite"
                                checked={type === "invite"}
                                onChange={(e) => setType(e.target.value)}
                            />
                            Покана
                        </label>
                    </div>

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
                        value="Add"
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
