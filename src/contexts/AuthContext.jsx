import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { authService } from "../services/authService";
import { useError } from "./ErrorContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const { setError } = useError();

    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async (signal) => {
        setError(null);
        try {
            const userData = await authService.profile(signal);
            setUser(userData);
            if (userData && userData.role === "admin") {
                setIsAdmin(true);
            }
        } catch (err) {
            setUser(null);
            if (err.message === "Missing token!") {
                setError(null);
            } else {
                setError(err.message);
            }
        } finally {
            if (!signal?.aborted) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        fetchUser(signal);

        return () => {
            abortController.abort();
        };
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const result = await authService.login({ email, password });
            setAccessToken(result.accessToken);
            await fetchUser();
            navigate("/protocols");
        } catch (err) {
            setUser(null);
            setAccessToken(null);
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await authService.logout();
            setAccessToken(null);
            setUser(null);
            navigate("/");
        } catch (err) {
            setAccessToken(null);
            setUser(null);
            setError(err.message);
            throw err;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isAuthenticated: !!user,
                isAdmin,
                isLoading,
                setAccessToken,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
