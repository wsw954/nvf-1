import React from "react";
import styles from "../styles/Bizzlle.module.css";

export default function OptionsForm({ selectedMake, selectedModel }) {
  console.log(selectedMake);
  console.log(selectedModel.name);
  console.log(selectedModel.layout);
  return (
    <div className={styles.container}>Options for {selectedModel.name}</div>
  );
}
