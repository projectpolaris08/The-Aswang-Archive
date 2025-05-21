import mongoose from "mongoose";

export interface IStory extends mongoose.Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  imageUrl: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
storySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IStory>("Story", storySchema);
