import Dropdown from "../../components/Dropdown";
import CheckBoxGroup from "../../components/CheckBoxGroup";

const CivicData = [
  {
    categoryName: "Trim",
    component: Dropdown,
    choices: [
      { name: "Sedan LX", price: 23750, serial: "tt1", ancestor: [] },
      { name: "Sedan Sport", price: 25050, serial: "tt2", ancestor: [] },
      { name: "Sedan EX", price: 26450, serial: "tt3", ancestor: [] },
      { name: "Sedan Touring", price: 30050, serial: "tt4", ancestor: [] },
      { name: "Hatchback EX", price: 24750, serial: "tt5", ancestor: [] },
      { name: "Hatchback Sport", price: 26150, serial: "tt6", ancestor: [] },
      { name: "Hatchback EX-L", price: 28450, serial: "tt7", ancestor: [] },
      {
        name: "Hatchback Sport Touring",
        price: 31250,
        serial: "tt8",
        ancestor: [],
      },
      { name: "Si", price: 28500, serial: "tt9", ancestor: [] },
      { name: "Type R", price: 42895, serial: "tt10", ancestor: [] },
    ],
  },
  {
    categoryName: "Powertrain",
    component: Dropdown,
    choices: [
      {
        name: "2.0L 4-Cyl 158hp Engine w/CVT",
        price: 0,
        serial: "pw1",
        descendent: [{ categoryName: "Trim", descendent: ["tt1"] }],
      },
      {
        name: "1.5L Turbo 4-Cyl 180hp Engine w/CVT",
        price: 500,
        serial: "pw1",
        descendent: [{ categoryName: "Trim", descendent: ["tt2"] }],
      },
    ],
  },
  {
    categoryName: "Exterior Color",
    component: Dropdown,
    choices: [
      {
        name: "Aegean Blue Metallic",
        price: 0,
        serial: "ec1",
        descendent: [{ categoryName: "Trim", descendent: ["tt1", "tt2"] }],
      },
      {
        name: "Crystal Black Pearl",
        price: 0,
        serial: "ec2",
        descendent: [{ categoryName: "Trim", descendent: ["tt1", "tt2"] }],
      },
      {
        name: "Lunar Silver Metallic",
        descendent: [{ categoryName: "Trim", descendent: ["tt2"] }],
        price: 0,
      },
      {
        name: "Meteorite Gray Metallic",
        descendent: [{ categoryName: "Trim", descendent: ["tt2"] }],
        price: 0,
      },
      {
        name: "Rallye Red",
        descendent: [{ categoryName: "Trim", descendent: ["tt2"] }],
        price: 0,
      },
      {
        name: "Platinum White Pearl",
        descendent: [{ categoryName: "Trim", descendent: ["tt2"] }],
        price: 455,
      },
    ],
  },
  {
    categoryName: "Packages",
    component: CheckBoxGroup,
    choices: [
      {
        name: "All-Season Protection Package I",
        price: 420,
        serial: "pk1",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        package: ["All-Season Floor Mats", "Splash Guard Set", "Trunk Tray"],
      },
      {
        name: "All-Season Protection Package II",
        price: 370,
        serial: "pk2",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        package: ["All-Season Floor Mats", "Wheel Locks", "Trunk Tray"],
      },
      {
        name: "HPD™ Package",
        price: 1452,
        serial: "pk3",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        package: [
          "HPD™ Decklid Spoiler",
          "HPD™ Emblem",
          "HPD™ Front Underbody Spoiler",
        ],
      },
      {
        name: "Protection Package",
        price: 300,
        serial: "pk4",
        descendent: ["tt1", "tt2", "tt3", "tt4"],
        package: ["Splash Guard Set", "Trunk Tray", "Wheel Locks"],
      },
      {
        name: "All-Season Protection Package I",
        price: 415,
        serial: "pk5",
        descendent: ["tt5", "tt6", "tt7", "tt8"],
        package: ["Splash Guard Set", "All-season Floor Mats", "Cargo Tray"],
      },
      {
        name: "All-Season Protection Package II",
        price: 367,
        serial: "pk6",
        descendent: ["tt5", "tt6", "tt7", "tt8"],
        package: ["All-season Floor Mats", "Cargo Tray", "Chrome Wheel Locks"],
      },
      {
        name: "HPD™ Package",
        price: 799,
        serial: "pk7",
        descendent: ["tt5", "tt6", "tt7", "tt8"],
        package: [
          "HPD Front Underbody Spoiler",
          "HPD Emblem",
          "HPD Tailgate Spoiler",
        ],
      },
      {
        name: "Protection Package I",
        price: 295,
        serial: "pk8",
        descendent: ["tt5", "tt6", "tt7", "tt8"],
        package: ["Splash Guard Set", "Cargo Tray", "Chrome Wheel Locks"],
      },
    ],
  },
  {
    categoryName: "Wheels",
    component: Dropdown,
    choices: [
      {
        name: "Red Rims",
        descendent: [{ categoryName: "Trim", descendent: ["tt2"] }],
        price: 0,
      },
      {
        name: "Green Rims",
        descendent: [{ categoryName: "Trim", descendent: ["tt2"] }],
        price: 0,
      },
      {
        name: "Black Rims",
        descendent: [{ categoryName: "Trim", descendent: ["tt2"] }],
        price: 500,
      },
    ],
  },
  {
    categoryName: "Exterior Accessories",
    component: CheckBoxGroup,
    choices: [
      {
        name: "Body Side Molding",
        descendent: [{ categoryName: "Trim", descendent: ["tt2"] }],
        price: 242,
      },
      {
        name: "Decklid Spoiler – HPD™",
        descendent: [{ categoryName: "Trim", descendent: ["tt2"] }],
        price: 322,
      },
      { name: "Door Edge Film", price: 54, descendent: ["tt2"] },
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

export default CivicData;
