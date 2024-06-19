const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
    },
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sizeLimit: {
      type: Number,
      default: 1000000000, // 1 GB
    },
    totalStorageUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
