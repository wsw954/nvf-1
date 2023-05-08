import Dropdown from "../../components/Dropdown";
import CheckBoxGroup from "../../components/CheckBoxGroup";

const CivicConfigurations = [
  {
    categoryName: "Trims",
    component: Dropdown,
    choices: ["Sedan LX", "Sedan Sport", "Sedan EX"],
  },
  {
    categoryName: "Powertrain",
    component: Dropdown,
    choices: [
      "2.0L 4-Cyl 158hp Engine w/CVT",
      "1.5L Turbo 4-Cyl 180hp Engine w/CVT",
    ],
  },
  {
    categoryName: "Exterior Color",
    component: CheckBoxGroup,
    choices: ["Red", "White", "Blue"],
  },
  {
    categoryName: "Wheels",
    component: CheckBoxGroup,
    choices: ["18-Inch Gloss-Black Alloy Wheels", "17-Inch Alloy Wheels"],
  },
];

export default CivicConfigurations;
