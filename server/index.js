import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import colors from "colors";
import cors from "cors";
import mongoDbConnection from "./config/db.js";
import dotenv from "dotenv";
import url, { fileURLToPath } from "url";
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
io.on("connection", (socket) => {
  // console.log("Connection is ready");
  console.log("User connected", socket.id.bgBlue);
  socket.on("addUser", (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, conversationId }) => {
      console.log(
        "sendMessage Gelen Data Backend->",
        senderId,
        receiverId,
        message,
        conversationId
      );
      console.log("users Array", users);
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const user = await Users.findById(senderId);
      console.log(
        "Gönderilecek data backend :>> ",
        senderId,
        receiverId,
        message,
        conversationId
      );
      console.log("receiver :", receiver);
      if (receiver) {
        io.to(receiver.socketId)
          .to(sender.socketId)
          .emit("getMessage", {
            senderId,
            message,
            conversationId,
            receiverId,
            user: { id: user._id, name: user.name, email: user.email },
          });
      } else {
        io.to(sender.socketId).emit("getMessage", {
          senderId,
          message,
          conversationId,
          receiverId,
          user: { id: user._id, name: user.name, email: user.email },
        });
      }
    }
  );

  //Broadcast : Socket.IO makes it easy to send events to all the connected clients.
  // socket.on("send-message", (data) => {
  //   socket.broadcast.emit("message-from-server", data);
  // });

  socket.on("typing-started", () => {
    socket.broadcast.emit("typing-started-from-server");
  });

  socket.on("typing-stoped", () => {
    socket.broadcast.emit("typing-stoped-from-server");
  });

  socket.on("disconnect", (socket) => {
    console.log("User Left");
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
    // socket.on("send-message", (data) => {
    //   socket.emit("message-from-server", data);
    // });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`.bgGreen);
});
