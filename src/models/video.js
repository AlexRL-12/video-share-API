import { Schema, model } from "mongoose";
import path from "path";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

const videoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    filename: { type: String },
    credits: { type: String },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    publicationDate: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    private: { type: Boolean, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

videoSchema.plugin(mongooseLeanVirtuals);

videoSchema.virtual("uniqueId").get(function () {
  return this.filename.replace(path.extname(this.filename), "");
});

export default model("Video", videoSchema);
