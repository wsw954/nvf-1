import { useEffect, useReducer, useState } from "react";
import { reducer } from "../state/reducer";

export default function LayoutA({ selectedMake, selectedModel }) {
  const initialState = {
    availableChoices: [],
    selectedChoices: [],
    popup: {
      visible: false,
      message: "",
      confirmAction: null,
      categoryName: null,
      selectedOption: null,
    },
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [configuration, setConfiguration] = useState(null);

  useEffect(() => {
    const kebabCaseModelName = selectedModel.split(" ").join("-").toLowerCase();
    import(
      `../configurations/${selectedMake.toLowerCase()}/${kebabCaseModelName}`
    ).then((module) => {
      setConfiguration(module);
      dispatch({
        type: "INITIAL_CONFIGURATION",
        payload: module.initialChoices(state),
      });
    });
  }, [selectedMake, selectedModel]);

  const handleOptionChange = (categoryName, selectedOption) => {
    if (configuration) {
      const updatedChoices = configuration.handleChange(state, selectedOption);
      dispatch({
        type: "OPTION_CHANGE",
        payload: updatedChoices,
      });
    }
  };

  return (
    <div>
      LayoutA{" "}
      {state.availableChoices &&
        state.availableChoices.map(
          ({ categoryName, component: CategoryComponent, choices }, index) => {
            const selectedCategory = state.selectedChoices.find(
              (choice) => choice.categoryName === categoryName
            );
            const selectedOptions = selectedCategory
              ? selectedCategory.choices
              : [];
            return (
              <div key={categoryName}>
                <CategoryComponent
                  categoryName={categoryName}
                  choices={choices}
                  onChange={(categoryName, selectedOption) =>
                    handleOptionChange(categoryName, selectedOption)
                  }
                  selectedOptions={selectedOptions}
                />
              </div>
            );
          }
        )}
    </div>
  );
}
