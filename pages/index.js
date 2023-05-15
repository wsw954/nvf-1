import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Bizzlle.module.css";
import dynamic from "next/dynamic";
import Dropdown from "/components/Dropdown";

export default function Bizzlle() {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [models, setModels] = useState([{ name: "", layout: "" }]);
  const [selectedModel, setSelectedModel] = useState("");
  const [Layout, setLayout] = useState(null);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await axios.get("/api/makes");
        setMakes(response.data);
      } catch (error) {
        console.error("An error occurred while fetching the makes:", error);
      }
    };
    fetchMakes();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        if (selectedMake) {
          const response = await axios.get(`/api/models?make=${selectedMake}`);
          setModels(response.data);
        } else {
          setModels([]);
        }
      } catch (error) {
        console.error("An error occurred while fetching the models:", error);
      }
    };
    setSelectedModel("");
    setLayout(null);
    fetchModels();
  }, [selectedMake]);

  const handleModelChange = async (selectedModelName) => {
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
        <Dropdown
          categoryName="Make"
          choices={makes.map((make) => ({ name: make }))}
          onSelectChange={(value) => {
            setSelectedMake(value);
            setSelectedModel("");
            setLayout(null);
          }}
        />
      </div>
      {selectedMake && (
        <Dropdown
          categoryName="Model"
          choices={models}
          onSelectChange={handleModelChange}
        />
      )}
      {Layout && (
        <Layout selectedMake={selectedMake} selectedModel={selectedModel} />
      )}
    </div>
  );
}
