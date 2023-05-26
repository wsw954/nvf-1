import { useState, useEffect } from "react";

export default function Layout1({ selectedMake, selectedModel }) {
  const [configuration, setConfiguration] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showNextCategory, setShowNextCategory] = useState(false);

  useEffect(() => {
    if (selectedMake && selectedModel) {
      const kebabCaseModelName = selectedModel
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/\s+/g, "-")
        .toLowerCase();

      import(
        `../configurations/${selectedMake.toLowerCase()}/${kebabCaseModelName}`
      )
        .then((config) => {
          setConfiguration(config.default);
          const initialSelectedOptions = config.default.reduce(
            (acc, current) => {
              acc[current.categoryName] = [];
              return acc;
            },
            {}
          );
          setSelectedOptions(initialSelectedOptions);
        })
        .catch((error) => {
          console.error(
            `Error loading configuration for ${selectedMake} ${selectedModel}: `,
            error
          );
        });
    }
  }, [selectedMake, selectedModel]);

  const handleChange = (categoryName, selectedOption) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [categoryName]: selectedOption,
    }));

    if (configuration[0].categoryName === categoryName) {
      setShowNextCategory(true);
    }
  };

  return (
    <div>
      Layout1
      {configuration &&
        configuration.map(
          ({ categoryName, component: CategoryComponent, choices }, index) => {
            // Render only first dropdown initially, then according to showNextCategory flag
            if (index === 0 || showNextCategory) {
              return (
                <div key={categoryName}>
                  <CategoryComponent
                    categoryName={categoryName}
                    choices={choices}
                    onChange={(categoryName, [selectedOption]) =>
                      handleChange(categoryName, [selectedOption])
                    }
                    selectedOptions={selectedOptions[categoryName] || []}
                  />
                </div>
              );
            }
            return null;
          }
        )}
    </div>
  );
}
