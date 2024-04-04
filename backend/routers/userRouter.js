import { Router } from "express";
import {
  post_signUp,
  post_login,
  get_logout,
  get_user_profile_by_id,
  update_user_profile_by_id,
} from "../controllers/userController.js";

const router = Router();
// TODO: add validation middleware
router.post("/signup", post_signUp);
router.post("/login", post_login);
router.get("/logout", get_logout);
router.get("/profile/:id", get_user_profile_by_id);
router.put("/profile/:id", update_user_profile_by_id);

export default router;
