import data from "../../data/honda/civicTest";

export function initialChoices(currentState) {
  const choicesAvailable = data.find(
    (option) => option.categoryName === "Trim"
  );

  return choicesAvailable;
}

export function handleChange(currentState, selectedOption) {
  let updatedState = { ...currentState };
  const { action } = selectedOption;

  if (action != null) {
    //Destructure the action object, assigning null to any object that doesn't exists
    const {
      ancestor = null,
      sponsor = null,
      optionPackage = null,
      parent = null,
      rival = null,
      sibling = null,
    } = action;
    if (ancestor != null) {
      updatedState = handleAncestor(ancestor, currentState, selectedOption);
    }
    if (sponsor != null) {
      updatedState = handleSponsor(sponsor, currentState, selectedOption);
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

function handleAncestor(ancestorArray, state, selectedOption) {
  const { categoryName, type, action, serial, checked } = selectedOption;

  const newChoicesAvailable = getDescendents(
    ancestorArray,
    categoryName,
    serial
  );

  const ancestorCategoryChoices = state.availableChoices.filter(
    (choice) => choice.categoryName === categoryName
  );

  const updatedAvailableChoices = [
    ...ancestorCategoryChoices,
    ...newChoicesAvailable,
  ];

  const updatedSelectedChoices = state.selectedChoices.filter(
    (choice) => choice.categoryName === categoryName
  );

  return {
    ...state,
    availableChoices: updatedAvailableChoices,
    selectedChoices: updatedSelectedChoices,
  };
}

function handleSponsor(sponsorArray, state, selectedOption) {
  const { categoryName, type, action, serial, checked } = selectedOption;
  let newState = { ...state };
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

function getDescendents(ancestorArray, categoryName, serial) {
  let filteredData = data;

  if (ancestorArray.length > 0) {
    filteredData = data.filter((item) =>
      ancestorArray.includes(item.categoryName)
    );
  }
  const newChoicesAvailable = filteredData
    .filter((item) => item.categoryName !== categoryName) // Skip the object with same categoryName
    .map((item) => ({
      ...item,
      choices: item.choices.filter(
        (choice) => choice.descendent && choice.descendent.includes(serial)
      ),
    }));
  return newChoicesAvailable;
}

function addOption(state, selectedOption) {
  const { categoryName, type, serial } = selectedOption;

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
            updatedSelectedChoices[stateChoiceIndex].choices.push(choice);
          }
        } else {
          updatedSelectedChoices.push({
            categoryName: category.categoryName,
            component: category.component,
            choices: [choice],
          });
        }
      }
    }
  }
  return { ...state, selectedChoices: updatedSelectedChoices };
}

function removeOption(state, selectedOption) {
  const { categoryName, serial } = selectedOption;

  let updatedSelectedChoices = [...state.selectedChoices]; // Make a copy of selectedChoices

  const categoryIndex = updatedSelectedChoices.findIndex(
    (item) => item.categoryName === categoryName
  );

  if (categoryIndex !== -1) {
    const choiceIndex = updatedSelectedChoices[categoryIndex].choices.findIndex(
      (item) => item.serial === serial
    );

    if (choiceIndex !== -1) {
      // Remove the choice
      updatedSelectedChoices[categoryIndex].choices.splice(choiceIndex, 1);

      // If no choices remain in this category, remove the category
      if (updatedSelectedChoices[categoryIndex].choices.length === 0) {
        updatedSelectedChoices.splice(categoryIndex, 1);
      }
    }
  }

  return { ...state, selectedChoices: updatedSelectedChoices };
}
