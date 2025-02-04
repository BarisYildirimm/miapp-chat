import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import colors from "colors";
import cors from "cors";
import mongoDbConnection from "./config/db.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import Users from "./models/userModel.js";

dotenv.config();
mongoDbConnection();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let users = [];

// Kullanıcı bağlandığında
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`.bgBlue);

  socket.on("addUser", (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      console.log("Online Users:", users);
      io.emit("getUsers", users);
    }
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message, conversationId }) => {
    console.log("Mesaj geldi ->", senderId, receiverId, message, conversationId);
    const receiver = users.find((user) => user.userId === receiverId);
    const sender = users.find((user) => user.userId === senderId);
    const user = await Users.findById(senderId);

    const messageData = {
      senderId,
      message,
      conversationId,
      receiverId,
      user: { id: user._id, name: user.name, email: user.email },
    };

    try {
      if (receiver) {
        io.to(receiver.socketId).emit("getMessage", messageData);
      }
      io.to(sender.socketId).emit("getMessage", messageData);
    } catch (error) {
      console.error("Mesaj iletme hatası:", error);
    }
  });

  socket.on("typing-started", ({ senderId, receiverId }) => {
    const receiver = users.find((user) => user.userId === receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("typing-started-from-server", senderId);
    }
  });

  socket.on("typing-stopped", ({ senderId, receiverId }) => {
    const receiver = users.find((user) => user.userId === receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("typing-stopped-from-server", senderId);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`.bgGreen);
});
