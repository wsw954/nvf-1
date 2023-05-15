import { useState } from "react";
import styles from "../styles/Bizzlle.module.css";

export default function CheckBoxGroup({ categoryName, choices }) {
  const [selectedChoices, setSelectedChoices] = useState([]);

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedChoices([...selectedChoices, event.target.value]);
    } else {
      setSelectedChoices(
        selectedChoices.filter((choice) => choice !== event.target.value)
      );
    }
  };

  return (
    <div className={styles.optionsCheckBoxGroup}>
      <label className={styles.optionsCheckBoxGroupLabel}>{categoryName}</label>
      <div className={styles.checkBoxContainer}>
        {choices.map((option, index) => (
          <div key={option.name} className={styles.checkBoxItem}>
            <input
              type="checkbox"
              id={`${option.name}`}
              name={option.name}
              value={option.name}
              onChange={handleCheckboxChange}
              checked={selectedChoices.includes(option.name)}
            />
            <label htmlFor={`${option.name}-${index}`}>
              {option.name + "- $" + option.price}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
