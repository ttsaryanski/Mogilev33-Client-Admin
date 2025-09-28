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
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("File Upload");
    const [errors, setErrors] = useState({
        title: "",
        date: "",
        file: "",
    });

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!file) {
            setErrors((prev) => ({ ...prev, file: "Please select a file!" }));
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("date", date);
        formData.append("file", file[0]);

        setPending(true);
        setError(null);
        try {
            if (type === "protocol") {
                await protocolServices.createProtocol(formData);
            } else if (type === "invite") {
                await inviteServices.createInvite(formData);
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

    const validateFile = (file) => {
        if (!file) {
            return "Please select a file!";
        }
        const allowedTypes = ["application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            return "Only pdf formats are allowed.";
        }
        return "";
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

    const fileChangeHandler = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFile(files);
            setFileName(files[0].name);
            setErrors((prev) => ({ ...prev, file: validateFile(files[0]) }));
        } else {
            setFile(null);
            setFileName("File Upload");
            setErrors((prev) => ({ ...prev, file: "Please select a file!" }));
        }
    };

    const clearForm = () => {
        setTitle("");
        setDate("");
        setFile(null);
        setFileName("File Upload");
        setErrors({
            title: "",
            date: "",
            file: "",
        });
    };

    const isFormValid =
        !errors.title &&
        !errors.date &&
        !errors.file &&
        title &&
        date &&
        file &&
        file.length > 0;

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

                    <label className="label uploadfile" htmlFor="file">
                        File Upload:
                    </label>
                    <input
                        className="input"
                        type="file"
                        name="file"
                        id="file"
                        accept=".pdf"
                        required
                        onChange={fileChangeHandler}
                    />
                    {errors.file && (
                        <p
                            style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            {errors.file}
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
