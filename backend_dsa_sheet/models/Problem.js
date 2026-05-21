const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    resources: {
      youtube: { type: String, trim: true },
      article: { type: String, trim: true },
      practice: { type: String, trim: true },
    },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

ProblemSchema.index({ topic: 1, order: 1 });

module.exports = mongoose.model("Problem", ProblemSchema);
