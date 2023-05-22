import { useState, useEffect, useContext } from "react";
import styles from "../styles/Bizzlle.module.css";
import AppContext from "/state/AppContext";

export default function Layout2({ selectedMake, selectedModel }) {
  const [configuration, setConfiguration] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  // const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    if (selectedMake && selectedModel) {
      const kebabCaseModelName = selectedModel
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/\s+/g, "-")
        .toLowerCase();
      import(
        `../configurations/${selectedMake.toLowerCase()}/${kebabCaseModelName}`
      ).then((config) => {
        setConfiguration(config.default);
        // Initialize selected options for each category with null
        const initialSelectedOptions = config.default.reduce((acc, current) => {
          acc[current.categoryName] = null;
          return acc;
        }, {});
        setSelectedOptions(initialSelectedOptions);
      });
    }
  }, [selectedMake, selectedModel]);

  const handleChange = (categoryName, selectedOptions) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [categoryName]: selectedOptions,
    }));
  };

  return (
    <div>
      Layout2
      {configuration &&
        configuration.map(
          ({ categoryName, component: CategoryComponent, choices }) => {
            return (
              <div key={categoryName}>
                <h3>{categoryName}</h3>
                <CategoryComponent
                  categoryName={categoryName}
                  choices={choices}
                  onChange={(selectedOptions) =>
                    handleChange(categoryName, selectedOptions)
                  }
                  selectedOptions={selectedOptions[categoryName] || []}
                />
              </div>
            );
          }
        )}
    </div>
  );
}
