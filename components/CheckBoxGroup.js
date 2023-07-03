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
        {choices.map((choice, index) => (
          <div key={choice.name} className={styles.checkBoxItem}>
            <input
              type="checkbox"
              id={`${choice.name}`}
              name={choice.name}
              value={choice.serial}
              onChange={handleCheckBoxChange}
              checked={selectedOptions.some(
                (selectedOption) => selectedOption.serial === choice.serial
              )}
              data-serial={choice.serial}
            />
            <label htmlFor={`${choice.name}-${index}`}>
              {choice.name + "- $" + choice.price}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
