const File = require("../models/File");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
    });

    await newFile.save();

    res
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMyFiles = async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user._id }).populate(
      "uploadedBy",
      "name username role managedBy"
    );

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching user uploaded files:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserFiles = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.managedBy.equals(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const files = await File.find({ uploadedBy: userId }).populate(
      "uploadedBy",
      "name username role managedBy"
    );

    res.status(200).json({ files, user });
  } catch (error) {
    console.error("Error fetching user uploaded files:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const shareFile = async (req, res) => {
  try {
    const { fileId, username, isPublic } = req.body;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!file.uploadedBy.equals(req.user._id)) {
      const user = await User.findById(file.uploadedBy);

      if (!req.user._id.equals(user.managedBy)) {
        return res
          .status(403)
          .json({ message: "You do not have access to this file" });
      }
    }
    if (isPublic != null && isPublic != undefined) {
      file.isPublic = isPublic;
    } else {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "Username not found" });
      }
      if (file.sharedWith.includes(user._id) || user._id.equals(req.user.id)) {
        return res.status(409).json({ message: "Username already exists" });
      }
      file.sharedWith.push(user._id);
    }

    await file.save();

    res.status(200).json({ message: "File shared successfully", file });
  } catch (error) {
    console.error("Error sharing file:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getSharedFiles = async (req, res) => {
  try {
    const files = await File.find({ sharedWith: req.user._id }).populate(
      "uploadedBy",
      "name username role managedBy"
    );

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching shared files:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate(
      "uploadedBy",
      "name username role managedBy"
    );

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (
      !file.uploadedBy.equals(req?.user?._id) &&
      !file.sharedWith.includes(req?.user?._id) &&
      !file.isPublic
    ) {
      const user = await User.findById(file.uploadedBy);

      if (!req.user._id.equals(user.managedBy)) {
        return res
          .status(403)
          .json({ message: "You do not have access to this file" });
      }
    }

    res.status(200).json({ file });
  } catch (error) {
    console.error("Error fetching file details:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const streamFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (
      !file.uploadedBy.equals(req?.user?._id) &&
      !file.sharedWith.includes(req?.user?._id) &&
      !file.isPublic
    ) {
      const user = await User.findById(file.uploadedBy);

      if (!req.user._id.equals(user.managedBy)) {
        return res
          .status(403)
          .json({ message: "You do not have access to this file" });
      }
    }

    const filePath = path.resolve(__dirname, "../uploads", file.filename);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res
          .status(416)
          .send(
            "Requested range not satisfiable\n" + start + " >= " + fileSize
          );
        return;
      }

      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": file.mimetype,
      });

      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": file.mimetype,
      });

      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error("Error streaming file:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (
      !file.uploadedBy.equals(req?.user?._id) &&
      !file.sharedWith.includes(req?.user?._id) &&
      !file.isPublic
    ) {
      const user = await User.findById(file.uploadedBy);

      if (!req.user._id.equals(user.managedBy)) {
        return res
          .status(403)
          .json({ message: "You do not have access to this file" });
      }
    }

    const filePath = path.resolve(__dirname, "../uploads", file.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.status(200).download(filePath, file.originalName);
  } catch (error) {
    console.error("Error downloading file:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getSharedWith = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate(
      "sharedWith",
      "_id username"
    );

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const user = await User.findById(file.uploadedBy);
    if (
      !file.uploadedBy.equals(req.user._id) &&
      !file.sharedWith.includes(req.user._id) &&
      !file.isPublic
    ) {
      if (!req.user._id.equals(user.managedBy)) {
        return res
          .status(403)
          .json({ message: "You do not have access to this file" });
      }
    }

    const sharedWithUsers = file.sharedWith.map((user) => ({
      _id: user._id,
      username: user.username,
    }));

    res.json({
      sharedWithUsers,
      owner: { _id: user._id, username: user.username },
      isPublic: file.isPublic,
    });
  } catch (error) {
    console.error("Error fetching shared users:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const removeSharedWithUser = async (req, res) => {
  try {
    const { fileId, userId } = req.params;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!file.uploadedBy.equals(req.user._id)) {
      const user = await User.findById(file.uploadedBy);

      if (!req.user._id.equals(user.managedBy)) {
        return res
          .status(403)
          .json({ message: "You do not have access to this file" });
      }
    }

    const updatedSharedWith = file.sharedWith.filter(
      (user) => user.toString() !== userId
    );

    file.sharedWith = updatedSharedWith;
    await file.save();

    res.json({ message: "User removed from sharedWith list" });
  } catch (error) {
    console.error("Error removing user from sharedWith:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const user = await User.findById(file.uploadedBy);

    if (
      !file.uploadedBy.equals(req.user._id) &&
      !req.user._id.equals(user.managedBy)
    ) {
      return res
        .status(403)
        .json({ message: "You do not have access to this file" });
    }

    const filePath = path.join(__dirname, "..", "uploads", file.filename);
    fs.unlinkSync(filePath);

    await file.deleteOne();

    if (user) {
      user.totalStorageUsed -= file.size;
      await user.save();
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  uploadFile,
  getMyFiles,
  getUserFiles,
  shareFile,
  getSharedFiles,
  getFile,
  streamFile,
  downloadFile,
  getSharedWith,
  removeSharedWithUser,
  deleteFile,
};
