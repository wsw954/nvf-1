import { useEffect, useReducer } from "react";
import { reducer } from "../state/reducer";

export default function Layout1({ selectedMake, selectedModel }) {
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

  useEffect(() => {
    const kebabCaseModelName = selectedModel.split(" ").join("-").toLowerCase();
    import(
      `../configurations/${selectedMake.toLowerCase()}/${kebabCaseModelName}A`
    ).then((module) => {
      dispatch({
        type: "INITIAL_CONFIGURATION",
        payload: module.initialChoices(),
      });
    });
  }, [selectedMake, selectedModel]);

  return (
    <div>
      LayoutA{" "}
      {state.availableChoices &&
        state.availableChoices.map(
          ({ categoryName, component: CategoryComponent, choices }, index) => {
            // Render only first dropdown initially, then according to showNextCategory flag
            if (index === 0 || showNextCategory) {
              return (
                <div key={categoryName}>
                  <CategoryComponent
                    categoryName={categoryName}
                    choices={choices}
                    onChange={(categoryName, selectedOption) =>
                      handleChange(categoryName, selectedOption)
                    }
                    selectedOptions={[]}
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
