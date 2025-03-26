import express from "express";
import { checkVerifiedToken } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  readAllMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", checkVerifiedToken, getUsersForSidebar);
router.get("/:id", checkVerifiedToken, getMessages);
router.post("/send/:id", checkVerifiedToken, sendMessage);
router.post("/read-all/:id", checkVerifiedToken, readAllMessages);

export default router;
