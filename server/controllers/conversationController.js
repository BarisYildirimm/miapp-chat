import Conversations from "../models/conversationModel.js";
import User from "../models/userModel.js";

export const conversation = async (req, res) => {
  console.log(req.body);
  try {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversations({
      members: { senderId, receiverId },
    });
    await newConversation.save();

    res.status(200).json({
      message: "SUCCES",
      data: newConversation,
    });
  } catch (error) {
    console.log(error);
  }
};


export const conversationForUser = async (req, res) => {
  try {
    const id = req.params.id;
    // const conversations = await Conversations.find({
    //   members: {
    //     $elemMatch: {
    //       senderId: id,
    //     },
    //   },
    // });
    if (id === "new") {
      return res.status(200).json([]);
    }
    const conversations = await Conversations.aggregate([
      {
        $match: {
          $or: [{ "members.senderId": id }, { "members.receiverId": id }],
        },
      },
    ]);

    const conversationUserData = Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.map((member) =>
          member.senderId === id ? member.receiverId : member.senderId
        );

        const user = await User.findById(receiverId);

        return {
          user: { id: user._id, email: user.email, name: user.name },
          conversationId: conversation._id,
        };
      })
    );

    res.status(200).json(await conversationUserData);
  } catch (error) {
    console.log(error);
  }
};
