import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
  {
    video_id: { type: Schema.Types.ObjectId },
    email: { type: String },
    name: { type: String },
    comment: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

CommentSchema.virtual("video", {
  ref: "Video",
  localField: "video_id",
  foreignField: "_id",
  justOne: true,
});

export default model("Comment", CommentSchema);
