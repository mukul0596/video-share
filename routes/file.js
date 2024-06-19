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
 * @route   POST /api/file/upload
 * @desc    Upload a file
 * @access  Private (requires authentication)
 */
router.post("/upload", authMiddleware, fileUpload.single("file"), uploadFile);

/**
 * @route   GET /api/file/my
 * @desc    Get files uploaded by the authenticated user
 * @access  Private (requires authentication)
 */
router.get("/my", authMiddleware, getMyFiles);

/**
 * @route   GET /api/file/:userId
 * @desc    Get files uploaded by the user
 * @access  Private (requires super-admin or admin authentication)
 */
router.get("/:userId/files", authMiddleware, checkRole("admin"), getUserFiles);

/**
 * @route   POST /api/file/share
 * @desc    Share a file with other users
 * @access  Private (requires authentication)
 */
router.post("/share", authMiddleware, shareFile);

/**
 * @route   GET /api/file/shared
 * @desc    Get files shared with the authenticated user
 * @access  Private (requires authentication)
 */
router.get("/shared", authMiddleware, getSharedFiles);

/**
 * @route   GET /api/file/:id
 * @desc    Get file details
 * @access  Private (requires authentication)
 */
router.get("/:id", checkPublicFile, authMiddleware, getFile);
router.get("/:id", getFile);

/**
 * @route   GET /api/file/stream/:id
 * @desc    Stream video file
 * @access  Private (requires authentication)
 */
router.get("/stream/:id", checkPublicFile, authMiddleware, streamFile);
router.get("/stream/:id", streamFile);

/**
 * @route   GET /api/file/download/:id
 * @desc    Download video file
 * @access  Private (requires authentication)
 */
router.get("/download/:id", checkPublicFile, authMiddleware, downloadFile);
router.get("/download/:id", downloadFile);

/**
 * @route   GET /api/file/shared-with/:id
 * @desc    Get _id and email of users with whom a particular file is shared
 * @access  Private (requires authentication)
 */
router.get("/shared-with/:id", authMiddleware, getSharedWith);

/**
 * @route   DELETE /api/files/shared-with/:fileId/:userId
 * @desc    Remove a user from the sharedWith array of a file
 * @access  Private (requires authentication)
 */
router.delete(
  "/shared-with/:fileId/:userId",
  authMiddleware,
  removeSharedWithUser
);

/**
 * @route   DELETE /api/files/:fileId
 * @desc    Delete a file
 * @access  Private
 */
router.delete("/:fileId", authMiddleware, deleteFile);

module.exports = router;
