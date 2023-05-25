import { Router } from "express";
const router = Router();

import {
  videoCtrl as video,
  authCtrl as auth,
  actionCtrl as action,
  videoCtrl,
} from "../controllers";

import { authenticateJwt } from "../middleware/jwtUtils";

router.post("/videos", authenticateJwt, video.create);
router.post("/videos/:video_id/like", action.like);
router.post("/videos/:video_id/comment", action.comment);

router.delete("/videos/:video_id", authenticateJwt, video.remove);

router.put("/videos/:video_id", authenticateJwt, video.update);

router.get("/videos/public", videoCtrl.getPublicVideos);
router.get("/videos/private", authenticateJwt, videoCtrl.getPrivateVideos);
router.get("/videos/popular", action.getPopularVideos);

export default router;
