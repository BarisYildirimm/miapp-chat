import express from "express";
import {
  conversation,
  conversationForUser,
} from "../controllers/conversationController.js";

const router = express.Router();

router.post("/", conversation);
router.get("/:id", conversationForUser);

export default router;
