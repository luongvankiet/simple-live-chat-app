import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/auth.controller.js";
import {
  checkVerifiedToken,
  getCurrentUser,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", checkVerifiedToken, updateProfile);

router.get("/me", checkVerifiedToken, getCurrentUser);

export default router;
