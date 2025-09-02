import styles from "./Spinner.module.css";

export default function Spinner() {
    return (
        <div className="spinner">
            <div id="loader" className={styles.loader}></div>
        </div>
    );
}
