import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timeStamps: true }
);

const Messages = mongoose.model("Messages", MessageSchema);

export default Messages;
