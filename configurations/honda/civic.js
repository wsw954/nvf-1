import Dropdown from "../../components/Dropdown";
import CheckBoxGroup from "../../components/CheckBoxGroup";

const CivicConfigurations = [
  {
    categoryName: "Trims",
    component: Dropdown,
    choices: [
      { name: "Sedan LX", price: 25000 },
      { name: "Sedan EX", price: 26000 },
      { name: "Sedan Touring", price: 27000 },
    ],
  },
  {
    categoryName: "Powertrain",
    component: Dropdown,
    choices: [
      { name: "2.0L 4-Cyl 158hp Engine w/CVT", price: 0 },
      { name: "1.5L Turbo 4-Cyl 180hp Engine w/CVT", price: 500 },
    ],
  },
  {
    categoryName: "Exterior Color",
    component: Dropdown,
    choices: [
      { name: "Aegean Blue Metallic", price: 0 },
      { name: "Crystal Black Pearl", price: 0 },
      { name: "Lunar Silver Metallic", price: 0 },
      { name: "Meteorite Gray Metallic", price: 0 },
      { name: "Rallye Red", price: 0 },
      { name: "Platinum White Pearl", price: 455 },
    ],
  },
  {
    categoryName: "Wheels",
    component: Dropdown,
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
      { name: "Body Side Molding", price: 242 },
      { name: "Decklid Spoiler – HPD™", price: 322 },
      { name: "Door Edge Film", price: 54 },
      { name: "Door Edge Guard", price: 124 },
      { name: "Door Handle Film", price: 54 },
      { name: "Door Visors – Chrome", price: 231 },
      {
        name: "Emblems, Front and Rear H-Mark and Civic – Gloss Black",
        price: 113,
      },
      { name: "Rear Bumper Appliqué", price: 76 },
      { name: "Splash Guard Set", price: 113 },
      { name: "Underbody Spoiler – HPD™ Front", price: 357 },
      { name: "Underbody Spoiler – HPD™ Rear", price: 322 },
      { name: "Underbody Spoiler – HPD™ Side", price: 408 },
      { name: "Wheel Locks", price: 63 }, // Assuming the minimum price
      { name: "Wheel Lug Nuts - Black", price: 51 },
    ],
  },
];

export default CivicConfigurations;
