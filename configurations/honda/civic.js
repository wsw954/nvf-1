import data from "../../data/honda/civicTest";
import Dropdown from "../../components/Dropdown";
import CheckBoxGroup from "../../components/CheckBoxGroup";

export function initialChoices(currentState) {
  const choicesAvailable = data.find(
    (option) => option.categoryName === "Trim"
  );

  return choicesAvailable;
}

export const actionTypes = {
  ANCESTOR: "ancestor",
  SPONSOR: "sponsor",
  REMOVER: "remover",
  PACKAGE_OPTION: "packageOption",
  PARENT: "parent",
  RIVALS: "rivals",
  SIBLING: "sibling",
};

export function handleOptionChange(state, selectedOption) {
  let updatedState = { ...state };
  const { action } = selectedOption || {};

  const actionHandlers = {
    [actionTypes.SPONSOR]: handleSponsor,
    [actionTypes.REMOVER]: handleRemover,
    [actionTypes.RIVALS]: handleRival,
    [actionTypes.PACKAGE_OPTION]: handlePackageOption,
    [actionTypes.PARENT]: handleParent,
    [actionTypes.SIBLING]: handleSibling,
  };

  if (!action) {
    return handleRegularOptionChange(updatedState, selectedOption);
  }

  if (
    actionTypes.ANCESTOR in action &&
    Array.isArray(action[actionTypes.ANCESTOR])
  ) {
    updatedState = handleAncestor(updatedState, selectedOption);
    if (updatedState.popup.visible) return updatedState;
    return handleRegularOptionChange(updatedState, selectedOption);
  }

  for (const actionName in action) {
    if (
      actionName in actionHandlers &&
      action[actionName] != null &&
      !(Array.isArray(action[actionName]) && action[actionName].length === 0)
    ) {
      updatedState = actionHandlers[actionName](updatedState, selectedOption);
      if (updatedState.popup.visible) return updatedState;
    }
  }

  return updatedState;
}

export function handlePopupConfirm(state, selectedOption) {
  let updatedState = { ...state };
  const { action } = selectedOption;
  const {
    rivals = null,
    parent = null,
    sibling = null,
    packageOption = null,
  } = action;
  //Loop for rivals
  if (rivals) {
    for (let rival of rivals) {
      const rivalChoice = getChoices(rival);
      let modifiedRivalChoice = {
        ...rivalChoice[0].choices[0],
        categoryName: rivalChoice[0].categoryName,
      };

      updatedState = removeSelectedChoices(updatedState, modifiedRivalChoice); //This removes the rival choice
      //Destructure the modifiedRivalChoice to get action & packageOption
      const { action: { packageOption = [] } = {} } = modifiedRivalChoice;
      if (packageOption.length > 0) {
        //Mark each rival choice unchecked
        modifiedRivalChoice = { ...modifiedRivalChoice, checked: false };
        updatedState = handlePackageOption(updatedState, modifiedRivalChoice); //This removes the components of the rival option
      }
    }
  }
  if (packageOption) {
    updatedState = handlePackageOption(updatedState, selectedOption);
  }

  return { ...updatedState, popup: false, message: "", selectedOption: null };
}

export function handlePopupCancel(state, selectedOption) {
  let updatedState = { ...state };

  const { action, checked } = selectedOption;

  const { rivals = null, sibling = null } = action;
  //Handle rival selection
  if (rivals != null && checked) {
    updatedState = removeSelectedChoices(updatedState, selectedOption);
  }

  return { ...updatedState, popup: false, message: "", selectedOption: null };
}

//Helper function to ancestor option
function handleAncestor(state, selectedOption) {
  const { categoryName, type, action, serial, checked } = selectedOption;

  const newChoicesAvailable = getDescendents(categoryName, serial);
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

function handleSponsor(state, selectedOption) {
  const { categoryName, action: { sponsor } = {}, serial } = selectedOption;
  let recipientChoices = getChoices(sponsor);

  let updatedAvailableChoices = recipientChoices.reduce(
    (choices, choice) => addAvailableChoices(state, choice),
    [...state.availableChoices]
  );
  let updatedState = { ...state, availableChoices: updatedAvailableChoices };
  return handleRegularOptionChange(updatedState, selectedOption);
}

//Helper function when rival option selected
function handleRival(state, selectedOption) {
  const { action: { rival = [] } = {} } = selectedOption;
  const rivalStatus = checkIfRivalSelected(
    state.selectedChoices,
    selectedOption
  );

  if (rivalStatus.isSelected) {
    //Update the Popup and return
    return {
      ...state,
      popup: {
        visible: true,
        message:
          "Selecting " +
          selectedOption.name +
          " will remove " +
          rivalStatus.rivalSelectedChoice[0].choices[0].name,
        selectedOption: selectedOption,
      },
    };
  } else {
    return { ...state };
  }
}

function handlePackageOption(state, selectedOption) {
  let updatedState = { ...state };
  const {
    action: { packageOption = [] } = {},
    checked,
    serial,
  } = selectedOption || {};

  for (let option of packageOption) {
    const componentChoice = getChoices(option);

    const modifiedComponentChoice = {
      ...componentChoice[0].choices[0],
      categoryName: componentChoice[0].categoryName,
      type: componentChoice[0].component.name,
    };
    // Set price to zero
    modifiedComponentChoice.price = 0;

    if (checked) {
      modifiedComponentChoice.packageID = serial;
      updatedState = addSelectedChoices(updatedState, modifiedComponentChoice);
    } else {
      if ("packageID" in modifiedComponentChoice) {
        delete modifiedComponentChoice.packageID;
      }
      updatedState = removeSelectedChoices(
        updatedState,
        modifiedComponentChoice
      );
    }
  }

  return handleRegularOptionChange(updatedState, selectedOption);
}

function handleRemover(state, selectedOption) {
  const { action: { remover } = {} } = selectedOption;

  const updatedAvailableChoices = state.availableChoices
    .map((category) => ({
      ...category,
      choices: category.choices.filter(
        (choice) => !remover.includes(choice.serial)
      ),
    }))
    .filter((category) => category.choices.length > 0);

  const updatedSelectedChoices = state.selectedChoices
    .map((category) => ({
      ...category,
      choices: category.choices.filter(
        (choice) => !remover.includes(choice.serial)
      ),
    }))
    .filter((category) => category.choices.length > 0);
  let updatedState = {
    ...state,
    availableChoices: updatedAvailableChoices,
    selectedChoices: updatedSelectedChoices,
  };

  return handleRegularOptionChange(updatedState, selectedOption);
}

function handleParent(state, selectedOption) {
  let newState = { ...state, parentProcessed: true };
  return newState;
}

function handleSibling(state, selectedOption) {
  let newState = { ...state, siblingProcessed: true };
  return newState;
}

function handleRegularOptionChange(state, selectedOption) {
  const { checked } = selectedOption;
  if (checked) {
    return addSelectedChoices(state, selectedOption);
  } else {
    return removeSelectedChoices(state, selectedOption);
  }
}

//Helper function for handleAncestor()
function getDescendents(categoryName, serial) {
  const newChoicesAvailable = data
    .filter((item) => item.categoryName !== categoryName) // Skip the object with same categoryName
    .map((item) => ({
      ...item,
      choices: item.choices.filter(
        (choice) => choice.descendent && choice.descendent.includes(serial)
      ),
    }))
    .filter((item) => item.choices.length > 0); // Exclude objects where 'choices' array is empty

  return newChoicesAvailable;
}

//Helper function to retrieve choices from data file
function getChoices(serials) {
  const additionalChoices = data
    .map((item) => ({
      ...item,
      choices: item.choices.filter((choice) => serials.includes(choice.serial)),
    }))
    .filter((item) => item.choices.length > 0); // Exclude objects where 'choices' array is empty

  return additionalChoices;
}

function checkIfRivalSelected(selectedChoices, selectedOption) {
  const { action: { rivals } = {} } = selectedOption;
  const rivalSelectedChoice = selectedChoices
    .map((item) => ({
      ...item,
      choices: item.choices.filter((choice) => rivals.includes(choice.serial)),
    }))
    .filter((item) => item.choices.length > 0);

  const isSelected = rivalSelectedChoice.length > 0;
  return {
    isSelected,
    rivalSelectedChoice,
  };
}

function addSelectedChoices(state, selectedOption) {
  const { categoryName, type, serial } = selectedOption;

  let updatedSelectedChoices = [...state.selectedChoices]; // Make a copy of selectedChoices

  if (selectedOption) {
    const stateChoiceIndex = updatedSelectedChoices.findIndex(
      (item) => item.categoryName === categoryName
    );

    if (type === "Dropdown") {
      if (stateChoiceIndex !== -1) {
        // Replace choices for the existing category
        updatedSelectedChoices[stateChoiceIndex].choices = [selectedOption];
      } else {
        // Add a new category to selectedChoices
        updatedSelectedChoices.push({
          categoryName: selectedOption.categoryName,
          component: Dropdown,
          choices: [selectedOption],
        });
      }
    } else if (type === "CheckBoxGroup") {
      if (stateChoiceIndex !== -1) {
        const existingOptionIndex = updatedSelectedChoices[
          stateChoiceIndex
        ].choices.findIndex(
          (option) => option.serial === selectedOption.serial
        );
        if (existingOptionIndex === -1) {
          updatedSelectedChoices[stateChoiceIndex].choices.push(selectedOption);
        }
      } else {
        updatedSelectedChoices.push({
          categoryName: selectedOption.categoryName,
          component: CheckBoxGroup,
          choices: [selectedOption],
        });
      }
    }
  }

  return { ...state, selectedChoices: updatedSelectedChoices };
}

function removeSelectedChoices(state, selectedOption) {
  const { categoryName, serial } = selectedOption;

  const updatedSelectedChoices = state.selectedChoices
    .map((category) => {
      if (category.categoryName !== categoryName) {
        return category;
      }

      const newChoices = category.choices.filter(
        (choice) => choice.serial !== serial
      );

      if (newChoices.length === 0) {
        return null;
      }

      return { ...category, choices: newChoices };
    })
    .filter((category) => category !== null);

  return { ...state, selectedChoices: updatedSelectedChoices };
}

function addAvailableChoices(state, availableOption) {
  const { categoryName, component, choices } = availableOption;

  let updatedAvailableChoices = [...state.availableChoices];
  let categoryIndex = updatedAvailableChoices.findIndex(
    (choice) => choice.categoryName === categoryName
  );

  if (categoryIndex !== -1) {
    if (
      !updatedAvailableChoices[categoryIndex].choices.some(
        (choice) => choice.serial === choices[0].serial
      )
    ) {
      updatedAvailableChoices[categoryIndex] = {
        ...updatedAvailableChoices[categoryIndex],
        choices: [
          ...updatedAvailableChoices[categoryIndex].choices,
          choices[0],
        ],
      };
    }
  } else {
    updatedAvailableChoices.push({
      categoryName: categoryName,
      component: component,
      choices: [choices[0]],
    });
  }

  return updatedAvailableChoices;
}
