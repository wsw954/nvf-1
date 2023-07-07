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
    const selectedSerial = event.target.value;
    const selectedOption = choices.find(
      (choice) => String(choice.serial) === selectedSerial
    );

    if (selectedOption && onChange) {
      const modifiedSelectedOption = {
        ...selectedOption,
        categoryName: categoryName,
        type: "Dropdown",
        checked: true,
        prevValue: previousOption ? previousOption : null,
      };
      onChange(modifiedSelectedOption);
      setPreviousOption(selectedOption);
    }
  };

  const displayPrice =
    categoryName.toLowerCase() !== "make" &&
    categoryName.toLowerCase() !== "model";

  let selectedValueSerial = selectedOptions[0]?.serial || 0;

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
        value={selectedValueSerial}
      >
        <option value="">Select {categoryName}</option>
        {choices.map((choice, index) => {
          const currentSelectedOption = selectedOptions.find(
            (selectedOption) => selectedOption.serial === choice.serial
          );
          const hasPackageID =
            currentSelectedOption && "packageID" in currentSelectedOption; //Check if part of package
          const inputName = hasPackageID
            ? `${choice.name}-Included in Package`
            : choice.name; //Render the change in name displayed for a package component
          const displayPriceValue = hasPackageID
            ? currentSelectedOption.price
            : choice.price; //Display Price difference for package component
          return (
            <option key={index} value={choice.serial}>
              {inputName + (displayPrice ? " -$" + displayPriceValue : "")}
            </option>
          );
        })}
      </select>
    </div>
  );
}
