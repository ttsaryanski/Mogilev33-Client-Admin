import { useRef } from "react";
import { Link } from "react-router";

import { useAuth } from "../../../contexts/AuthContext";

export default function Header() {
    const checkRef = useRef();
    const { user, logout } = useAuth();

    const handleLinkClick = () => {
        if (checkRef.current) {
            checkRef.current.checked = false;
        }
    };
    return (
        <nav>
            <input type="checkbox" id="check" ref={checkRef} />
            <label htmlFor="check" className="checkbtn">
                <i className="logo fas fa-bars"></i>
            </label>
            <div className="media">
                <Link to="/" className="logo">
                    <i className="fa-solid fa-building-lock"></i>
                </Link>
            </div>

            {user && (
                <div className="user-nav">
                    <p>{user.email}</p>
                    <p>{user.role}</p>
                </div>
            )}

            <ul>
                <li>
                    <Link to="/" className="active" onClick={handleLinkClick}>
                        Начало
                    </Link>
                </li>
                <li>
                    <Link to="/documents" onClick={handleLinkClick}>
                        Документи
                    </Link>
                </li>

                {user && (
                    <li>
                        <button onClick={logout} className="a button">
                            Изход
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}
