import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Bizzlle.module.css";
import dynamic from "next/dynamic";

export default function Bizzlle() {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [models, setModels] = useState([{ name: "", layout: "" }]);
  const [selectedModel, setSelectedModel] = useState({ name: "", layout: "" });
  const [Layout, setLayout] = useState(null);
  const [modelConfig, setModelConfig] = useState([]);

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
    setLayout(null);
  };

  const handleModelChange = async (e) => {
    const selectedModelName = e.target.value;
    const selectedModelObj = models.find(
      (model) => model.name === selectedModelName
    );

    if (selectedModelObj) {
      setSelectedModel(selectedModelObj);

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

      const kebabCaseModelName = selectedModelName
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/\s+/g, "-")
        .toLowerCase();

      const importedModelConfig = await import(
        `/configurations/${selectedMake.toLowerCase()}/${kebabCaseModelName}`
      ).catch(() => {
        console.error(`Error loading configuration for ${selectedModelName}`);
        return { default: [] };
      });

      setModelConfig(importedModelConfig.default);
    } else {
      setSelectedModel({ name: "", layout: "" });
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
      {Layout && (
        <Layout
          selectedMake={selectedMake}
          selectedModel={selectedModel}
          categoryConfigurations={modelConfig}
        />
      )}
    </div>
  );
}
