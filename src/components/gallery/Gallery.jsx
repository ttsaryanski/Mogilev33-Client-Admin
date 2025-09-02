import { Link } from "react-router-dom";

export const galleryItems = [
    { id: 1, src: "/img/img-01.jpg", alt: "img" },
    { id: 2, src: "/img/img-02.jpg", alt: "img" },
    { id: 3, src: "/img/img-03.jpg", alt: "img" },
    { id: 4, src: "/img/img-04.jpg", alt: "img" },
];

export default function Gallery() {
    return (
        <div className="gallery-section">
            <div className="gallery">
                {galleryItems.map((item) => (
                    <div key={item.id} className="gallery-item city portraits">
                        <Link to={`/gallery/${item.id}`}>
                            <img
                                src={item.src}
                                alt={item.alt}
                                className="img-fluid"
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
