import { config } from "dotenv";
config();

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/video_app";
export const PORT = process.env.PORT || 3000;

export const SECRET_TOKEN =
  process.env.SECRET_TOKEN || "My_secret_token_Default";
