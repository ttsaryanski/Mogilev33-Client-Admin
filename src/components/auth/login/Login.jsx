import { useState } from "react";
import { Link } from "react-router";

import { useAuth } from "../../../contexts/AuthContext";
import { useError } from "../../../contexts/ErrorContext";

export default function Login() {
    const { login } = useAuth();
    const { setError } = useError();

    const [pending, setPending] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const submitHandler = async (e) => {
        e.preventDefault();

        setPending(true);
        setError(null);
        try {
            await login(email, password);
            clearForm();
        } catch (error) {
            setError(`Login failed: ${error.message}`);
            setPassword("");
        } finally {
            setPending(false);
        }
    };

    const clearForm = () => {
        setEmail("");
        setPassword("");
    };

    const validateEmail = (value) => {
        const emailRegex =
            /^[A-Za-z0-9._%+-]{3,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(value) ? "" : "Invalid email format.";
    };

    const validatePassword = (value) => {
        if (value.length < 3) {
            return "Password must be at least 3 characters long.";
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

    const isFormValid = !errors.email && !errors.password && email && password;

    return (
        <section id="login-page" className="auth">
            <form onSubmit={submitHandler} id="login">
                <div className="container">
                    <div className="brand-logo"></div>
                    <h1>Login</h1>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Sokka@gmail.com"
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

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="login-password"
                        name="password"
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

                    <input
                        type="submit"
                        className="btn submit"
                        value="Login"
                        disabled={!isFormValid || pending}
                        style={
                            !isFormValid || pending
                                ? {
                                      cursor: "not-allowed",
                                      backgroundColor: "#778e9c",
                                  }
                                : {}
                        }
                    />
                    <p className="field">
                        <span>
                            If you don't have profile click{" "}
                            <Link to="/auth/register">here</Link>
                        </span>
                    </p>
                </div>
            </form>
        </section>
    );
}
