import styles from "../styles/Bizzlle.module.css";

export default function CheckBoxGroup({ label, options }) {
  return (
    <div className={styles.optionsCheckBoxGroup}>
      <label className={styles.optionsCheckBoxGroupLabel}>{label}</label>
      <div className={styles.checkBoxContainer}>
        {options.map((option, index) => (
          <div key={index} className={styles.checkBoxItem}>
            <input
              type="checkbox"
              id={`${label}-${index}`}
              name={label}
              value={option}
            />
            <label htmlFor={`${label}-${index}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
