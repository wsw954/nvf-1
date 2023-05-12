import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Bizzlle.module.css";
import dynamic from "next/dynamic";

export default function Bizzlle() {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [models, setModels] = useState([{ name: "", layout: "" }]);
  const [selectedModel, setSelectedModel] = useState("");
  const [Layout, setLayout] = useState(null);

  useEffect(() => {
    const fetchMakes = async () => {
      const response = await axios.get("/api/makes");
      setMakes(response.data);
    };
    fetchMakes();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (selectedMake) {
        const response = await axios.get(`/api/models?make=${selectedMake}`);
        setModels(response.data);
      } else {
        setModels([]);
      }
    };
    setSelectedModel("");
    setLayout(null);
    fetchModels();
  }, [selectedMake]);

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
    setSelectedModel("");
    setLayout(null);
  };

  const handleModelChange = async (e) => {
    const selectedModelName = e.target.value;
    const selectedModelObj = models.find(
      (model) => model.name === selectedModelName
    );

    if (selectedModelObj) {
      setSelectedModel(selectedModelObj.name);

      const DynamicLayout = dynamic(
        () =>
          import(`/components/${selectedModelObj.layout}`).catch(() => ({
            default: () => <div>Error loading layout</div>,
          })),
        {
          loading: () => <div>Loading layout...</div>,
          ssr: false,
        }
      );

      setLayout(() => DynamicLayout);
    } else {
      setSelectedModel("");
      setLayout(null);
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
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {Layout && (
        <Layout selectedMake={selectedMake} selectedModel={selectedModel} />
      )}
    </div>
  );
}
