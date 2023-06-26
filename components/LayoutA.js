import { useEffect, useReducer, useState, useCallback } from "react";
import { reducer } from "../state/reducer";
import Popup from "/components/Popup";

export default function LayoutA({ selectedMake, selectedModel }) {
  const initialState = {
    availableChoices: [],
    selectedChoices: [],
    popup: {
      visible: false,
      message: "",
      selectedOption: null,
    },
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [configuration, setConfiguration] = useState(null);

  useEffect(() => {
    const kebabCaseModelName = selectedModel.split(" ").join("-").toLowerCase();

    async function loadConfiguration() {
      try {
        const module = await import(
          `../configurations/${selectedMake.toLowerCase()}/${kebabCaseModelName}`
        );
        setConfiguration(module);
        dispatch({
          type: "INITIAL_CONFIGURATION",
          payload: module.initialChoices(state),
        });
      } catch (error) {
        console.error(
          `Failed to load configuration for ${selectedMake} ${selectedModel}: `,
          error
        );
        // Additional code for error display
      }
    }

    loadConfiguration();
  }, [selectedMake, selectedModel]);
  const handleOptionChange = useCallback(
    (selectedOption) => {
      if (configuration) {
        const updatedChoices = configuration.handleOptionChange(
          state,
          selectedOption
        );
        dispatch({
          type: "OPTION_CHANGE",
          payload: updatedChoices,
        });
      }
    },
    [configuration, state]
  );

  const handlePopupConfirm = (selectedOption) => {
    if (configuration) {
      const updatedForm = configuration.handlePopupConfirm(
        state,
        selectedOption
      );
      dispatch({
        type: "POPUP_CONFIRM",
        payload: updatedForm,
      });
    }
  };
  const handlePopupCancel = (selectedOption) => {
    if (configuration) {
      const updatedForm = configuration.handlePopupCancel(
        state,
        selectedOption
      );
      dispatch({
        type: "POPUP_CANCEL",
        payload: updatedForm,
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
                  onChange={(selectedOption) =>
                    handleOptionChange(selectedOption)
                  }
                  selectedOptions={selectedOptions}
                />
              </div>
            );
          }
        )}
      {state.popup.visible && (
        <Popup
          message={state.popup.message}
          confirmAction={() => handlePopupConfirm(state.popup.selectedOption)}
          cancelAction={() => handlePopupCancel(state.popup.selectedOption)}
        />
      )}
    </div>
  );
}
