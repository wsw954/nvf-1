import Dropdown from "../../components/Dropdown";
import CheckBoxGroup from "../../components/CheckBoxGroup";

const CivicData = [
  {
    categoryName: "Trim",
    component: Dropdown,
    choices: [
      { name: "Trim 1", price: 23750, serial: "tt1", action: { ancestor: [] } },
      { name: "Trim 2", price: 25050, serial: "tt2", action: { ancestor: [] } },
      { name: "Trim 3", price: 26450, serial: "tt3", action: { ancestor: [] } },
      {
        name: "Trim 4 High End",
        price: 30050,
        serial: "tt4",
        action: { ancestor: [] },
      },
    ],
  },
  {
    categoryName: "Powertrain",
    component: Dropdown,
    choices: [
      {
        name: "Powertrain 1",
        price: 0,
        serial: "pw1",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: null,
      },
      {
        name: "Powertrain 2",
        price: 500,
        serial: "pw2",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: null,
      },
      {
        name: "Powertrain 3- High End",
        price: 500,
        serial: "pw3",
        descendent: ["tt4"],
        action: null,
      },
    ],
  },
  {
    categoryName: "Exterior Color",
    component: Dropdown,
    choices: [
      {
        name: "Exterior Color 1",
        price: 0,
        serial: "ec1",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: { remover: ["ic2"] },
      },
      {
        name: "External Color 2",
        price: 0,
        serial: "ec2",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: { remover: ["ic2"] },
      },
      {
        name: "External Color 3",
        price: 0,
        serial: "ec3",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: { remover: ["ic2"] },
      },
      {
        name: "External Color 4-High End",
        price: 0,
        serial: "ec4",
        descendent: ["tt4"],
        action: { sponsor: ["ic2", "ea1"] },
      },
      {
        name: "External Color 5 -High End",
        price: 0,
        serial: "ec5",
        descendent: ["tt4"],
        action: { sponsor: ["ic2"] },
      },
    ],
  },
  {
    categoryName: "Interior Color",
    component: Dropdown,
    choices: [
      {
        name: "Black Cloth 1",
        price: 0,
        serial: "ic1",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: null,
      },
      {
        name: "Gray Cloth-High End",
        price: 0,
        serial: "ic2",
        recipient: ["ec4", "ec5"],
        action: null,
      },
    ],
  },

  {
    categoryName: "Packages",
    component: CheckBoxGroup,
    choices: [
      {
        name: "Package I",
        price: 420,
        serial: "pk1",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: { optionPackage: [], rival: [] },
      },
      {
        name: "Package 2",
        price: 370,
        serial: "pk2",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: { optionPackage: [], rival: [] },
      },
      {
        name: "Package 3",
        price: 1452,
        serial: "pk3",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: { optionPackage: [] },
      },
      {
        name: "Package 4",
        price: 300,
        serial: "pk4",
        descendent: ["tt4"],
        action: { optionPackage: [] },
      },
      {
        name: "Package 5-High End",
        price: 415,
        serial: "pk5",
        descendent: ["tt4"],
        action: { optionPackage: [] },
      },
    ],
  },
  {
    categoryName: "Wheels",
    component: Dropdown,
    choices: [
      {
        name: "Wheels Trim 1",
        price: 0,
        serial: "w1",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: null,
      },
      {
        name: "Wheels Trim 2",
        price: 0,
        serial: "w2",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: null,
      },
      {
        name: "Wheels Trim 3-High End",
        price: 500,
        serial: "w3",
        descendent: ["tt4"],
        action: null,
      },
    ],
  },
  {
    categoryName: "Exterior Accessories",
    component: CheckBoxGroup,
    choices: [
      {
        name: "Body Side Molding",
        price: 242,
        serial: "ea1",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: null,
      },
      {
        name: "Decklid Spoiler™",
        price: 322,
        serial: "ea2",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        action: null,
      },
      {
        name: "Splash Guard Set",
        price: 322,
        serial: "ea3",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
      },
      {
        name: "EA trim 4-High End",
        price: 322,
        serial: "ea4",
        descendent: ["tt4"],
        action: null,
      },
    ],
  },
  {
    categoryName: "Interior Accessories",
    component: CheckBoxGroup,
    choices: [
      {
        name: "Red-High End",
        price: 0,
        serial: "ia1",
        action: null,
      },
    ],
  },
];

export default CivicData;
