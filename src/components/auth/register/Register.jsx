import { useState } from "react";
import { Link } from "react-router";

import { useAuth } from "../../../contexts/AuthContext";
import { useError } from "../../../contexts/ErrorContext";

import { authService } from "../../../services/authService";

export default function Register() {
    const { login } = useAuth();
    const { setError } = useError();

    const [pending, setPending] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        rePassword: "",
    });

    const submitHandler = async (e) => {
        e.preventDefault();

        setPending(true);
        setError(null);
        try {
            await authService.register({
                email,
                password,
            });

            await login(email, password);
            clearForm();
        } catch (error) {
            setError(`Registration failed: ${error.message}`);
            setPassword("");
            setRePassword("");
        } finally {
            setPending(false);
        }
    };

    const validateEmail = (value) => {
        const emailRegex =
            /^[A-Za-z0-9._%+-]{3,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(value) ? "" : "Invalid email format.";
    };

    const validatePassword = (value) => {
        if (value.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        return "";
    };

    const validateRePassword = (value, password) => {
        if (value !== password) {
            return "Password missmatch!";
        }

        return "";
    };

    const emailChangeHandler = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    };

    const passwordChangeHandler = (e) => {
        const value = e.target.value;
        setPassword(value);
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    };

    const rePasswordChangeHandler = (e) => {
        const value = e.target.value;
        setRePassword(value);
        setErrors((prev) => ({
            ...prev,
            rePassword: validateRePassword(value, password),
        }));
    };

    const clearForm = () => {
        setEmail("");
        setPassword("");
        setRePassword("");
    };

    const isFormValid =
        !errors.email &&
        !errors.password &&
        !errors.rePassword &&
        email &&
        password &&
        rePassword;

    return (
        <section
            id="register-page"
            className="site-header flex-center bgcolor-2 border-rounded auth"
        >
            <form onSubmit={submitHandler} id="register">
                <div className="container">
                    <h1>Register</h1>

                    <label className="label" htmlFor="email">
                        Email:
                    </label>
                    <input
                        className="input"
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="username"
                        placeholder="example@email.com"
                        value={email}
                        required
                        onChange={emailChangeHandler}
                    />
                    {errors.email && (
                        <p
                            style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            {errors.email}
                        </p>
                    )}

                    <label className="label" htmlFor="password">
                        Password:
                    </label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        id="register-password"
                        value={password}
                        required
                        onChange={passwordChangeHandler}
                    />
                    {errors.password && (
                        <p
                            style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            {errors.password}
                        </p>
                    )}

                    <label className="label" htmlFor="rePassword">
                        Confirm Password:
                    </label>
                    <input
                        className="input"
                        type="password"
                        name="rePassword"
                        autoComplete="new-password"
                        id="confirm-password"
                        value={rePassword}
                        required
                        onChange={rePasswordChangeHandler}
                    />
                    {errors.rePassword && (
                        <p
                            style={{
                                color: "red",
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            {errors.rePassword}
                        </p>
                    )}

                    <input
                        className="btn submit input"
                        type="submit"
                        value="Register"
                        disabled={!isFormValid || pending}
                        style={
                            !isFormValid || pending
                                ? {
                                      cursor: "not-allowed",
                                  }
                                : {}
                        }
                    />

                    <p className="field">
                        <span>
                            If you already have profile click{" "}
                            <Link className="links" to="/">
                                here
                            </Link>
                        </span>
                    </p>
                </div>
            </form>
        </section>
    );
}
