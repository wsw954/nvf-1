import styles from "../styles/Bizzlle.module.css";

export default function CheckBoxGroup({
  categoryName,
  choices,
  onChange,
  selectedOptions,
}) {
  const handleCheckBoxChange = (event) => {
    const selectedName = event.target.value;
    const isChecked = event.target.checked;
    const selectedOption = choices.find(
      (option) => option.name === selectedName
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
              value={choice.name}
              onChange={handleCheckBoxChange}
              checked={selectedOptions.some(
                (selectedOption) => selectedOption.name === choice.name
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
