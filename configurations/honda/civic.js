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
      remover = null,
      optionPackage = null,
      parent = null,
      rival = null,
      sibling = null,
    } = action;
    if (ancestor != null) {
      updatedState = handleAncestor(updatedState, selectedOption);
    }
    if (sponsor != null) {
      updatedState = handleSponsor(updatedState, selectedOption);
    }
    if (remover != null) {
      updatedState = handleRemover({ ...currentState }, selectedOption);
    }

    if (optionPackage != null) {
      updatedState = handleOptionPackage(updatedState, selectedOption);
    }
    if (parent != null) {
      updatedState = handleParent(updatedState, selectedOption);
    }
    if (rival != null) {
      updatedState = handleRival(updatedState, selectedOption);
    }
    if (sibling != null) {
      updatedState = handleSibling(updatedState, selectedOption);
    }
  }
  return handleRegularOptionChange(updatedState, selectedOption);
}

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
  let recipientChoices = getRecipients(categoryName, serial);

  let updatedAvailableChoices = recipientChoices.reduce(
    (choices, choice) => addAvailableChoices(state, choice),
    [...state.availableChoices]
  );
  return { ...state, availableChoices: updatedAvailableChoices };
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

  return {
    ...state,
    availableChoices: updatedAvailableChoices,
    selectedChoices: updatedSelectedChoices,
  };
}

function handleOptionPackage(state, selectedOption) {
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
    return addSelectedChoices(state, selectedOption);
  } else {
    return removeSelectedChoices(state, selectedOption);
  }
}

//Helper function for handleAncestor()
function getDescendents(categoryName, serial) {
  let filteredData = data;
  const newChoicesAvailable = filteredData
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

//Helper function for handleSponsor()
function getRecipients(categoryName, serial) {
  const additionalChoicesAvailable = data
    .filter((item) => item.categoryName !== categoryName) // Skip the object with same categoryName
    .map((item) => ({
      ...item,
      choices: item.choices.filter(
        (choice) => choice.recipient && choice.recipient.includes(serial)
      ),
    }))
    .filter((item) => item.choices.length > 0); // Exclude objects where 'choices' array is empty

  return additionalChoicesAvailable;
}

// function getRemovals(categoryName, serial) {
//   let filteredData = data;
//   const removalChoices = filteredData
//     .filter((item) => item.categoryName !== categoryName) // Skip the object with same categoryName
//     .map((item) => ({
//       ...item,
//       choices: item.choices.filter(
//         (choice) => choice.recipient && choice.recipient.includes(serial)
//       ),
//     }))
//     .filter((item) => item.choices.length > 0); // Exclude objects where 'choices' array is empty

//   return removalChoices;
// }

function addSelectedChoices(state, selectedOption) {
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
