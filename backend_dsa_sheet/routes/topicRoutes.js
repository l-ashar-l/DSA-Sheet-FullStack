const express = require("express");
const Topic = require("../models/Topic");
const Problem = require("../models/Problem");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/topics:
 *   get:
 *     summary: Get all topics with their problems
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all topics with problems
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   description:
 *                     type: string
 *                   difficulty:
 *                     type: string
 *                   order:
 *                     type: number
 *                   problems:
 *                     type: array
 *                     items:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, async (req, res) => {
  const topics = await Topic.find().sort({ order: 1 }).lean();
  const problems = await Problem.find().sort({ order: 1 }).lean();

  const topicsWithProblems = topics.map((topic) => ({
    ...topic,
    problems: problems.filter((problem) => problem.topic.toString() === topic._id.toString()),
  }));

  res.json(topicsWithProblems);
});

/**
 * @swagger
 * /api/topics/{id}:
 *   get:
 *     summary: Get a specific topic with its problems
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *     responses:
 *       200:
 *         description: Topic with problems
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topic:
 *                   type: object
 *                 problems:
 *                   type: array
 *       404:
 *         description: Topic not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, async (req, res) => {
  const topic = await Topic.findById(req.params.id).lean();
  if (!topic) {
    return res.status(404).json({ message: "Topic not found" });
  }

  const problems = await Problem.find({ topic: topic._id }).sort({ order: 1 }).lean();
  res.json({ topic, problems });
});

module.exports = router;
