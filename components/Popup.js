import React from "react";
import styles from "../styles/Bizzlle.module.css";

const Popup = ({ message, confirmAction, selectedOption }) => {
  return (
    <div>
      <h2>Popup</h2>
      <p>{message}</p>
      <p>Selected Option: {selectedOption}</p>
      <button onClick={confirmAction}>Confirm</button>
    </div>
  );
};

export default Popup;
