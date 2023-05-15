import Dropdown from "../../components/Dropdown";
import CheckBoxGroup from "../../components/CheckBoxGroup";

const AccordConfigurations = [
  {
    categoryName: "Trims",
    component: Dropdown,
    choices: [
      { name: "LX", price: 25000 },
      { name: "EX", price: 26000 },
      { name: "Touring", price: 27000 },
    ],
  },
  {
    categoryName: "Powertrain",
    component: Dropdown,
    choices: [
      { name: "Accord w/CVT", price: 0 },
      { name: "Accord 180hp Engine w/CVT", price: 500 },
    ],
  },
  {
    categoryName: "Exterior Color",
    component: Dropdown,
    choices: [
      { name: "Red", price: 0 },
      { name: "Blue", price: 0 },
      { name: "Black", price: 500 },
    ],
  },
  {
    categoryName: "Wheels",
    component: CheckBoxGroup,
    choices: [
      { name: "Red Rims", price: 0 },
      { name: "Green Rims", price: 0 },
      { name: "Black Rims", price: 500 },
    ],
  },
  {
    categoryName: "Exterior Accessories",
    component: CheckBoxGroup,
    choices: [
      { name: "All Season Mats", price: 100 },
      { name: "Spoiler", price: 200 },
      { name: "Rear Wing", price: 500 },
    ],
  },
];
export default AccordConfigurations;
