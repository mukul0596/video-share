const express = require("express");
const router = express.Router();
const fileUpload = require("../middleware/fileUpload");
const { authMiddleware } = require("../middleware/auth");
const {
  uploadFile,
  shareFile,
  getSharedFiles,
  getFile,
  getMyFiles,
  streamFile,
  downloadFile,
  getSharedWith,
  removeSharedWithUser,
  getUserFiles,
  deleteFile,
} = require("../controllers/file");
const checkPublicFile = require("../middleware/checkPublicFile");
const { checkRole } = require("../middleware/rbac");

/**
 * @swagger
 * tags:
 *   name: File Management
 *   description: API endpoints for managing files
 */

/**
 * @swagger
 * /api/file/upload:
 *   post:
 *     summary: Upload a file
 *     description: Upload a file with authentication required.
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: File uploaded successfully
 *       '400':
 *         description: Bad request, missing file or authentication token
 *       '500':
 *         description: Server error
 */
router.post("/upload", authMiddleware, fileUpload.single("file"), uploadFile);

/**
 * @swagger
 * /api/file/my:
 *   get:
 *     summary: Get files uploaded by the authenticated user
 *     description: Retrieve files uploaded by the currently authenticated user.
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of files retrieved successfully
 *       '401':
 *         description: Unauthorized, invalid token
 *       '500':
 *         description: Server error
 */
router.get("/my", authMiddleware, getMyFiles);

/**
 * @swagger
 * /api/file/{userId}/files:
 *   get:
 *     summary: Get files uploaded by a specific user
 *     description: Retrieve files uploaded by a specific user (requires admin rights).
 *     tags: [File Management]
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
 *         description: List of files retrieved successfully
 *       '401':
 *         description: Unauthorized, invalid token or insufficient permissions
 *       '500':
 *         description: Server error
 */
router.get("/:userId/files", authMiddleware, checkRole("admin"), getUserFiles);

/**
 * @swagger
 * /api/file/share:
 *   post:
 *     summary: Share a file with other users
 *     description: Share a file with other users (requires authentication).
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileId:
 *                 type: string
 *               sharedWith:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: File shared successfully
 *       '400':
 *         description: Bad request, missing required fields
 *       '401':
 *         description: Unauthorized, invalid token
 *       '500':
 *         description: Server error
 */
router.post("/share", authMiddleware, shareFile);

/**
 * @swagger
 * /api/file/shared:
 *   get:
 *     summary: Get files shared with the authenticated user
 *     description: Retrieve files that have been shared with the authenticated user.
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of shared files retrieved successfully
 *       '401':
 *         description: Unauthorized, invalid token
 *       '500':
 *         description: Server error
 */
router.get("/shared", authMiddleware, getSharedFiles);

/**
 * @swagger
 * /api/file/{id}:
 *   get:
 *     summary: Get file details
 *     description: Retrieve details of a specific file.
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: File details retrieved successfully
 *       '401':
 *         description: Unauthorized, invalid token
 *       '404':
 *         description: File not found
 *       '500':
 *         description: Server error
 */
router.get("/:id", checkPublicFile, authMiddleware, getFile);
router.get("/:id", getFile);

/**
 * @swagger
 * /api/file/stream/{id}:
 *   get:
 *     summary: Stream video file
 *     description: Stream a video file for playback.
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Video streaming started successfully
 *       '401':
 *         description: Unauthorized, invalid token
 *       '404':
 *         description: File not found
 *       '500':
 *         description: Server error
 */
router.get("/stream/:id", checkPublicFile, authMiddleware, streamFile);
router.get("/stream/:id", streamFile);

/**
 * @swagger
 * /api/file/download/{id}:
 *   get:
 *     summary: Download video file
 *     description: Download a video file.
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: File download started successfully
 *       '401':
 *         description: Unauthorized, invalid token
 *       '404':
 *         description: File not found
 *       '500':
 *         description: Server error
 */
router.get("/download/:id", checkPublicFile, authMiddleware, downloadFile);
router.get("/download/:id", downloadFile);

/**
 * @swagger
 * /api/file/shared-with/{id}:
 *   get:
 *     summary: Get users with whom a file is shared
 *     description: Retrieve users with whom a specific file is shared.
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of users retrieved successfully
 *       '401':
 *         description: Unauthorized, invalid token
 *       '404':
 *         description: File not found or not shared
 *       '500':
 *         description: Server error
 */
router.get("/shared-with/:id", authMiddleware, getSharedWith);

/**
 * @swagger
 * /api/file/shared-with/{fileId}/{userId}:
 *   delete:
 *     summary: Remove user from shared list of a file
 *     description: Remove a user from the shared list of a specific file.
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User removed successfully from shared list
 *       '401':
 *         description: Unauthorized, invalid token
 *       '404':
 *         description: File not found or user not in shared list
 *       '500':
 *         description: Server error
 */
router.delete(
  "/shared-with/:fileId/:userId",
  authMiddleware,
  removeSharedWithUser
);

/**
 * @swagger
 * /api/file/{fileId}:
 *   delete:
 *     summary: Delete a file
 *     description: Delete a specific file.
 *     tags: [File Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: File deleted successfully
 *       '401':
 *         description: Unauthorized, invalid token
 *       '404':
 *         description: File not found
 *       '500':
 *         description: Server error
 */
router.delete("/:fileId", authMiddleware, deleteFile);

module.exports = router;
