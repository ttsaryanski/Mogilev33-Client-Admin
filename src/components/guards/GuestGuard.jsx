import { Navigate, Outlet } from "react-router";

import { useAuth } from "../../contexts/AuthContext";

import Spinner from "../shared/spinner/Spinner";

export default function GuestGuard() {
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return <Spinner />;
    }

    if (isAuthenticated) {
        return <Navigate to="/documents" />;
    }

    return <Outlet />;
}
