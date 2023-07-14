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
  const { action, checked, prevValue } = selectedOption || {};
  const actionHandlers = {
    [actionTypes.SPONSOR]: handleSponsor,
    [actionTypes.REMOVER]: handleRemover,
    [actionTypes.RIVALS]: handleRival,
    [actionTypes.PACKAGE_OPTION]: handlePackageOption,
    [actionTypes.PARENT]: handleParent,
    [actionTypes.SIBLING]: handleSibling,
  };

  //Checks if an unselected option is part of a selected package
  if (!checked || prevValue) {
    if (hasPackageID(selectedOption) || hasPackageID(prevValue)) {
      //Unselecting an option with packageID can generate a popup
      return handlePackageID(state, selectedOption);
    }
  }

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
  const { action = null, checked, prevValue = null } = selectedOption;
  //Assigns empty object if action is null
  const actionNotNull = action || {};
  const {
    rivals = null,
    parent = null,
    sibling = null,
    packageOption = null,
  } = actionNotNull;

  if (!checked || prevValue) {
    //Handle option unselected is part of package
    updatedState = handleComponentUnselected(updatedState, selectedOption);
    updatedState = removeSelectedChoices(updatedState, selectedOption);
  }
  if (checked) {
    //Handles removing all rivals
    if (rivals) {
      updatedState = handleUnselectingRivals(state, rivals);
    }
    if (packageOption) {
      updatedState = handlePackageOption(updatedState, selectedOption);
    }
    updatedState = addSelectedChoices(updatedState, selectedOption);
  }

  return { ...updatedState, popup: false, message: "", selectedOption: null };
}

//Helper function
function handleComponentUnselected(state, selectedOption) {
  let updatedState = { ...state };
  const { prevValue = null } = selectedOption;
  let parentPackage = {};
  if (hasPackageID(selectedOption) || hasPackageID(prevValue)) {
    const selectedChoices = updatedState.selectedChoices;
    parentPackage = selectedChoices
      .flatMap((current) => current.choices)
      .find(
        (choice) =>
          choice.serial === prevValue?.packageID ||
          choice.serial === selectedOption?.packageID
      );
    if (parentPackage) {
      parentPackage = { ...parentPackage, checked: false };
      updatedState = handlePackageOption(updatedState, parentPackage);
    }
  }
  return updatedState;
}
//Helper function
function handleUnselectingRivals(state, rivals) {
  let updatedState = { ...state };
  if (rivals) {
    for (let rival of rivals) {
      const rivalChoice = getChoices(rival);
      let modifiedRivalChoice = {
        ...rivalChoice[0].choices[0],
        categoryName: rivalChoice[0].categoryName,
      };
      updatedState = removeSelectedChoices(updatedState, modifiedRivalChoice);
      const { packageOption: rivalPackageOption = [] } =
        modifiedRivalChoice.action || {};
      if (rivalPackageOption.length > 0) {
        modifiedRivalChoice = { ...modifiedRivalChoice, checked: false };
        updatedState = handlePackageOption(updatedState, modifiedRivalChoice);
      }
    }
  }
  return updatedState;
}

export function handlePopupCancel(state, selectedOption) {
  let updatedState = { ...state };
  const { action = null, prevValue = null } = selectedOption;
  //Assigns empty object if action is null
  const actionNotNull = action || {};
  const {
    rivals = null,
    parent = null,
    sibling = null,
    packageOption = null,
  } = actionNotNull;
  //Loop to handle an active package component unselected
  const packageID =
    selectedOption.packageID || (prevValue && prevValue.packageID);
  if (packageID)
    return { ...updatedState, popup: false, message: "", selectedOption: null };

  //Handle rival selection
  if (rivals != null && checked) {
    return (updatedState = removeSelectedChoices(updatedState, selectedOption));
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

  for (let component of packageOption) {
    const componentChoice = getChoices(component);

    const modifiedComponentChoice = {
      ...componentChoice[0].choices[0],
      categoryName: componentChoice[0].categoryName,
      type: componentChoice[0].component.name,
    };
    //Set price to zero
    modifiedComponentChoice.price = 0;
    //Mark as checked
    modifiedComponentChoice.checked = true;

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

// helper function to check packageID
function hasPackageID(option) {
  return (
    option &&
    "packageID" in option &&
    option.packageID &&
    option.packageID.trim() !== ""
  );
}

function handleRegularOptionChange(state, selectedOption) {
  const { checked, prevValue } = selectedOption;

  if (checked) {
    return addSelectedChoices(state, selectedOption);
  } else {
    return removeSelectedChoices(state, selectedOption);
  }
}

//This function is called when an option unselected has a packageID
function handlePackageID(state, selectedOption) {
  const { name, checked, type, prevValue } = selectedOption;

  let unselectOptionName = "";
  let packageID = "";
  let parentPackage = {};
  const selectedChoices = state.selectedChoices;

  //Unify the assignment of variables
  if (type === "CheckBoxGroup" || type === "Dropdown") {
    unselectOptionName = type === "CheckBoxGroup" ? name : prevValue.name;
    packageID =
      type === "CheckBoxGroup" ? selectedOption.packageID : prevValue.packageID;

    parentPackage = selectedChoices.reduce((acc, current) => {
      if (acc) return acc;
      return current.choices.find((choice) => choice.serial === packageID);
    }, null);
  }

  if (parentPackage) {
    return {
      ...state,
      popup: {
        visible: true,
        message:
          "Unselecting " +
          unselectOptionName +
          " will remove the package- " +
          parentPackage.name,
        selectedOption: selectedOption,
      },
    };
  } else {
    //Parent package not selected
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
    const existingCategoryIndex = updatedSelectedChoices.findIndex(
      (item) => item.categoryName === categoryName
    );

    if (type === "Dropdown") {
      if (existingCategoryIndex !== -1) {
        // Replace choices for the existing category
        updatedSelectedChoices[existingCategoryIndex].choices = [
          selectedOption,
        ];
      } else {
        // Add a new category to selectedChoices
        updatedSelectedChoices.push({
          categoryName: selectedOption.categoryName,
          component: Dropdown,
          choices: [selectedOption],
        });
      }
    } else if (type === "CheckBoxGroup") {
      if (existingCategoryIndex !== -1) {
        const existingOptionIndex = updatedSelectedChoices[
          existingCategoryIndex
        ].choices.findIndex(
          (option) => option.serial === selectedOption.serial
        );
        if (existingOptionIndex === -1) {
          // Add the selectedOption if it doesn't already exist in choices
          updatedSelectedChoices[existingCategoryIndex].choices.push(
            selectedOption
          );
        } else {
          // Replace the existing choice with the new selectedOption
          updatedSelectedChoices[existingCategoryIndex].choices[
            existingOptionIndex
          ] = selectedOption;
        }
      } else {
        //Add the entire category and choices if the existingCategoryIndex is not present
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
