import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Bizzlle.module.css";
import dynamic from "next/dynamic";
import Dropdown from "/components/Dropdown";

export default function Bizzlle() {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [models, setModels] = useState([{ name: "", layout: "" }]);
  const [selectedModel, setSelectedModel] = useState({ name: "", layout: "" });
  const [Layout, setLayout] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (url, setter) => {
    try {
      const response = await axios.get(url);
      setter(response.data);
    } catch (error) {
      console.error(
        `An error occurred while fetching the data from url: ${url}`,
        error
      );
      setError("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData("/api/makes", setMakes);
  }, []);

  useEffect(() => {
    setSelectedModel({ name: "", layout: "" });
    setLayout(null);
  }, [selectedMake]);

  const handleMakeChange = async (choice) => {
    setSelectedMake(choice);
    fetchData(`/api/models?make=${choice}`, setModels);
  };

  function handleModelChange(choice) {
    const selectedModelObj = models.find((model) => model.name === choice);
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
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bizzlle 1.0</h1>
      <div className={styles.form}>
        <Dropdown
          categoryName="Make"
          choices={makes.map((make) => ({ name: make }))}
          onChange={handleMakeChange}
          selectedChoice={selectedMake}
        />
      </div>
      {selectedMake && (
        <Dropdown
          categoryName="Model"
          choices={models}
          onChange={handleModelChange}
          selectedChoice={selectedModel.name}
        />
      )}
      {Layout && (
        <Layout
          selectedMake={selectedMake}
          selectedModel={selectedModel.name}
        />
      )}
    </div>
  );
}
