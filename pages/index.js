import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Bizzlle.module.css";
import dynamic from "next/dynamic";
import Dropdown from "/components/Dropdown";

export default function Bizzlle() {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState({
    name: "",
    layout: "",
    serial: "",
  });
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

  const handleMakeChange = async (selectedOption) => {
    setSelectedMake(selectedOption);
    setSelectedModel({ name: "", layout: "" });
    setLayout(null);
    fetchData(`/api/models?make=${selectedOption.name}`, setModels);
  };

  function handleModelChange(selectedOption) {
    if (!selectedOption || selectedOption.serial === "") {
      setSelectedModel({ name: "", layout: "", serial: "" });
      setLayout(null);
      return;
    } else {
      setSelectedModel(selectedOption);
      setLayout(null);

      const DynamicLayout = dynamic(
        () =>
          import(`/components/${selectedOption.layout}`).catch(() => ({
            default: () => <div>Error loading layout</div>,
          })),
        {
          loading: () => <div>Loading layout...</div>,
          ssr: false,
        }
      );
      setLayout(() => DynamicLayout);
    }
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
          choices={makes.map((make, index) => ({
            name: make,
            serial: index + 1,
          }))} //Pass a serial
          onChange={handleMakeChange}
          selectedOptions={[
            { name: selectedMake.name, serial: selectedMake.serial },
          ]}
        />
      </div>
      {selectedMake && (
        <Dropdown
          categoryName="Model"
          choices={models.map((model, index) => ({
            ...model,
            serial: `${selectedMake.name}-${index + 1}`,
          }))} //Pass serial
          onChange={handleModelChange}
          selectedOptions={[
            { name: selectedModel.name, serial: selectedModel.serial },
          ]}
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
