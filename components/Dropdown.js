import styles from "../styles/Bizzlle.module.css";

export default function Dropdown({ label, options }) {
  return (
    <div className={styles.optionsDropdownInputGroup}>
      <label className={styles.optionsDropdownLabel}>{label}</label>
      <select className={styles.optionsDropdownSelect}>
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
