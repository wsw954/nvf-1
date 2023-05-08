import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Bizzlle.module.css";

export default function Layout1({ selectedMake, selectedModel }) {
  console.log("Line 5 in Layout1");
  return (
    <div className={styles.container}>
      {selectedModel.name && (
        <div className={styles.inputGroup}>
          Layout2 for: {selectedModel.name}
        </div>
      )}
    </div>
  );
}
