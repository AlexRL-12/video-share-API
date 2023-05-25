import { Router } from "express";
import { authCtrl } from "../controllers";
import { authenticateJwt } from "../middleware/jwtUtils";

const router = Router();

router.post("/auth/signin", authCtrl.signIn);
router.post("/auth/signup", authCtrl.signUp);

router.get("/auth/logout", authCtrl.logout);
router.get("/user/videos/:userId", authenticateJwt, authCtrl.getUserVideos);

router.put("/users/:userId", authenticateJwt, authCtrl.updateUser);

router.delete("/users/:userId", authenticateJwt, authCtrl.deleteUser);

export default router;
