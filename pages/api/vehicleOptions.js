async function getOptions(make, model, trim) {
  try {
    const makeFolder = toSnakeCase(make);
    const modelFolder = toSnakeCase(model);
    const trimFile = toSnakeCase(trim);

    const options = await import(
      `./options/${makeFolder}/${modelFolder}/${trimFile}`
    );
    return options.default || options;
  } catch (error) {
    return null;
  }
}

function toSnakeCase(str) {
  return str.replace(/[\s-]+/g, "_").toLowerCase();
}

export default async (req, res) => {
  const { make, model, trim } = req.query;
  const options = await getOptions(make, model, trim);
  if (options) {
    res.status(200).json(options);
  } else {
    res.status(404).json({ message: "Options not found" });
  }
};
