import { Comment, Video } from "../models";

export default {
  async newest() {
    const comments = await Comment.find().limit(5).sort({ timestamp: -1 });

    for (const comment of comments) {
      const video = await Video.findOne({ _id: comment.video_id });
      comment.video = video;
    }

    return comments;
  },
};
