const express = require("express");
const Topic = require("../models/Topic");
const Problem = require("../models/Problem");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/admin/topics:
 *   post:
 *     summary: Create a new topic
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Graphs"
 *               slug:
 *                 type: string
 *                 example: "graphs"
 *               description:
 *                 type: string
 *                 example: "Graph traversal, shortest paths, and advanced graph algorithms."
 *               resources:
 *                 type: object
 *                 properties:
 *                   youtube:
 *                     type: string
 *                     example: "https://www.youtube.com/watch?v=09_LlHjoEiY"
 *                   article:
 *                     type: string
 *                     example: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/"
 *                   practice:
 *                     type: string
 *                     example: "https://leetcode.com/tag/graph/"
 *               order:
 *                 type: number
 *                 example: 3
 *     responses:
 *       201:
 *         description: Topic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Topic slug already exists
 */
router.post("/topics", protect, admin, async (req, res) => {
  const { title, slug, description, resources, order } = req.body;

  if (!title || !slug) {
    return res.status(400).json({ message: "Title and slug are required" });
  }

  const existingTopic = await Topic.findOne({ slug });
  if (existingTopic) {
    return res.status(409).json({ message: "Topic slug already exists" });
  }

  // Prevent duplicate topic titles (case-insensitive)
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
  const existingTitle = await Topic.findOne({
    title: { $regex: `^${escapeRegex(title)}$`, $options: "i" },
  });
  if (existingTitle) {
    return res.status(409).json({ message: "Topic title already exists" });
  }

  const topic = await Topic.create({
    title,
    slug,
    description,
    resources,
    order,
  });

  res.status(201).json(topic);
});

/**
 * @swagger
 * /api/admin/problems:
 *   post:
 *     summary: Create a new problem
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topicId
 *               - title
 *             properties:
 *               topicId:
 *                 type: string
 *                 example: "64b7f2e9a2d4a0b1f2c0d4e5"
 *               title:
 *                 type: string
 *                 example: "Word Ladder II"
 *               description:
 *                 type: string
 *                 example: "Find all shortest transformation sequences from start to end word using BFS and backtracking."
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *                 example: "Hard"
 *               resources:
 *                 type: object
 *                 properties:
 *                   youtube:
 *                     type: string
 *                     example: "https://www.youtube.com/watch?v=7-WZ2e0VxwQ"
 *                   article:
 *                     type: string
 *                     example: "https://www.geeksforgeeks.org/word-ladder-ii/"
 *                   practice:
 *                     type: string
 *                     example: "https://leetcode.com/problems/word-ladder-ii/"
 *               order:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Problem created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Problem'
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Topic not found
 */
router.post("/problems", protect, admin, async (req, res) => {
  const { topicId, title, description, difficulty, resources, order } = req.body;

  if (!topicId || !title) {
    return res.status(400).json({ message: "Topic ID and title are required" });
  }

  const topic = await Topic.findById(topicId);
  if (!topic) {
    return res.status(404).json({ message: "Topic not found" });
  }

  const problem = await Problem.create({
    topic: topic._id,
    title,
    description,
    difficulty,
    resources,
    order,
  });

  res.status(201).json(problem);
});

module.exports = router;
