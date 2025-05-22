import express from "express";
import multer from "multer";
import path from "path";
import Story from "../models/Story";
import { auth } from "../middleware/auth";

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Submit a new story
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const story = new Story({
      title,
      content,
      author: req.user?._id,
      imageUrl,
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ error: "Error submitting story" });
  }
});

// Get all approved stories
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find({ status: "approved" })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching stories" });
  }
});

// Get user's stories
router.get("/my-stories", auth, async (req, res) => {
  try {
    const stories = await Story.find({ author: req.user?._id }).sort({
      createdAt: -1,
    });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching stories" });
  }
});

// Get a single story
router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: "Error fetching story" });
  }
});

export default router;
