const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
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

TopicSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model("Topic", TopicSchema);
