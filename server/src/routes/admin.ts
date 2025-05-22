import express from "express";
import Story from "../models/Story";
import User from "../models/User";
import { adminAuth } from "../middleware/auth";

const router = express.Router();

// Get all pending stories
router.get("/pending-stories", adminAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "pending" })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending stories" });
  }
});

// Approve a story
router.put("/stories/:id/approve", adminAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    story.status = "approved";
    await story.save();
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: "Error approving story" });
  }
});

// Reject a story
router.put("/stories/:id/reject", adminAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    story.status = "rejected";
    await story.save();
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: "Error rejecting story" });
  }
});

// Get all users
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Make a user an admin
router.put("/users/:id/make-admin", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = "admin";
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error updating user role" });
  }
});

export default router;
