import styles from "../styles/Bizzlle.module.css";

export default function CheckBoxGroup({
  categoryName,
  choices,
  onChange,
  selectedOptions,
}) {
  const handleCheckBoxChange = (event) => {
    const isChecked = event.target.checked;
    const selectedSerial = event.target.value;
    const selectedOption = choices.find(
      (option) => option.serial === selectedSerial
    );

    if (selectedOption && onChange) {
      const modifiedSelectedOption = {
        ...selectedOption,
        categoryName: categoryName,
        type: "CheckBoxGroup",
        checked: isChecked,
      };
      onChange(modifiedSelectedOption);
    }
  };

  return (
    <div className={styles.optionsCheckBoxGroup}>
      <label className={styles.optionsCheckBoxGroupLabel}>{categoryName}</label>
      <div className={styles.checkBoxContainer}>
        {choices.map((choice, index) => {
          const currentSelectedOption = selectedOptions.find(
            (selectedOption) => selectedOption.serial === choice.serial
          );
          const hasPackageID =
            currentSelectedOption && "packageID" in currentSelectedOption; //Check if part of package
          const inputName = hasPackageID
            ? `${choice.name}-Included in Package`
            : choice.name; //Notification if currentSelectedOption is part of package
          const displayPrice = hasPackageID
            ? currentSelectedOption.price
            : choice.price; //Display Price different for package component

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
