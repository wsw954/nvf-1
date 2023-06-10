import { useState } from "react";
import styles from "../styles/Bizzlle.module.css";

export default function Dropdown({
  categoryName,
  choices,
  onChange,
  selectedOptions,
}) {
  const [previousOption, setPreviousOption] = useState(null);

  const handleDropdownChange = (event) => {
    const selectedName = event.target.value;
    const selectedOption = choices.find(
      (option) => option.name === selectedName
    );

    if (selectedOption && onChange) {
      const modifiedSelectedOption = {
        ...selectedOption,
        categoryName: categoryName,
        type: "Single",
        checked: true,
        prevValue: previousOption ? previousOption.name : null,
      };
      onChange(categoryName, modifiedSelectedOption);
      setPreviousOption(selectedOption);
    }
  };

  const displayPrice =
    categoryName.toLowerCase() !== "make" &&
    categoryName.toLowerCase() !== "model";

  let selectedValue = selectedOptions[0]?.name || "";

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
        onChange={handleDropdownChange}
        value={selectedValue}
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
