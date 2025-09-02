import styles from "./Boundary.module.css";

export default function Boundary() {
    return (
        <main>
            <div className="p-50 bgcolor-2">
                <p className={styles.logo404}>
                    <i className="fa-solid fa-laptop-code"></i>
                </p>
                <h1 className="h1-boundary">
                    Whoops, there's a bug in the code &#40;:
                </h1>
                <p className={styles.p}>
                    The author will do everything possible to fix the problem.
                    Press button and reload page!
                </p>
                <div className={styles.button}>
                    <a href="/" className={styles.link}>
                        Към начална страница
                    </a>
                </div>
            </div>
        </main>
    );
}
