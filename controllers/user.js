const bcrypt = require("bcryptjs");
const User = require("../models/User");

const addUser = async (req, res) => {
  try {
    const { username, password, role = "user" } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      username,
      password,
      role,
      managedBy: req.user.id,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: "User added successfully", user });
  } catch (error) {
    console.error("Error adding user:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.managedBy.equals(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const { id } = req.user;

    const users = await User.find({ managedBy: id });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users managed by admin:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateSizeLimit = async (req, res) => {
  try {
    const { userId } = req.params;
    const { sizeLimit } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.managedBy.equals(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    user.sizeLimit = sizeLimit;
    await user.save();

    res.json({ message: "Size limit updated successfully", user });
  } catch (error) {
    console.error("Error setting size limit:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addUser,
  deleteUser,
  getUsers,
  updateSizeLimit,
};
