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
        type: "Multiple",
        checked: isChecked,
      };
      onChange(modifiedSelectedOption);
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
              onChange={handleCheckBoxChange}
              checked={selectedOptions.some(
                (selectedOption) => selectedOption.name === option.name
              )}
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
