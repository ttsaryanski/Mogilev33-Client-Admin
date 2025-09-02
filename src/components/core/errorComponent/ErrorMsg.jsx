import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { useError } from "../../../contexts/ErrorContext";

import styles from "./ErrorMsg.module.css";

export default function ErrorMsg() {
    const { error, setError } = useError();
    const errorRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (error && errorRef.current) {
            errorRef.current.focus();
            errorRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            const timer = setTimeout(() => {
                setError(null);
            }, 10000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [error, setError]);

    useEffect(() => {
        setError(null);
    }, [location.pathname]);

    return (
        <>
            {error && (
                <div
                    className={styles.error}
                    ref={errorRef}
                    tabIndex={-1}
                    role="alert"
                >
                    {Array.isArray(error) ? (
                        error.map((errMsg, index) => (
                            <p key={index} className={styles.errorItem}>
                                {errMsg}
                            </p>
                        ))
                    ) : (
                        <p>{error}</p>
                    )}
                    <button
                        onClick={() => setError(null)}
                        className={styles.button}
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </>
    );
}
