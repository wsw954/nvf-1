// pages/index.js
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Bizzlle.module.css";

const Bizzlle = () => {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [trims, setTrims] = useState([]);
  const [selectedTrim, setSelectedTrim] = useState("");
  const [options, setOptions] = useState({ single: [], multiple: [] });

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
    } else {
      setModels([]);
    }
  };
  const handleModelChange = async (e) => {
    setSelectedModel(e.target.value);
    if (e.target.value) {
      const response = await axios.get(
        `/api/trims/${selectedMake.toLowerCase()}/${e.target.value.toLowerCase()}`
      );
      setTrims(response.data);
    } else {
      setTrims([]);
    }
  };

  const handleTrimChange = async (e) => {
    setSelectedTrim(e.target.value);
    console.log("Tets");
    if (e.target.value) {
      const response = await axios.get(
        `/api/vehicleOptions?make=${selectedMake}&model=${selectedModel}&trim=${e.target.value}`
      );
      setOptions(response.data);
    } else {
      setOptions({ single: [], multiple: [] });
    }
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
            value={selectedModel}
            onChange={handleModelChange}
            className={styles.select}
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}
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
    </div>
  );
};

export default Bizzlle;
