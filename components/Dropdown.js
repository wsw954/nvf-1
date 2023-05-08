import styles from "../styles/Bizzlle.module.css";

export default function Dropdown({ categoryName, choices }) {
  return (
    <div className={styles.optionsDropdownInputGroup}>
      <label className={styles.optionsDropdownLabel}>{categoryName}</label>
      <select className={styles.optionsDropdownSelect}>
        <option value="">Select an option</option>
        {choices.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
