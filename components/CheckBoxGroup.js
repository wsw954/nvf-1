import { useState } from "react";
import styles from "../styles/Bizzlle.module.css";

export default function CheckBoxGroup({ categoryName, choices, onChange }) {
  const [selectedChoices, setSelectedChoices] = useState([]);
  // const { state, dispatch } = useContext(AppContext);

  const handleCheckBoxChange = (event) => {
    onChange();
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
              onChange={handleCheckBoxChange}
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
