import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ErrorProvider } from "./contexts/ErrorContext";
import ErrorBoundary from "./components/boundary/ErrorBoundary";

import AdminGuard from "./components/guards/AdminGuard";
import AuthGuard from "./components/guards/AuthGuard";
import GuestGuard from "./components/guards/GuestGuard";

import Header from "./components/core/header/Header";
import Home from "./components/home/Home";
import Documents from "./components/documents/Documents";
import CreateDoc from "./components/documents/create/CreateDoc";
import CreateOffer from "./components/documents/create/CreateOffer";
import EditProtocol from "./components/documents/edit/EditProtocol";
import EditInvite from "./components/documents/edit/EditInvite";
import EditOffer from "./components/documents/edit/EditOffer";
import Register from "./components/auth/register/Register";
import Footer from "./components/core/footer/Footer";
import ErrorMsg from "./components/core/errorComponent/ErrorMsg";
import Page404 from "./components/page 404/Page404";

function App() {
    return (
        <ErrorProvider>
            <AuthProvider>
                <ErrorBoundary>
                    <div className="container-fluid">
                        <Header />
                        <ErrorMsg />
                        <main>
                            <Routes>
                                <Route
                                    path="/documents"
                                    element={<Documents />}
                                />

                                <Route element={<GuestGuard />}>
                                    <Route path="/" element={<Home />} />
                                    <Route
                                        path="/register"
                                        element={<Register />}
                                    />
                                </Route>

                                <Route element={<AdminGuard />}>
                                    <Route
                                        path="/documents/create"
                                        element={<CreateDoc />}
                                    />

                                    <Route
                                        path="/offer/create"
                                        element={<CreateOffer />}
                                    />

                                    <Route
                                        path="/edit/protocols/:protocolId"
                                        element={<EditProtocol />}
                                    />

                                    <Route
                                        path="/edit/invitations/:inviteId"
                                        element={<EditInvite />}
                                    />

                                    <Route
                                        path="/edit/offers/:offerId"
                                        element={<EditOffer />}
                                    />
                                </Route>

                                <Route path="*" element={<Page404 />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </ErrorBoundary>
            </AuthProvider>
        </ErrorProvider>
    );
}

export default App;
