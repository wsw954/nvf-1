import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Bizzlle.module.css";
import Dropdown from "/components/dropdown.js";
import CheckBoxGroup from "/components/checkboxgroup.js";
import OptionsForm from "/components/OptionsForm.js";

export default function Bizzlle() {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [models, setModels] = useState([{ name: "", layout: "" }]);
  const [selectedModel, setSelectedModel] = useState({ name: "", layout: "" });

  useEffect(() => {
    const fetchMakes = async () => {
      const response = await axios.get("/api/makes");
      setMakes(response.data);
    };
    fetchMakes();
  }, []);

  const handleMakeChange = async (e) => {
    setSelectedMake(e.target.value);
    if (e.target.value) {
      const response = await axios.get(`/api/models?make=${e.target.value}`);
      setModels(response.data);
      setSelectedModel({ name: "", layout: "" });
    } else {
      setModels([]);
    }
  };

  const handleModelChange = async (e) => {
    const selectedModelName = e.target.value;
    const selectedModelObj = models.find(
      (model) => model.name === selectedModelName
    );
    setSelectedModel(selectedModelObj || { name: "", layout: "" });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bizzlle 1.0</h1>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="make" className={styles.label}>
            Make:
          </label>
          <select
            id="make"
            value={selectedMake}
            onChange={handleMakeChange}
            className={styles.select}
          >
            <option value="">Select Make</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedMake && (
        <div className={styles.inputGroup}>
          <label htmlFor="model" className={styles.label}>
            Model:
          </label>
          <select
            id="model"
            value={selectedModel.name}
            onChange={handleModelChange}
            className={styles.select}
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedModel.name && (
        <OptionsForm
          selectedMake={selectedMake}
          selectedModel={selectedModel}
        />
      )}
    </div>
  );
}
