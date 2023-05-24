import styles from "../styles/Bizzlle.module.css";

export default function CheckBoxGroup({
  categoryName,
  choices,
  onChange,
  selectedOptions,
}) {
  const handleCheckBoxChange = (event) => {
    const option = choices.find((choice) => choice.name === event.target.value);
    if (event.target.checked) {
      // add the selected option to the array of selected options
      onChange([...selectedOptions, option]);
    } else {
      // remove the unselected option from the array of selected options
      onChange((prevSelectedOptions) =>
        prevSelectedOptions.filter(
          (prevOption) => prevOption.name !== option.name
        )
      );
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
              checked={
                selectedOptions
                  ? selectedOptions.some(
                      (selectedOption) => selectedOption.name === option.name
                    )
                  : false
              }
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
