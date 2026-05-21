const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Topic = require("./models/Topic");
const Problem = require("./models/Problem");

dotenv.config();

const topics = [
  {
    title: "Arrays",
    slug: "arrays",
    description: "Array fundamentals, sliding window, two pointers and common array patterns.",
    difficulty: "Easy",
    resources: {
      youtube: "https://www.youtube.com/watch?v=9shpYd5xusQ",
      article: "https://www.geeksforgeeks.org/array-data-structure/",
      practice: "https://leetcode.com/tag/array/",
    },
    order: 1,
  },
  {
    title: "Linked Lists",
    slug: "linked-lists",
    description: "Singly and doubly linked lists, reversal, cycle detection, and merge operations.",
    difficulty: "Medium",
    resources: {
      youtube: "https://www.youtube.com/watch?v=njTh_OwMljA",
      article: "https://www.geeksforgeeks.org/data-structures/linked-list/",
      practice: "https://leetcode.com/tag/linked-list/",
    },
    order: 2,
  },
  {
    title: "Graphs",
    slug: "graphs",
    description: "Graph traversal, shortest paths, and advanced graph algorithms for networks.",
    difficulty: "Hard",
    resources: {
      youtube: "https://www.youtube.com/watch?v=09_LlHjoEiY",
      article: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
      practice: "https://leetcode.com/tag/graph/",
    },
    order: 3,
  },
];

const problems = [
  {
    title: "Two Sum",
    description: "Find two numbers that add up to a target.",
    difficulty: "Easy",
    resources: {
      youtube: "https://www.youtube.com/watch?v=KLlXCFG5TnA",
      article: "https://www.geeksforgeeks.org/dsa/check-if-pair-with-given-sum-exists-in-array/",
      practice: "https://leetcode.com/problems/two-sum/",
    },
    order: 1,
  },
  {
    title: "Best Time to Buy and Sell Stock",
    description: "Single transaction max profit problem using arrays.",
    difficulty: "Easy",
    resources: {
      youtube: "https://www.youtube.com/watch?v=1pkOgXD63yU",
      article: "https://www.geeksforgeeks.org/best-time-to-buy-and-sell-stock/",
      practice: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    },
    order: 2,
  },
  {
    title: "Reverse Linked List",
    description: "Reverse a singly linked list iteratively and recursively.",
    difficulty: "Medium",
    resources: {
      youtube: "https://www.youtube.com/watch?v=G0_I-ZF0S38",
      article: "https://www.geeksforgeeks.org/reverse-a-linked-list/",
      practice: "https://leetcode.com/problems/reverse-linked-list/",
    },
    order: 1,
  },
  {
    title: "Detect Cycle in Linked List",
    description: "Use Floyd's cycle-finding algorithm to detect a loop.",
    difficulty: "Medium",
    resources: {
      youtube: "https://www.youtube.com/watch?v=S5TcPmTl6ww",
      article: "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/",
      practice: "https://leetcode.com/problems/linked-list-cycle/",
    },
    order: 2,
  },
  {
    title: "Word Ladder II",
    description: "Find all shortest transformation sequences from start to end word using BFS and backtracking.",
    difficulty: "Hard",
    resources: {
      youtube: "https://www.youtube.com/watch?v=7-WZ2e0VxwQ",
      article: "https://www.geeksforgeeks.org/dsa/word-ladder-set-2-bi-directional-bfs/",
      practice: "https://leetcode.com/problems/word-ladder-ii/",
    },
    order: 1,
  },
  {
    title: "Minimum Height Trees",
    description: "Find all roots of minimum height trees using graph pruning and topological reduction.",
    difficulty: "Hard",
    resources: {
      youtube: "https://www.youtube.com/watch?v=k7NAken4OTU",
      article: "https://www.geeksforgeeks.org/minimum-height-trees/",
      practice: "https://leetcode.com/problems/minimum-height-trees/",
    },
    order: 2,
  },
];

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Topic.deleteMany();
    await Problem.deleteMany();

    const passwordHash = await bcrypt.hash("Password123", 10);
    const user = await User.create({
      name: "Student User",
      email: "student@example.com",
      password: passwordHash,
      role: "user",
    });

    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: passwordHash,
      role: "admin",
    });

    const createdTopics = await Topic.insertMany(topics);

    const topicMap = {
      arrays: createdTopics.find((topic) => topic.slug === "arrays")._id,
      "linked-lists": createdTopics.find((topic) => topic.slug === "linked-lists")._id,
      graphs: createdTopics.find((topic) => topic.slug === "graphs")._id,
    };

    await Problem.insertMany([
      { ...problems[0], topic: topicMap.arrays },
      { ...problems[1], topic: topicMap.arrays },
      { ...problems[2], topic: topicMap["linked-lists"] },
      { ...problems[3], topic: topicMap["linked-lists"] },
      { ...problems[4], topic: topicMap.graphs },
      { ...problems[5], topic: topicMap.graphs },
    ]);

    console.log("Database seeded successfully.");
    console.log("Default user: student@example.com / Password123");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
