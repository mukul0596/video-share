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

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Add a new user
 *     description: Add a new user with provided details.
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: User added successfully
 *       '400':
 *         description: Bad request, missing required fields or user already exists
 *       '401':
 *         description: Unauthorized, invalid token or insufficient permissions
 *       '500':
 *         description: Server error
 */
router.post("/", authMiddleware, checkRole("admin"), addUser);

/**
 * @swagger
 * /api/user/{userId}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by userId.
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized, invalid token or insufficient permissions
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.delete("/:userId", authMiddleware, checkRole("admin"), deleteUser);

/**
 * @swagger
 * /api/user/managed-by/{adminId}:
 *   get:
 *     summary: Get all users managed by a specific admin
 *     description: Retrieve users managed by a specific admin (requires admin rights).
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of users retrieved successfully
 *       '401':
 *         description: Unauthorized, invalid token or insufficient permissions
 *       '500':
 *         description: Server error
 */
router.get("/managed-by", authMiddleware, checkRole("admin"), getUsers);

/**
 * @swagger
 * /api/user/{userId}/size-limit:
 *   put:
 *     summary: Update upload size limit for a user
 *     description: Update upload size limit for a user (requires admin rights).
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sizeLimit:
 *                 type: number
 *                 description: New upload size limit in bytes
 *     responses:
 *       '200':
 *         description: Size limit updated successfully
 *       '400':
 *         description: Bad request, invalid size limit
 *       '401':
 *         description: Unauthorized, invalid token or insufficient permissions
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.put(
  "/:userId/size-limit",
  authMiddleware,
  checkRole("admin"),
  updateSizeLimit
);

module.exports = router;
