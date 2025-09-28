import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { useError } from "../../../contexts/ErrorContext";

import { offerServices } from "../../../services/offerServices";

export default function EditOffer() {
    const navigate = useNavigate();
    const { setError } = useError();
    const { offerId } = useParams();

    const [pending, setPending] = useState(false);
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [price, setPrice] = useState(0);
    const [fileUrl, setFileUrl] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("File Upload");
    const [errors, setErrors] = useState({
        title: "",
        company: "",
        price: "",
        file: "",
    });

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        if (!offerId) {
            return;
        }

        setError(null);
        const fetchOffer = async () => {
            try {
                const result = await offerServices.getOfferById(
                    offerId,
                    signal
                );
                setTitle(result.title || "");
                setCompany(result.company || "");
                setPrice(result.price || 0);
                setFileUrl(result.fileUrl || "");
            } catch (error) {
                if (!signal.aborted) {
                    setError(`Error fetching offer: ${error.message}`);
                }
            }
        };

        fetchOffer();

        return () => {
            abortController.abort();
        };
    }, [offerId, setError]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!file) {
            setErrors((prev) => ({ ...prev, file: "Please select a file!" }));
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("company", company);
        formData.append("price", Number(price));
        formData.append("file", file[0]);

        setPending(true);
        setError(null);
        try {
            await offerServices.editOfferById(offerId, formData);

            navigate("/documents");
            clearForm();
        } catch (error) {
            setError(`Failed edit offer: ${error.message}`);
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
        setCompany("");
        setPrice(0);
        setFile(null);
        setFileName("File Upload");
        setErrors({
            title: "",
            company: "",
            price: "",
            file: "",
        });
    };

    const isFormValid =
        !errors.title &&
        !errors.company &&
        !errors.price &&
        !errors.file &&
        title &&
        company &&
        price >= 0 &&
        file &&
        file.length > 0;

    return (
        <section
            id="register-page"
            className="site-header flex-center bgcolor-2 border-rounded auth"
        >
            <form onSubmit={submitHandler} id="register">
                <div className="container">
                    <h1>Едит Оферта</h1>

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
                        readOnly
                    />

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
