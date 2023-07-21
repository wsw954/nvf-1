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

// export function handlePopupConfirm(state, selectedOption) {
//   let updatedState = { ...state };
//   const { action = null, checked, prevValue = null } = selectedOption;

//   //Assigns empty object if action is null
//   const actionNotNull = action || {};
//   const {
//     rivals = null,
//     parent = null,
//     child = null,
//     packageOption = null,
//   } = actionNotNull;

//   if (!checked || prevValue) {
//     //Handle an option being unselected which is part of package
//     updatedState = handleComponentUnselected(updatedState, selectedOption);
//     updatedState = removeSelectedChoices(updatedState, selectedOption);
//   }
//   if (checked) {
//     //Handles removing all rivals
//     if (rivals) {
//       updatedState = handleUnselectingRivals(state, rivals);
//     }
//     if (packageOption) {
//       updatedState = handlePackageOption(updatedState, selectedOption);
//     }
//     if (child) {
//       const parentOption = getOption(child);
//       const modifiedParentOption = {
//         ...parentOption[0].choices[0],
//         categoryName: parentOption[0].categoryName,
//         type: parentOption[0].component.name,
//       };

//       updatedState = addSelectedChoices(updatedState, modifiedParentOption);
//     }

//     updatedState = addSelectedChoices(updatedState, selectedOption);
//   }
//   //Handles an unselected parent option
//   if (parent && !checked) {
//     //Removes all the selected child options for unselected parent
//     selectedOption.optionsSelected.map((option) => {
//       option.choices.forEach((choice) => {
//         updatedState = removeSelectedChoices(updatedState, choice);
//       });
//     });
//     //Removes the parent option
//     updatedState = removeSelectedChoices(updatedState, selectedOption);
//   }

//   return { ...updatedState, popup: false, message: "", selectedOption: null };
// }

export function handlePopupConfirm(state, selectedOption) {
  let updatedState = { ...state };

  const {
    addOptionsSelected = null,
    removeOptionsSelected = null,
    addOptionsAvailable = null,
    removeOptionsAvailable = null,
  } = selectedOption;
  // console.log(selectedOption);

  if (addOptionsSelected) {
    // console.log(addOptionsSelected.choices);
  }
  if (removeOptionsSelected) {
    // console.log(removeOptionsSelected.choices);
  }
  if (addOptionsAvailable) {
    // console.log(addOptionsAvailable.choices);
  }
  if (removeOptionsAvailable) {
    // console.log(removeOptionsAvailable.choices);
  }
  updatedState = handleRegularOptionChange(updatedState, selectedOption);
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
      const rivalChoice = getOption(rival);

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
      const modifiedSelectedOption = {
        ...selectedOption,
        removeOptionSelected: rivalStatus.optionsSelected,
      };
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
          selectedOption: modifiedSelectedOption,
        },
      };
    }
  }

  // Call handleRegularOptionChange for other cases
  return handleRegularOptionChange(state, selectedOption);
}

// function handlePackageOption(state, selectedOption) {
//   let updatedState = { ...state };
//   const {
//     action: { packageOption = [] } = {},
//     checked,
//     serial,
//   } = selectedOption || {};

//   for (let component of packageOption) {
//     const componentChoices = getOption(component);

//     const modifiedComponentChoice = {
//       ...componentChoices[0].choices[0],
//       categoryName: componentChoices[0].categoryName,
//       type: componentChoices[0].component.name,
//     };
//     //Set price to zero
//     modifiedComponentChoice.price = 0;
//     //Mark as checked
//     modifiedComponentChoice.checked = true;

//     if (checked) {
//       modifiedComponentChoice.packageID = serial;
//       updatedState = addSelectedChoices(updatedState, modifiedComponentChoice);
//     } else {
//       if ("packageID" in modifiedComponentChoice) {
//         delete modifiedComponentChoice.packageID;
//       }
//       updatedState = removeSelectedChoices(
//         updatedState,
//         modifiedComponentChoice
//       );
//     }
//   }

//   return handleRegularOptionChange(updatedState, selectedOption);
// }

function handlePackageOption(state, selectedOption) {
  let updatedState = { ...state };
  const {
    action: { packageOption = [] } = {},
    checked,
    serial,
  } = selectedOption || {};
  // console.log(packageOption);
  for (let component of packageOption) {
    //Get choice object from data file
    const componentChoices = getOption(component);
  }
  //     const componentChoices = getOption(component);

  //     const modifiedComponentChoice = {
  //       ...componentChoices[0].choices[0],
  //       categoryName: componentChoices[0].categoryName,
  //       type: componentChoices[0].component.name,
  //     };
  //     //Set price to zero
  //     modifiedComponentChoice.price = 0;
  //     //Mark as checked
  //     modifiedComponentChoice.checked = true;

  //     if (checked) {
  //       modifiedComponentChoice.packageID = serial;
  //       updatedState = addSelectedChoices(updatedState, modifiedComponentChoice);
  //     } else {
  //       if ("packageID" in modifiedComponentChoice) {
  //         delete modifiedComponentChoice.packageID;
  //       }
  //       updatedState = removeSelectedChoices(
  //         updatedState,
  //         modifiedComponentChoice
  //       );
  //     }
  //   }

  return handleRegularOptionChange(updatedState, selectedOption);
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
          selectedOption: modifiedSelectedOption,
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
    const parentStatus = checkIfOptionsSelected(updatedState, child);
    if (parentStatus.isSelected) {
      updatedState = addSelectedChoices(updatedState, selectedOption);
    } else {
      //Update the Popup
      const parentOption = getOption(child);
      updatedState = {
        ...updatedState,
        popup: {
          visible: true,
          message:
            "To Select " +
            selectedOption.name +
            " you must also select " +
            parentOption[0].choices[0].name,
          selectedOption: selectedOption,
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
