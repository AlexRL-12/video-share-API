import fs from "fs-extra";
import path from "path";

import { randomNumber } from "../helpers/libs";
import { Video, Comment } from "../models";
import { authenticateJwt } from "../middleware/jwtUtils";

import User from "../models/user";

export const create = (req, res) => {
  authenticateJwt(req, res, () => {
    const saveVideo = async () => {
      const videoUrl = randomNumber();
      const videos = await Video.find({ filename: videoUrl });
      if (videos.length > 0) {
        saveVideo();
      } else {
        const videoTempPath = req.file ? req.file.path : undefined;
        if (!videoTempPath) {
          return res.status(400).json({ error: "Video file is missing." });
        }
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`./uploads/${videoUrl}${ext}`);

        if (
          ext === ".mp4" ||
          ext === ".mov" ||
          ext === ".avi" ||
          ext === ".wmv"
        ) {
          await fs.rename(videoTempPath, targetPath);

          const userId = req.user.id;
          const isPrivate = req.body.private;
          const newVideo = new Video({
            title: req.body.title,
            filename: videoUrl + ext,
            description: req.body.description,
            user: userId, 
            private: isPrivate, 
          });

          if (
            !req.body.title ||
            !req.body.description ||
            !isPrivate ||
            !req.file
          ) {
            return res.status(400).json({ error: "Missing required data." });
          }

          const videoSaved = await newVideo.save();

          await User.findByIdAndUpdate(userId, {
            $push: { videos: videoSaved._id },
          });

          res.status(200).json({ message: "Video uploaded successfully" });
        } else {
          await fs.unlink(videoTempPath);
          res.status(500).json({ error: "Only videos are allowed" });
        }
      }
    };
    saveVideo();
  });
};

export const remove = async (req, res) => {
  await authenticateJwt(req, res, async () => {
    const video = await Video.findOne({
      _id: req.params.video_id,
    });
    if (video) {
      await fs.unlink(path.resolve("./uploads/" + video.filename));
      await Comment.deleteMany({ video_id: video._id });
      await video.remove();
      res.json("Video was deleted");
    } else {
      res.json({ response: "Bad Request." });
    }
  });
};

export const update = async (req, res) => {
  await authenticateJwt(req, res, async () => {
    try {
      const { video_id } = req.params;
      const { title, description } = req.body;
      const videoFile = req.file;
      const video = await Video.findById(video_id);

      if (!video) {
        return res.json({ response: "Video not found." });
      }

      if (!title && !description && !videoFile) {
        return res.json({ response: "No data provided for update." });
      }

      if (title) {
        video.title = title;
      }
      if (description) {
        video.description = description;
      }
      if (videoFile) {
        const allowedFormats = ["mp4", "mov"];
        const fileFormat = videoFile.originalname.split(".").pop();
        if (!allowedFormats.includes(fileFormat)) {
          return res.json({ response: "Invalid video format." });
        }

        video.video = videoFile;
      }

      await video.save();

      res.json({ response: "Video updated successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ response: "Internal Server Error." });
    }
  });
};

export const getPublicVideos = async (req, res) => {
  try {
    const publicVideos = await Video.find({ private: false }).lean();
    if (publicVideos.length === 0) {
      return res.status(404).json({ message: "No public videos found" });
    }
    res.status(200).json(publicVideos);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving public videos" });
  }
};

export const getPrivateVideos = async (req, res) => {
  authenticateJwt(req, res, async () => {
    try {
      const userId = req.user.id;
      const privateVideos = await Video.find({
        user: userId,
        private: true,
      }).lean();
      if (privateVideos.length === 0) {
        return res.status(404).json({ message: "No private videos found" });
      }
      res.status(200).json(privateVideos);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving private videos" });
    }
  });
};
