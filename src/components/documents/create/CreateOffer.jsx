import { useState } from "react";
import { useNavigate } from "react-router";

import { useError } from "../../../contexts/ErrorContext";

import { offerServices } from "../../../services/offerServices";

export default function CreateOffer() {
    const navigate = useNavigate();
    const { setError } = useError();

    const [pending, setPending] = useState(false);
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [price, setPrice] = useState(0);
    const [fileUrl, setFileUrl] = useState("");
    const [errors, setErrors] = useState({
        title: "",
        company: "",
        price: "",
        fileUrl: "",
    });

    const submitHandler = async (e) => {
        e.preventDefault();

        const payload = { title, company, price: Number(price), fileUrl };

        setPending(true);
        setError(null);
        try {
            await offerServices.createOffer(payload);

            navigate("/documents");
            clearForm();
        } catch (error) {
            setError(`Failed create offer: ${error.message}`);
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

    const validateCompany = (value) => {
        if (value.length < 2) {
            return "Company must be at least 2 characters long.";
        }
        return "";
    };

    const validatePrice = (value) => {
        if (value < 0) {
            return "Price must be a positive number.";
        }
        return "";
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

    const companyChangeHandler = (e) => {
        const value = e.target.value;
        setCompany(value);
        setErrors((prev) => ({ ...prev, company: validateCompany(value) }));
    };

    const priceChangeHandler = (e) => {
        const value = e.target.value;
        setPrice(value);
        setErrors((prev) => ({ ...prev, price: validatePrice(value) }));
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
        setCompany("");
        setPrice(0);
        setFileUrl("");
    };

    const isFormValid =
        !errors.title &&
        !errors.company &&
        !errors.price &&
        !errors.fileUrl &&
        title &&
        company &&
        price &&
        fileUrl;

    return (
        <section
            id="register-page"
            className="site-header flex-center bgcolor-2 border-rounded auth"
        >
            <form onSubmit={submitHandler} id="register">
                <div className="container">
                    <h1>Създай Оферта</h1>

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

                    <label className="label" htmlFor="company">
                        Company:
                    </label>
                    <input
                        className="input"
                        type="text"
                        name="company"
                        id="company"
                        value={company}
                        required
                        onChange={companyChangeHandler}
                    />
                    {errors.company && (
                        <p
                            style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            {errors.company}
                        </p>
                    )}

                    <label className="label" htmlFor="price">
                        Price:
                    </label>
                    <input
                        className="input"
                        type="number"
                        name="price"
                        id="price"
                        value={price}
                        required
                        onChange={priceChangeHandler}
                    />
                    {errors.price && (
                        <p
                            style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            {errors.price}
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
