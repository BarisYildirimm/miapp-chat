/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { FaVideo } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import Logo from "../assets/Ellipse.png";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import Picker from "emoji-picker-react";

const BASE_URL = "http://localhost:5000/api";

const Chat = ({ messagesConversations, coords }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  console.log(messagesConversations);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  const onEmojiClick = (emojiObject) => {
    console.log("onEmojiClick", emojiObject);
    setMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleClickMessage = async (location) => {
    console.log("handleClickMessage:", {
      senderId: userInfo._id,
      receiverId: messagesConversations?.receiver?.id,
      message: {
        message: message,
        location: location,
      },
      conversationId: messagesConversations?.conversationId,
    });
    try {
      socket.emit("sendMessage", {
        senderId: userInfo._id,
        receiverId: messagesConversations?.receiver?.id,
        message: {
          message: message,
          location: location,
        },
        conversationId: messagesConversations?.conversationId,
      });
      const res = await axios.post(`${BASE_URL}/messages`, {
        senderId: userInfo._id,
        receiverId: messagesConversations?.receiver?.id,
        message: {
          message: message,
          location: location,
        },
        conversationId: messagesConversations?.conversationId,
      });
      console.log(res.data);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="w-full
       p-8"
      >
        <div className="bg-[#568abb] text-white  rounded-[10px] h-20  flex justify-between items-center px-8">
          <div className="flex items-center">
            <img className="h-12" src={Logo} />
            <p className="font-bold ml-4">
              {messagesConversations?.receiver?.name}
            </p>
          </div>
          <div>
            <FaVideo className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
        <div className="max-h-[70vh] rounded-[10px] overflow-y-scroll ">
          <div className="text-center p-5 mb-4 ">
            <p className="inline bg-[#568abb] text-white rounded-[10px] p-2 text-lg">
              TODAY
            </p>
          </div>
          {messagesConversations?.message?.map((message, i) => (
            <div
              key={i}
              className={`w-96 rounded-[10px] border border-solid filter shadow-2xl p-5 mb-5  ${
                message?.user?.id !== messagesConversations?.receiver?.id &&
                "ml-auto bg-[#568abb] text-white mr-4"
              }`}
            >
              {message.message.message}
              {message.message.location !== "" && (
                <>
                  <br />
                  <a
                    href={message.message.location}
                    target="_blank"
                    rel="re noreferrer"
                    className="underline"
                  >
                    {message.message.location}
                  </a>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Type a message"
            className="relative w-full pl-12 py-4 mt-4 rounded-2xl bg-white filter drop-shadow-2xl outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IoMdSend
            onClick={() => handleClickMessage("")}
            className="absolute right-0 top-7 text-3xl text-[#3872e9] w-12 cursor-pointer"
          />
          <IoLocationSharp
            className="absolute right-12 top-7 text-3xl text-[#3872e9] w-12 cursor-pointer"
            onClick={() =>
              handleClickMessage(
                `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
              )
            }
          />
          <MdOutlineEmojiEmotions
            className="absolute top-7 text-3xl text-[#3872e9] w-12 cursor-pointer"
            onClick={() => setShowPicker((val) => !val)}
          />
          <div className="absolute -top-[435px]">
            {showPicker && <Picker onEmojiClick={onEmojiClick} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
