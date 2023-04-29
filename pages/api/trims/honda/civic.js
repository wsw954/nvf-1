const trims = [
  "Sedan LX",
  "Sedan Sport",
  "Sedan EX",
  "Sedan Touring",
  "Hatchback EX",
];

export default function handler(req, res) {
  res.status(200).json(trims);
}
