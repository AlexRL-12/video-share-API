import { Video } from "../models";

export default {
  async popular() {
    const videos = await Video.find()
      .limit(9)
      .sort({ likes: -1 })
      .lean({ virtuals: true });
    return videos;
  },
};
