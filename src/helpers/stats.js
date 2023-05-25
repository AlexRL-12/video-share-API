import { Comment, Video } from "../models";

async function videoCounter() {
  return await Video.countDocuments();
}

async function commentsCounter() {
  return await Comment.countDocuments();
}

async function videoTotalViewsCounter() {
  const result = await Video.aggregate([
    {
      $group: {
        _id: null,
        viewsTotal: { $sum: "$views" },
      },
    },
  ]);

  let viewsTotal = 0;
  if (result.length > 0) {
    viewsTotal += result[0].viewsTotal;
  }
  return viewsTotal;
}

async function likesTotalCounter() {
  const result = await Video.aggregate([
    {
      $group: {
        _id: null,
        likesTotal: { $sum: "$likes" },
      },
    },
  ]);

  let likesTotal = 0;
  if (result.length > 0) {
    likesTotal += result[0].likesTotal;
  }
  return likesTotal;
}

export default async () => {
  const results = await Promise.all([
    videoCounter(),
    commentsCounter(),
    videoTotalViewsCounter(),
    likesTotalCounter(),
  ]);

  return {
    videos: results[0],
    comments: results[1],
    views: results[2],
    likes: results[3],
  };
};
