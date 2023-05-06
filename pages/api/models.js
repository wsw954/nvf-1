import vehicleData from "./vehicleData";

const modelsByMake = vehicleData.reduce((acc, item) => {
  const make = item.make;
  const models = item.models;
  acc[make] = models;
  return acc;
}, {});

export default function handler(req, res) {
  const { make } = req.query;

  if (!make) {
    res.status(400).json({ error: "Make parameter is required" });
    return;
  }

  const models = modelsByMake[make];

  if (!models) {
    res.status(404).json({ error: "Make not found" });
    return;
  }

  res.status(200).json(models);
}
