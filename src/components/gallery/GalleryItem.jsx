import { useParams, Link } from "react-router-dom";

import { galleryItems } from "./Gallery";

export default function GalleryItem() {
    const { id } = useParams();
    const item = galleryItems.find((img) => img.id === Number(id));

    if (!item) {
        return (
            <div style={{ textAlign: "center", padding: "1rem" }}>
                <h2>Image not found</h2>
                <Link to="/gallery">Back to Gallery</Link>
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1rem",
            }}
        >
            <img
                src={item.src}
                alt={item.alt}
                style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "12px",
                }}
            />
            <Link
                className="link-img"
                to="/gallery"
                style={{
                    marginTop: "1rem",
                    color: "#38cccc",
                    textDecoration: "none",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px #1a7474",
                }}
            >
                Back to Gallery
            </Link>
        </div>
    );
}
