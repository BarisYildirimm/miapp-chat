import Messages from "../models/MessagesModel.js";
import Users from "../models/userModel.js";

export const message = async (req, res) => {
  try {
    const { conversationId, senderId, message } = req.body;
    const newMessage = await new Messages({
      conversationId,
      senderId,
      message,
    });
    await newMessage.save();
    res.status(200).send("Message Send Success");
  } catch (error) {
    console.log(error);
  }
};

export const getConversationId = async (req, res) => {
  console.log(req.params.conversationId);
  try {
    const conversationId = req.params.conversationId;
    const messages = await Messages.find({ conversationId });
    const messageUserData = Promise.all(
      messages.map(async (message) => {
        const user = await Users.findById(message.senderId);
        return {
          user: { id: user._id, email: user.email, name: user.name },
          message: message.message,
        };
      })
    );
    res.status(200).json(await messageUserData);
  } catch (error) {
    console.log(error);
  }
};
