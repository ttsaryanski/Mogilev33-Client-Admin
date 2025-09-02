import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useAuth } from "../../contexts/AuthContext";
import { useError } from "../../contexts/ErrorContext";

import { protocolServices } from "../../services/protocolServices";
import { offerServices } from "../../services/offerServices";
import { inviteServices } from "../../services/inviteServices";

import SimpleDocument from "./SimpleDocument";
import Spinner from "../shared/spinner/Spinner";
import NothingYet from "../shared/NothingYet";

export default function Documents() {
    const { isAuthenticated, isAdmin } = useAuth();
    const { setError } = useError();

    const [protocols, setProtocols] = useState([]);
    const [offers, setOffers] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const fetchDocs = async () => {
            try {
                const [protocolsData, offersData, invitationsData] =
                    await Promise.all([
                        protocolServices.getAllProtocols(signal),
                        offerServices.getAllOffers(signal),
                        inviteServices.getAllInvitations(signal),
                    ]);
                setProtocols(protocolsData);
                setOffers(offersData);
                setInvitations(invitationsData);
            } catch (error) {
                if (!signal.aborted) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocs();

        return () => {
            abortController.abort();
        };
    }, [setError]);

    const handleDelete = (id, type) => {
        if (type === "protocol") {
            setProtocols((prev) => prev.filter((doc) => doc._id !== id));
        } else if (type === "invite") {
            setInvitations((prev) => prev.filter((doc) => doc._id !== id));
        } else if (type === "offer") {
            setOffers((prev) => prev.filter((doc) => doc._id !== id));
        }
    };

    return (
        <>
            {isLoading && <Spinner />}
            <section className="about p-50 bgcolor-2 border-rounded">
                <div className="table-container">
                    {isAuthenticated && isAdmin && (
                        <div className="buttons">
                            <Link to="/documents/create" className="btn-docs">
                                <i className="fa-solid fa-square-plus">
                                    <span className="margin-left">
                                        Документ
                                    </span>
                                </i>
                            </Link>
                            <Link
                                to="/offer/create"
                                className="btn-docs margin-left"
                            >
                                <i className="fa-solid fa-square-plus">
                                    <span className="margin-left">Оферта</span>
                                </i>
                            </Link>
                        </div>
                    )}

                    <h3>Протоколи</h3>
                    <div className="table-wrapper">
                        {!isLoading && protocols.length === 0 && <NothingYet />}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Заглавие</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {protocols
                                    .sort(
                                        (a, b) =>
                                            new Date(b.date) - new Date(a.date)
                                    )
                                    .map((protocol) => (
                                        <SimpleDocument
                                            key={protocol._id}
                                            {...protocol}
                                            type="protocol"
                                            onDelete={handleDelete}
                                        />
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="table-container">
                    <h3>Покани</h3>
                    <div className="table-wrapper">
                        {!isLoading && invitations.length === 0 && (
                            <NothingYet />
                        )}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Заглавие</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitations.map((invite) => (
                                    <SimpleDocument
                                        key={invite._id}
                                        {...invite}
                                        type="invite"
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="table-container">
                    <h3>Оферти</h3>
                    <div className="table-wrapper">
                        {!isLoading && offers.length === 0 && <NothingYet />}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Заглавие</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offers.map((offer) => (
                                    <SimpleDocument
                                        key={offer._id}
                                        {...offer}
                                        type="offer"
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
}
