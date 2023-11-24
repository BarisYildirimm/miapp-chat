import express from "express";
import {
  message,
  getConversationId,
} from "../controllers/messageController.js";
const router = express.Router();

router.post("/", message);
router.get("/:conversationId", getConversationId);

export default router;
