import data from "./civic";

export function initialChoices() {
  const trimsAvailable = data.find((option) => option.categoryName === "Trim");
  //   console.log(currentState);

  return trimsAvailable;
}
