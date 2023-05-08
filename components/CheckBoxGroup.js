import styles from "../styles/Bizzlle.module.css";

export default function CheckBoxGroup({ categoryName, choices }) {
  return (
    <div className={styles.optionsCheckBoxGroup}>
      <label className={styles.optionsCheckBoxGroupLabel}>{categoryName}</label>
      <div className={styles.checkBoxContainer}>
        {choices.map((option, index) => (
          <div key={index} className={styles.checkBoxItem}>
            <input
              type="checkbox"
              id={`${option}-${index}`}
              name={option}
              value={option}
            />
            <label htmlFor={`${option}-${index}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
