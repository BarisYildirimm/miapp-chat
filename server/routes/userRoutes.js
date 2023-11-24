import express from "express";
import {
  authUser,
  register,
  searchUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//Search Yaparken Middleware kullanırken çalışmıyor fetch yaparken???
router.get("/", searchUser);
router.post("/auth", authUser);
router.post("/register", register);

export default router;
