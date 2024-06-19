const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { checkRole } = require("../middleware/rbac");
const {
  addUser,
  deleteUser,
  getUsers,
  updateSizeLimit,
} = require("../controllers/user");

// @route   POST /api/user
// @desc    Add a new user
// @access  Private (requires super-admin or admin authentication)
router.post("/", authMiddleware, checkRole("admin"), addUser);

// @route   DELETE /api/user/:userId
// @desc    Delete a user
// @access  Private (requires super-admin or admin authentication)
router.delete("/:userId", authMiddleware, checkRole("admin"), deleteUser);

/**
 * @route   GET /api/user/managed-by/:adminId
 * @desc    Get all users managed by a specific admin
 * @access  Private (requires super-admin or admin authentication)
 */
router.get("/managed-by", authMiddleware, checkRole("admin"), getUsers);

/**
 * @route   PUT /api/user/:userId/size-limit
 * @desc    Set upload size limit for a user
 * @access  Private (requires super-admin or admin authentication)
 */
router.put(
  "/:userId/size-limit",
  authMiddleware,
  checkRole("admin"),
  updateSizeLimit
);

module.exports = router;
