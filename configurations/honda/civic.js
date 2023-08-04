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
  RIVALS: "rivals",
  PACKAGE_OPTION: "packageOption",
  PARENT: "parent",
  CHILD: "child",
};

//Main option change function
export function handleOptionChange(state, selectedOption) {
  let updatedState = { ...state };

  const { action, checked, prevValue } = selectedOption || {};
  const actionHandlers = {
    [actionTypes.SPONSOR]: handleSponsor,
    [actionTypes.REMOVER]: handleRemover,
    [actionTypes.RIVALS]: handleRival,
    [actionTypes.PACKAGE_OPTION]: handlePackageOption,
    [actionTypes.PARENT]: handleParent,
    [actionTypes.CHILD]: handleChild,
  };

  //Checks if an unselected option is a component of a selected package
  if (!checked || prevValue) {
    if (isPackageComponent(selectedOption) || isPackageComponent(prevValue)) {
      //Unselecting an option with packageComponent can generate a popup
      return handlePackageComponent(state, selectedOption);
    }
  }

  if (!action || action === null) {
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

//Popup confirm
export function handlePopupConfirm(state, confirmAction) {
  let updatedState = { ...state };
  const {
    addToSelectedChoices = [],
    removeFromSelectedChoices = [],
    addToAvailableChoices = [],
    removeFromAvailableChoices = [],
  } = confirmAction ? confirmAction : {};
  switch (confirmAction.caller) {
    case "rivalSelected":
      updatedState = rivalSelectConfirm(updatedState, confirmAction);

      break;
    case "componentUnselected":
      updatedState = packageComponentUnselectConfirm(
        updatedState,
        confirmAction
      );
      break;
    case "parentUnselected":
      console.log("parentUnselected");
    case "childSelected":
      updatedState = childSelectedConfirm(updatedState, confirmAction);
      break;
  }
  // Reset popup property before returning updated state
  updatedState.popup = {
    visible: false,
    message: "",
    selectedOption: null,
  };
  return updatedState;
}

//Helper function
function rivalSelectConfirm(state, confirmAction) {
  let updatedState = { ...state };
  const { addToSelectedChoices = [], removeFromSelectedChoices = [] } =
    confirmAction;
  //Remove the unselected rival first
  if (removeFromSelectedChoices.length > 0) {
    removeFromSelectedChoices.forEach((rivalUnselected) => {
      //Mark rivalUnselected unselected, & remove rival property
      let modifiedRivalUnselected = { ...rivalUnselected, checked: false };
      let { action: { packageOption, component } = {} } =
        modifiedRivalUnselected;
      if (packageOption && packageOption.length > 0) {
        updatedState = handlePackageOption(
          updatedState,
          modifiedRivalUnselected
        );
      } else if (component && component.length > 0) {
        // updatedState = handleRegularOptionChange(
        //   updatedState,
        //   modifiedRivalUnselected
        // );
      } else {
        updatedState = handleRegularOptionChange(
          updatedState,
          modifiedRivalUnselected
        );
      }
    });
  }
  //Then add the selected rival next
  if (addToSelectedChoices.length > 0) {
    addToSelectedChoices.forEach((rivalSelected) => {
      //Mark rivalSelected selected,
      let modifiedRivalSelected = { ...rivalSelected, checked: true };
      let { action: { packageOption, component } = {} } = modifiedRivalSelected;
      if (packageOption && packageOption.length > 0) {
        updatedState = handlePackageOption(updatedState, modifiedRivalSelected);
      } else {
        updatedState = handleRegularOptionChange(
          updatedState,
          modifiedRivalSelected
        );
      }
    });
  }

  return updatedState;
}

function packageComponentUnselectConfirm(state, confirmAction) {
  let updatedState = { ...state };
  const { addToSelectedChoices = [], removeFromSelectedChoices = [] } =
    confirmAction;
  //First remove the
  if (removeFromSelectedChoices.length > 0) {
    removeFromSelectedChoices.forEach((option) => {
      let modifiedOption = {
        ...option,
        checked: false,
      };
      updatedState = handlePackageOption(updatedState, modifiedOption);
    });
  }
  if (addToSelectedChoices.length > 0) {
    addToSelectedChoices.forEach((choice) => {
      let modifiedChoice = {
        ...choice,
        prevValue: null, //Clear out prevValue, since it is no longer relevant at this time, allowing handleOptioChange to make the appropriate call
      };
      updatedState = handleOptionChange(updatedState, modifiedChoice);
    });
  }

  return updatedState;
}

function childSelectedConfirm(state, confirmAction) {
  let updatedState = { ...state };
  console.log(confirmAction);
  const { addToSelectedChoices = [] } = confirmAction;

  if (addToSelectedChoices.length > 0) {
    addToSelectedChoices.forEach((choice) => {
      updatedState = handleOptionChange(updatedState, choice);
    });
  }

  return updatedState;
}

export function handlePopupCancel(state, confirmAction) {
  let updatedState = { ...state };

  return updatedState;
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
  let updatedState = { ...state };
  sponsor.forEach((recipient) => {
    //Get the option from the data file
    let sponsoredOption = getOption(recipient);
    updatedState = addAvailableChoices(updatedState, sponsoredOption);
  });
  updatedState = handleRegularOptionChange(updatedState, selectedOption);

  return updatedState;
}

function handleRival(state, selectedOption) {
  const { action: { rivals = [] } = {}, checked } = selectedOption;
  if (checked) {
    const rivalStatus = checkIfOptionsSelected(state, rivals);
    if (rivalStatus.isSelected) {
      // Create new array of objects rivalOptions here
      const rivalOptions = rivalStatus.optionsSelected.flatMap(
        (option) => option.choices
      );

      // Gather all 'choices.name' for each object in 'optionsSelected'
      const allRivalsNames = rivalStatus.optionsSelected.flatMap((option) =>
        option.choices.map((choice) => choice.name)
      );
      //Update the Popup and return
      return {
        ...state,
        popup: {
          visible: true,
          message:
            "Selecting " +
            selectedOption.name +
            " will remove " +
            allRivalsNames.join(", "),
          confirmAction: {
            caller: "rivalSelected",
            addToSelectedChoices: [selectedOption],
            removeFromSelectedChoices: rivalOptions,
          },
        },
      };
    }
  }

  // Call handleRegularOptionChange for other cases
  return handleRegularOptionChange(state, selectedOption);
}

function handlePackageOption(state, selectedOption) {
  let updatedState = { ...state };
  const {
    action: { packageOption = [] } = {},
    checked,
    serial,
  } = selectedOption || {};

  for (let component of packageOption) {
    const componentChoice = getOption(component);
    const modifiedComponentChoice = {
      ...componentChoice.choices[0],
      categoryName: componentChoice.categoryName,
      type: componentChoice.component.name,
    };

    if (checked) {
      //Change attributes of component to mark as a selected component
      modifiedComponentChoice.price = 0;
      modifiedComponentChoice.checked = true;
      modifiedComponentChoice.packageComponent = serial;
      updatedState = addSelectedChoices(updatedState, modifiedComponentChoice);
    } else {
      if ("packageComponent" in modifiedComponentChoice) {
        delete modifiedComponentChoice.packageComponent;
      }
      updatedState = removeSelectedChoices(
        updatedState,
        modifiedComponentChoice
      );
    }
  }
  updatedState = handleRegularOptionChange(updatedState, selectedOption);

  return updatedState;
}

function handleRemover(state, selectedOption) {
  const { action: { remover } = {} } = selectedOption;
  let updatedState = { ...state };
  const removalOption = checkIfOptionsAvailable(updatedState, remover);
  if (removalOption.isAvailable) {
    removalOption.optionsAvailable.forEach((option) => {
      option.choices.forEach((choice) => {
        updatedState = removeAvailableChoices(updatedState, choice);
      });
    });
  }
  updatedState = handleRegularOptionChange(updatedState, selectedOption);

  return updatedState;
}

function handleParent(state, selectedOption) {
  let updatedState = { ...state };
  const { action: { parent = [] } = {}, checked } = selectedOption || {};

  if (checked) {
    updatedState = addSelectedChoices(state, selectedOption);
  } else {
    const childStatus = checkIfOptionsSelected(updatedState, parent);
    if (childStatus.isSelected) {
      // Create a new selectedOption object including optionsSelected
      const modifiedSelectedOption = {
        ...selectedOption,
        removeOptionsSelected: childStatus.optionsSelected,
      };
      // Gather all 'choices.name' for each object in 'optionsSelected'
      const allChoicesNames = childStatus.optionsSelected.flatMap((option) =>
        option.choices.map((choice) => choice.name)
      );
      return {
        ...updatedState,
        popup: {
          visible: true,
          message:
            "Unselecting " +
            selectedOption.name +
            " will also unselect:  " +
            allChoicesNames.join(", "),
          confirmAction: {
            caller: "parentUnselected",
            addToSelectedChoices: [],
            removeFromSelectedChoices: [selectedOption],
          },
        },
      };
    }
    updatedState = removeSelectedChoices(updatedState, selectedOption);
  }
  return updatedState;
}

function handleChild(state, selectedOption) {
  let updatedState = { ...state };
  const { action: { child = [] } = {}, checked } = selectedOption || {};
  if (checked) {
    const parentStatus = checkIfAllOptionsSelected(updatedState, child);
    if (parentStatus.allSelected) {
      updatedState = addSelectedChoices(updatedState, selectedOption);
    } else {
      const parentsUnchecked = parentStatus.optionsAvailable.flatMap(
        (item) => item.choices
      );
      const allParentNames = parentStatus.optionsAvailable.flatMap((option) =>
        option.choices.map((choice) => choice.name)
      );
      //Update the Popup
      updatedState = {
        ...updatedState,
        popup: {
          visible: true,
          message:
            "To Select " +
            selectedOption.name +
            " you must also select " +
            allParentNames.join(", "),
          confirmAction: {
            caller: "childSelected",
            addToSelectedChoices: [...parentsUnchecked, selectedOption],
            removeFromSelectedChoices: [],
          },
        },
      };
    }
  } else {
    updatedState = removeSelectedChoices(updatedState, selectedOption);
  }
  return updatedState;
}

//Helper function
function createParentMessage() {}

// helper function to check packageComponent
function isPackageComponent(option) {
  return (
    option &&
    "packageComponent" in option &&
    option.packageComponent &&
    option.packageComponent.trim() !== ""
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

//This function is called when an option unselected is a packageComponent
function handlePackageComponent(state, selectedOption) {
  const { name, checked, type, prevValue } = selectedOption;

  let unselectOptionName = "";
  let packageComponent = "";
  let parentPackage = {};
  const selectedChoices = state.selectedChoices;

  //Unify the assignment of variables
  if (type === "CheckBoxGroup" || type === "Dropdown") {
    unselectOptionName = type === "CheckBoxGroup" ? name : prevValue.name;
    packageComponent =
      type === "CheckBoxGroup"
        ? selectedOption.packageComponent
        : prevValue.packageComponent;
    //Check if the parent package is currently selected
    parentPackage = selectedChoices.reduce((acc, current) => {
      if (acc) return acc;
      return current.choices.find(
        (choice) => choice.serial === packageComponent
      );
    }, null);
  }

  if (parentPackage) {
    let addToSelectedChoicesArr = [];
    if (type === "Dropdown") {
      addToSelectedChoicesArr.push(selectedOption);
    }
    return {
      ...state,
      popup: {
        visible: true,
        message:
          "Unselecting " +
          unselectOptionName +
          " will remove the package- " +
          parentPackage.name,
        confirmAction: {
          caller: "componentUnselected",
          addToSelectedChoices: addToSelectedChoicesArr,
          removeFromSelectedChoices: [parentPackage],
        },
      },
    };
  } else {
    //Parent package not selected
    return removeSelectedChoices(state, selectedOption);
  }
}

//Helper function for handleAncestor()
function getDescendents(categoryName, serial) {
  //Retrieve available options from the main data file
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
function getOption(serial) {
  const additionalChoices = data
    .map((item) => ({
      ...item,
      choices: item.choices.filter((choice) => serial === choice.serial),
    }))
    .filter((item) => item.choices.length > 0); // Exclude objects where 'choices' array is empty

  return additionalChoices[0] ? additionalChoices[0] : null;
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

function checkIfOptionsAvailable(state, array) {
  const optionsAvailable = state.availableChoices
    .map((item) => ({
      ...item,
      choices: item.choices.filter((choice) => array.includes(choice.serial)),
    }))
    .filter((item) => item.choices.length > 0);
  const isAvailable = optionsAvailable.length > 0;
  return {
    isAvailable,
    optionsAvailable,
  };
}

//Helper function
function checkIfOptionsSelected(state, array) {
  const optionsSelected = state.selectedChoices
    .map((item) => ({
      ...item,
      choices: item.choices.filter((choice) => array.includes(choice.serial)),
    }))
    .filter((item) => item.choices.length > 0);
  const isSelected = optionsSelected.length > 0;
  return {
    isSelected,
    optionsSelected,
  };
}

function checkIfAllOptionsSelected(state, array) {
  const optionsSelected = state.selectedChoices
    .map((item) => ({
      ...item,
      choices: item.choices.filter((choice) => array.includes(choice.serial)),
    }))
    .filter((item) => item.choices.length > 0);

  let allSerials = [];
  optionsSelected.forEach((item) => {
    const serials = item.choices.map((choice) => choice.serial);
    allSerials = [...allSerials, ...serials];
  });

  const uniqueSerials = [...new Set(allSerials)];
  const allSelected = uniqueSerials.length === array.length;

  let notFoundSerials = array.filter((item) => !uniqueSerials.includes(item));
  const optionsAvailable = state.availableChoices
    .map((item) => ({
      ...item,
      choices: item.choices
        .filter((choice) => notFoundSerials.includes(choice.serial))
        .map((choice) => ({
          ...choice,
          categoryName: item.categoryName,
          checked: false,
          type: item.component.name,
        })),
    }))
    .filter((item) => item.choices.length > 0);

  return {
    allSelected,
    optionsSelected,
    optionsAvailable,
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
  let updatedState = { ...state };

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

  return { ...updatedState, availableChoices: updatedAvailableChoices };
}

function removeAvailableChoices(state, availableOption) {
  const { categoryName, component, choices, serial } = availableOption;
  let updatedState = { ...state };
  const updatedAvailableChoices = updatedState.availableChoices
    .map((category) => ({
      ...category,
      choices: category.choices.filter(
        (choice) => !serial.includes(choice.serial)
      ),
    }))
    .filter((category) => category.choices.length > 0);

  const updatedSelectedChoices = updatedState.selectedChoices
    .map((category) => ({
      ...category,
      choices: category.choices.filter(
        (choice) => !serial.includes(choice.serial)
      ),
    }))
    .filter((category) => category.choices.length > 0);

  updatedState = {
    ...state,
    availableChoices: updatedAvailableChoices,
    selectedChoices: updatedSelectedChoices,
  };
  return updatedState;
}
