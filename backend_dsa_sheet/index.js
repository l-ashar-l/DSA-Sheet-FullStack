const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const topicRoutes = require("./routes/topicRoutes");
const progressRoutes = require("./routes/progressRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { seedDatabase } = require("./config/seed");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const start = async () => {
  await connectDB();

  try {
    const Topic = require("./models/Topic");
    const User = require("./models/User");
    const topicCount = await Topic.countDocuments();
    const userCount = await User.countDocuments();
    if (topicCount === 0 && userCount === 0) {
      console.log("Empty DB detected — running initial seed...");
      await seedDatabase();
    }
  } catch (err) {
    console.error("Seeding check failed:", err.message);
  }
};

start();

app.get("/", (req, res) => {
  res.json({ message: "DSA Sheet API is running" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
