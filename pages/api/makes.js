import vehicleData from "./vehicleData";

const makes = vehicleData.map((entry) => entry.make);

export default function handler(req, res) {
  res.status(200).json(makes);
}
