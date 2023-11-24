/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { FaVideo } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import Logo from "../assets/Ellipse.png";

const Chat = ({ messagesConversations }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  const handleInputMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const handleClickMessage = () => {
    console.log("handleClickMessage:", {
      senderId: userInfo._id,
      receiverId: messagesConversations?.receiver?.id,
      message,
      conversationId: messagesConversations?.conversationId,
    });
    try {
      socket.emit("sendMessage", {
        senderId: userInfo._id,
        receiverId: messagesConversations?.receiver?.id,
        message,
        conversationId: messagesConversations?.conversationId,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div
        className="w-3/4 
       my-7 mx-9"
      >
        <div className="bg-[#3872e9] text-white  rounded-[10px] h-20  flex justify-between items-center px-8">
          <div className="flex items-center">
            <img className="h-12" src={Logo} />
            <p className="font-bold ml-4">
              {messagesConversations?.receiver?.name}
            </p>
          </div>
          <div>
            <FaVideo className="w-6 h-6" />
          </div>
        </div>
        <div className="max-h-[70vh] rounded-[10px] overflow-y-scroll ">
          <div className="text-center p-5 mb-4 ">
            <p className="inline bg-[#3872e9] text-white rounded-[10px] p-2 text-lg">
              TODAY
            </p>
          </div>
          {messagesConversations?.message?.map((message, i) => (
            <div
              key={i}
              className={`w-96 rounded-[10px] border border-solid filter shadow-2xl p-5 mb-5  ${
                message?.user?.id !== messagesConversations?.receiver?.id &&
                "ml-auto bg-[#3872e9] text-white mr-4"
              }`}
            >
              {message.message}
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="relative w-full p-5 mt-4 rounded-2xl bg-white filter drop-shadow-2xl outline-none"
            value={message}
            onChange={handleInputMessageChange}
          />
          <IoMdSend
            onClick={handleClickMessage}
            className="absolute right-10 mt-4 text-3xl text-[#3872e9] w-12 cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
