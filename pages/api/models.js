const modelsByMake = {
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Fit"],
  Toyota: ["Corolla", "Camry", "RAV4", "Highlander", "Tacoma"],
  Volkswagen: ["Golf", "Jetta", "Passat", "Tiguan", "Atlas"],
  Kia: ["Forte", "Optima", "Sorento", "Sportage", "Soul"],
  Nissan: ["Altima", "Maxima", "Rogue", "Murano", "Frontier"],
};

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
