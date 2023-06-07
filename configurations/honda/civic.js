import data from "../../data/honda/civic";

export function initialChoices() {
  const trimsAvailable = data.find((option) => option.categoryName === "Trim");
  //   console.log(currentState);

  return trimsAvailable;
}

export function handleChange(currentState, selectedOption) {
  console.log("currentState");
  // console.log(categoryName);
  console.log(selectedOption);
  const updatedState = currentState;
  return updatedState;
}
