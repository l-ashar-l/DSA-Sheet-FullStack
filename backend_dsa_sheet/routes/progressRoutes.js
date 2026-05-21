const express = require("express");
const UserProgress = require("../models/UserProgress");
const Problem = require("../models/Problem");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/progress:
 *   get:
 *     summary: Get user's problem solving progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's progress records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   problem:
 *                     type: object
 *                   completed:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, async (req, res) => {
  const progress = await UserProgress.find({ user: req.user._id })
    .populate("problem", "title difficulty resources topic")
    .lean();

  res.json(progress);
});

/**
 * @swagger
 * /api/progress/toggle:
 *   post:
 *     summary: Toggle problem completion status
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problemId
 *               - completed
 *             properties:
 *               problemId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Progress updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 problem:
 *                   type: object
 *                 completed:
 *                   type: boolean
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Problem not found
 *       401:
 *         description: Unauthorized
 */
router.post("/toggle", protect, async (req, res) => {
  const { problemId, completed } = req.body;

  if (!problemId || typeof completed !== "boolean") {
    return res.status(400).json({ message: "problemId and completed are required" });
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  const progress = await UserProgress.findOneAndUpdate(
    { user: req.user._id, problem: problemId },
    { completed },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate("problem", "title difficulty resources topic");

  res.json(progress);
});

module.exports = router;
