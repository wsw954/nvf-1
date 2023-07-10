import { useState, useEffect } from "react";
import styles from "../styles/Bizzlle.module.css";

export default function Dropdown({
  categoryName,
  choices,
  onChange,
  selectedOptions,
}) {
  const [previousOption, setPreviousOption] = useState(
    selectedOptions.length > 0 ? selectedOptions[0] : null
  );

  useEffect(() => {
    if (selectedOptions.length > 0) {
      setPreviousOption(selectedOptions[0]);
    }
  }, [selectedOptions]);

  const getSelectedOption = (selectedSerial, choices) => {
    return choices.find((choice) => String(choice.serial) === selectedSerial);
  };

  const getCurrentSelectedOption = (choiceSerial) => {
    return selectedOptions.find(
      (selectedOption) => selectedOption.serial === choiceSerial
    );
  };

  const hasPackageID = (currentSelectedOption) => {
    return currentSelectedOption && "packageID" in currentSelectedOption;
  };

  const getInputName = (choiceName, hasPackageID) => {
    return hasPackageID ? `${choiceName}-Included in Package` : choiceName;
  };

  const getDisplayPrice = (
    currentSelectedOption,
    choicePrice,
    hasPackageID
  ) => {
    return hasPackageID ? currentSelectedOption.price : choicePrice;
  };

  const handleDropdownChange = (event) => {
    const selectedSerial = event.target.value;
    const selectedOption = getSelectedOption(selectedSerial, choices);

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
          const currentSelectedOption = getCurrentSelectedOption(choice.serial);
          const hasPackageIDValue = hasPackageID(currentSelectedOption);
          const inputName = getInputName(choice.name, hasPackageIDValue);
          const displayPriceValue = getDisplayPrice(
            currentSelectedOption,
            choice.price,
            hasPackageIDValue
          );

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
