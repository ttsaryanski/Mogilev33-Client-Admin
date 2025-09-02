import { Link } from "react-router";

import { useAuth } from "../../contexts/AuthContext";
import { useError } from "../../contexts/ErrorContext";

import { protocolServices } from "../../services/protocolServices";
import { inviteServices } from "../../services/inviteServices";
import { offerServices } from "../../services/offerServices";

export default function SimpleDocument({ _id, title, type, onDelete }) {
    const { isAuthenticated, isAdmin } = useAuth();
    const { setError } = useError();

    let path = "";
    if (type === "protocol") {
        path = "protocols";
    } else if (type === "invite") {
        path = "invitations";
    } else if (type === "offer") {
        path = "offers";
    }

    const delDocHandler = async (id, type) => {
        const hasConfirm = confirm(
            `Are you sure you want to delete this document?`
        );

        if (!hasConfirm) {
            return;
        }

        try {
            if (type === "protocol") {
                await protocolServices.deleteProtocolById(id);
            } else if (type === "invite") {
                await inviteServices.deleteInviteById(id);
            } else if (type === "offer") {
                await offerServices.deleteOfferById(id);
            }
            onDelete(id, type);
        } catch (error) {
            setError(`Delete document failed: ${error.message}`);
        }
    };

    return (
        <tr>
            <td>{title}</td>
            <td>
                {isAuthenticated && isAdmin && (
                    <div className="buttons">
                        <Link
                            to={`/edit/${path}/${_id}`}
                            className="btn-docs margin-left"
                        >
                            <i className="fa-regular fa-pen-to-square"></i>
                        </Link>
                        <button
                            className="btn-docs margin-left spec"
                            onClick={() => delDocHandler(_id, type)}
                        >
                            <i className="fa-solid fa-square-minus"></i>
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}
