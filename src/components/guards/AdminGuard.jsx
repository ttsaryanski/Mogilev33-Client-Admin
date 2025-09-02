import { Navigate, Outlet } from "react-router";

import { useAuth } from "../../contexts/AuthContext";

import Spinner from "../shared/spinner/Spinner";

export default function AdminGuard() {
    const { isLoading, isAuthenticated, isAdmin } = useAuth();

    if (isLoading) {
        return <Spinner />;
    }

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/documents" />;
    }

    return <Outlet />;
}
