import { useState } from "react";
import styles from "../styles/Bizzlle.module.css";

export default function Dropdown({ categoryName, choices, onSelectChange }) {
  const [selectedChoice, setSelectedChoice] = useState("");

  const handleSelectChange = (event) => {
    setSelectedChoice(event.target.value);
    if (onSelectChange) {
      onSelectChange(event.target.value);
    }
  };

  const displayPrice =
    categoryName.toLowerCase() !== "make" &&
    categoryName.toLowerCase() !== "model";

  return (
    <div className={styles.optionsDropdownInputGroup}>
      <label
        htmlFor={`dropdown-${categoryName}`}
        className={styles.optionsDropdownLabel}
      >
        {categoryName}
      </label>
      <select
        id={`dropdown-${categoryName}`}
        className={styles.optionsDropdownSelect}
        value={selectedChoice}
        onChange={handleSelectChange}
      >
        <option value="">Select {categoryName}</option>
        {choices.map((option, index) => (
          <option key={index} value={option.name}>
            {option.name + (displayPrice ? " -$" + option.price : "")}
          </option>
        ))}
      </select>
    </div>
  );
}
