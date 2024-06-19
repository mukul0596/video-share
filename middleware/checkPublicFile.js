const File = require("../models/File");

const checkPublicFile = async (req, res, next) => {
  const fileId = req.params.id;

  try {
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.isPublic) {
      return next("route");
    } else {
      return next();
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = checkPublicFile;
