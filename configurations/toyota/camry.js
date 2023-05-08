import Dropdown from "../../components/Dropdown";
import CheckBoxGroup from "../../components/CheckBoxGroup";

const CamryConfigurations = [
  {
    categoryName: "Trims",
    component: Dropdown,
    choices: ["LX", "Sport", "EX"],
  },
  {
    categoryName: "Powertrain",
    component: Dropdown,
    choices: ["Camry Transmissions", "1.5L Turbo 4-Cyl 180hp Engine w/CVT"],
  },
  {
    categoryName: "Exterior Color",
    component: CheckBoxGroup,
    choices: ["Camry Blue", "Green", "Yellow"],
  },
];

export default CamryConfigurations;
