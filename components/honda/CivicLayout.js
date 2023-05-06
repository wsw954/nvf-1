// components/honda/CRVLayout.js

import { useState, useEffect } from "react";
import axios from "axios";

const CivicLayout = ({ selectedMake, selectedModel }) => {
  const [modelData, setModelData] = useState(null);

  useEffect(() => {
    const fetchModelData = async () => {
      if (!selectedMake || !selectedModel) return;
      const response = await axios.get(
        `/api/data/model/${selectedMake.toLowerCase()}/${selectedModel.toLowerCase()}`
      );
      setModelData(response.data);
    };

    fetchModelData();
  }, [selectedMake, selectedModel]);

  return (
    <div className={styles.container}>
      {selectedModel && (
        <div className={styles.inputGroup}>
          <label htmlFor="trim" className={styles.label}>
            Trim:
          </label>
          <select
            id="trim"
            value={selectedTrim}
            onChange={handleTrimChange}
            className={styles.select}
          >
            <option value="">Select Trim</option>
            {trims.map((trim) => (
              <option key={trim} value={trim}>
                {trim}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* {selectedTrim && (
        <div>
          <h3>Options</h3>
          {options.single.map((optionGroup, index) => (
            <Dropdown
              key={index}
              label={optionGroup.label}
              options={optionGroup.options}
            />
          ))}
          {options.multiple.map((optionGroup, index) => (
            <CheckBoxGroup
              key={index}
              label={optionGroup.label}
              options={optionGroup.options}
            />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default CivicLayout;
