const trims = ["LX", "EX", "Sport Hybrid", "EX-L Hybrid", "Sport-L Hybrid"];

export default function handler(req, res) {
  res.status(200).json(trims);
}
