import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import styles from "../styles/Bizzlle.module.css";

export default function Layout1({ selectedMake, selectedModel }) {
  const [configuration, setConfiguration] = useState(null);

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
  console.log(configuration);

  return (
    <div>
      {configuration &&
        configuration.map(
          ({ categoryName, component: CategoryComponent, choices }) => (
            <div key={categoryName}>
              <h3>{categoryName}</h3>
              <CategoryComponent name={categoryName} choices={choices} />
            </div>
          )
        )}
    </div>
  );
}
