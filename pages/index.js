import { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "../styles/Bizzlle.module.css";
import dynamic from "next/dynamic";
import Dropdown from "/components/Dropdown";
import AppContext from "/state/AppContext";

export default function Bizzlle() {
  const [makes, setMakes] = useState([]);
  const { state, dispatch } = useContext(AppContext);
  const [models, setModels] = useState([{ name: "", layout: "" }]);
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

  async function handleMakeChange(choice) {
    try {
      if (!choice) {
        throw new Error("Invalid choice selected");
      }
      dispatch({
        type: "MAKE_SELECTED",
        payload: { make: choice },
      });
      const response = await axios.get(`/api/models?make=${choice}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch models");
      }
      setModels(response.data);
      setLayout(null);
    } catch (error) {
      console.error(error);
      // handle the error here, e.g., show an error message to the user
    }
  }

  function handleModelChange(choice) {
    try {
      if (!choice) {
        throw new Error("Invalid choice selected");
      }
      dispatch({
        type: "MODEL_SELECTED",
        payload: { model: choice },
      });
      const selectedModelObj = models.find((model) => model.name === choice);
      if (!selectedModelObj) {
        throw new Error("Failed to find selected model");
      }
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
    } catch (error) {
      console.error(error);
      // handle the error here, e.g., show an error message to the user
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bizzlle 1.0</h1>
      <div className={styles.form}>
        <Dropdown
          categoryName="Make"
          choices={makes.map((make) => ({ name: make }))}
          onSelectChange={handleMakeChange}
        />
      </div>
      {state.selectedMake && (
        <Dropdown
          categoryName="Model"
          choices={models}
          onSelectChange={handleModelChange}
        />
      )}
      {Layout && (
        <Layout
          selectedMake={state.selectedMake}
          selectedModel={state.selectedModel}
        />
      )}
    </div>
  );
}
