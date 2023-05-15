import { useState, useEffect } from "react";
import styles from "../styles/Bizzlle.module.css";

export default function Layout1({ selectedMake, selectedModel }) {
  const [configuration, setConfiguration] = useState(null);
  // const [selectedChoice, setSelectedChoice] = useState("");

  useEffect(() => {
    if (selectedMake && selectedModel) {
      const kebabCaseModelName = selectedModel
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/\s+/g, "-")
        .toLowerCase();
      import(
        `../configurations/${selectedMake.toLowerCase()}/${kebabCaseModelName}`
      ).then((config) => setConfiguration(config.default));
    }
  }, [selectedMake, selectedModel]);

  const handleSelectChange = (event) => {
    // setSelectedChoice(event.target.value);
    console.log("Line 23 in Layout, handleSelectChange");
    console.log(event);
  };

  return (
    <div>
      {configuration &&
        configuration.map(
          ({ categoryName, component: CategoryComponent, choices }) => (
            <div key={categoryName}>
              <h3>{categoryName}</h3>
              <CategoryComponent
                categoryName={categoryName}
                choices={choices}
                onSelectChange={handleSelectChange}
              />
            </div>
          )
        )}
    </div>
  );
}
