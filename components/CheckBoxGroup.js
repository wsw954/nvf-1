import styles from "../styles/Bizzlle.module.css";

export default function CheckBoxGroup({
  categoryName,
  choices,
  onChange,
  selectedOptions,
}) {
  const handleCheckBoxChange = (event) => {
    console.log(selectedOptions);
    const option = choices.find((choice) => choice.name === event.target.value);
    if (event.target.checked) {
      // add the selected option to the array of selected options
      onChange(categoryName, [...selectedOptions, option]);
    } else {
      // remove the unselected option from the array of selected options
      const newSelectedOptions = selectedOptions.filter(
        (prevOption) => prevOption.name !== option.name
      );
      onChange(categoryName, newSelectedOptions);
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
