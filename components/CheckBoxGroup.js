import styles from "../styles/Bizzlle.module.css";

export default function CheckBoxGroup({
  categoryName,
  choices,
  onChange,
  selectedOptions,
}) {
  const getSelectedOption = (selectedSerial, choices) => {
    return choices.find((option) => option.serial === selectedSerial);
  };

  const getUnselectedOptionPackageId = (selectedSerial, selectedOptions) => {
    const unselectedOption = selectedOptions.find(
      (selectedOption) => selectedOption.serial === selectedSerial
    );

    if (unselectedOption && "packageID" in unselectedOption) {
      return unselectedOption.packageID;
    }

    return null;
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

  const handleCheckBoxChange = (event) => {
    const isChecked = event.target.checked;
    const selectedSerial = event.target.value;
    const selectedOption = getSelectedOption(selectedSerial, choices);
    let packageID = isChecked
      ? null
      : getUnselectedOptionPackageId(selectedSerial, selectedOptions);

    if (selectedOption && onChange) {
      const modifiedSelectedOption = {
        ...selectedOption,
        categoryName: categoryName,
        type: "CheckBoxGroup",
        checked: isChecked,
        ...(packageID && { packageID: packageID }),
      };
      onChange(modifiedSelectedOption);
    }
  };

  return (
    <div className={styles.optionsCheckBoxGroup}>
      <label className={styles.optionsCheckBoxGroupLabel}>{categoryName}</label>
      <div className={styles.checkBoxContainer}>
        {choices.map((choice, index) => {
          const currentSelectedOption = getCurrentSelectedOption(choice.serial);
          const hasPackageIDValue = hasPackageID(currentSelectedOption);
          const inputName = getInputName(choice.name, hasPackageIDValue);
          const displayPrice = getDisplayPrice(
            currentSelectedOption,
            choice.price,
            hasPackageIDValue
          );

          return (
            <div key={choice.name} className={styles.checkBoxItem}>
              <input
                type="checkbox"
                id={`${choice.serial}`}
                name={inputName}
                value={choice.serial}
                onChange={handleCheckBoxChange}
                checked={!!currentSelectedOption}
              />
              <label htmlFor={`${choice.name}-${index}`}>
                {inputName + "- $" + displayPrice}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
