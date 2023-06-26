import React, { useCallback } from "react";
import styles from "../styles/Bizzlle.module.css";

export default function Popup({ message, confirmAction, cancelAction }) {
  const handlePopupConfirm = useCallback(() => {
    confirmAction();
  }, [confirmAction]);

  const handlePopupCancel = useCallback(() => {
    cancelAction();
  }, [cancelAction]);

  return (
    <>
      <div className={styles.backdrop}></div>
      <div className={styles.popupContainer}>
        <h2 className={styles.popupTitle}>NOTE:</h2>
        <p>{message}</p>

        <div className={styles.buttonContainer}>
          <button className={styles.popupButton} onClick={handlePopupConfirm}>
            Yes
          </button>
          <button className={styles.popupButton} onClick={handlePopupCancel}>
            No
          </button>
        </div>
      </div>
    </>
  );
}
