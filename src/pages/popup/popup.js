import styles from "./popup.module.css";

function Popup({ message, onYes, onNo }) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContainer}>
        <p className={styles.popupMessage}>{message}</p>
        <div className={styles.popupButtons}>
          <button
            className={`${styles.popupButton} ${styles.yes}`}
            onClick={onYes}
          >
            Yes
          </button>
          <button
            className={`${styles.popupButton} ${styles.no}`}
            onClick={onNo}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
