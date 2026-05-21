const mongoose = require("mongoose");

const UserProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserProgressSchema.index({ user: 1, problem: 1 }, { unique: true });

module.exports = mongoose.model("UserProgress", UserProgressSchema);
