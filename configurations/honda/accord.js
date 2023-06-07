import data from "../../data/honda/accord";

export function initialChoices() {
  const trimsAvailable = data.find((option) => option.categoryName === "Trim");
  //   console.log(currentState);

  return trimsAvailable;
}

export function handleChange(state, selectedOption) {
  console.log(selectedOption);
  return state;
}
