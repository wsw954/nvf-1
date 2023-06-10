import data from "../../data/honda/civicTest";

export function initialChoices(currentState) {
  const trimsAvailable = data.find((option) => option.categoryName === "Trim");

  return trimsAvailable;
}

export function handleChange(currentState, selectedOption) {
  let updatedState = { ...currentState };
  const { categoryName, type, action, serial, checked } = selectedOption;
  if (action != null) {
    const {
      ancestor = null,
      optionPackage = null,
      parent = null,
      rival = null,
      sibling = null,
    } = action;
    if (ancestor != null) {
      updatedState = handleAncestor(currentState, selectedOption);
    }
    if (optionPackage != null) {
      updatedState = handleOptionPackage(currentState, selectedOption);
    }
    if (parent != null) {
      updatedState = handleParent(currentState, selectedOption);
    }
    if (rival != null) {
      updatedState = handleRival(currentState, selectedOption);
    }
    if (sibling != null) {
      updatedState = handleSibling(currentState, selectedOption);
    }
  }
  return handleRegularOptionChange(updatedState, selectedOption);
}

function handleAncestor(state, selectedOption) {
  // Do something with ancestor and state
  let newState = { ...state, ancestorProcessed: true };
  return newState;
}

function handleOptionPackage(updatedState, selectedOption) {
  let newState = { ...state, optionPackageProcessed: true };
  return newState;
}

function handleParent(state, selectedOption) {
  let newState = { ...state, parentProcessed: true };
  return newState;
}
function handleRival(state, selectedOption) {
  let newState = { ...state, rivalProcessed: true };
  return newState;
}
function handleSibling(state, selectedOption) {
  let newState = { ...state, siblingProcessed: true };
  return newState;
}

function handleRegularOptionChange(state, selectedOption) {
  const { categoryName, type, action, serial, checked } = selectedOption;
  if (checked) {
    return addOption(state, selectedOption);
  } else {
    return removeOption(state, selectedOption);
  }
}

function addOption(state, selectedOption) {
  const { categoryName, type, serial, checked } = selectedOption;
  const category = data.find((item) => item.categoryName === categoryName);
  let updatedSelectedChoices = [...state.selectedChoices]; // Make a copy of selectedChoices

  if (category) {
    const choice = category.choices.find((item) => item.serial === serial);

    if (choice) {
      const stateChoiceIndex = updatedSelectedChoices.findIndex(
        (item) => item.categoryName === categoryName
      );

      if (type === "Single") {
        if (stateChoiceIndex !== -1) {
          // Replace choices for the existing category
          updatedSelectedChoices[stateChoiceIndex].choices = [choice];
        } else {
          // Add a new category to selectedChoices
          updatedSelectedChoices.push({
            categoryName: category.categoryName,
            component: category.component,
            choices: [choice],
          });
        }
      } else if (type === "Multiple") {
        if (stateChoiceIndex !== -1) {
          const existingOptionIndex = updatedSelectedChoices[
            stateChoiceIndex
          ].choices.findIndex(
            (option) => option.serial === selectedOption.serial
          );
          if (existingOptionIndex === -1) {
            // Add a new choice to the existing category
            updatedSelectedChoices[stateChoiceIndex].choices.push(choice);
          }
        } else {
          // Add a new category to selectedChoices
          updatedSelectedChoices.push({
            categoryName: category.categoryName,
            component: category.component,
            choices: [choice],
          });
        }
      }
    }
  }

  // Spread the original state and update selectedChoices
  return { ...state, selectedChoices: updatedSelectedChoices };
}

function removeOption(state, selectedOption) {
  const { categoryName, type, action, serial, checked } = selectedOption;
  if (type === "Single") {
    console.log("Remove Single Choice Option");
  }
  if (type === "Multiple") {
    console.log("Remove Multiple Choice Option");
  }
}
