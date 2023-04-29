// pages/api/makes.js

export default function handler(req, res) {
  const makes = ["Honda", "Toyota", "Volkswagen", "Kia", "Nissan"];

  res.status(200).json(makes);
}
