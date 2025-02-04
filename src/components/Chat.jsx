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
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [messages, setMessages] = useState(messagesConversations?.message || []);
  const [socket, setSocket] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Socket bağlantısını oluştur
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Gelen mesajları dinle
  useEffect(() => {
    if (!socket) return;

    socket.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);  // Yeni mesaj geldiğinde state güncelle
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket]);

  // Emoji seçildiğinde mesaj kutusuna ekle
  const onEmojiClick = (emojiObject) => {
    setMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  // Mesaj gönderme işlemi
  const handleClickMessage = async (location) => {
    if (!message.trim() && !location) return; // Boş mesaj engellendi

    const newMessage = {
      senderId: userInfo._id,
      receiverId: messagesConversations?.receiver?.id,
      message: { message, location },
      conversationId: messagesConversations?.conversationId,
    };

    try {
      socket.emit("sendMessage", newMessage);
      await axios.post(`${BASE_URL}/messages`, newMessage);

      setMessages((prev) => [...prev, newMessage]);  // Mesajı listeye ekle
      setMessage("");  // Mesaj kutusunu temizle
    } catch (error) {
      console.error("Mesaj gönderme hatası:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white shadow-xl rounded-lg p-6">
      {/* Üst Panel (Kullanıcı Bilgisi) */}
      <div className="bg-[#568abb] text-white rounded-lg h-20 flex justify-between items-center px-8 shadow-md">
        <div className="flex items-center">
          <img className="h-12 w-12 rounded-full" src={Logo} alt="Chat Logo" />
          <p className="font-bold ml-4">
            {messagesConversations?.receiver?.name || "Unknown"}
          </p>
        </div>
        <FaVideo className="w-6 h-6 cursor-pointer" />
      </div>

      {/* Mesaj Gösterme Alanı */}
      <div className="flex-1 overflow-y-auto p-4 mt-2 rounded-lg border">
        <div className="text-center mb-4">
          <p className="inline bg-[#568abb] text-white rounded-lg p-2 text-lg">TODAY</p>
        </div>

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg?.senderId === userInfo._id ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`w-auto max-w-[75%] px-4 py-3 mb-3 rounded-lg shadow-md ${
                msg?.senderId === userInfo._id
                  ? "bg-gray-200 text-black" // Senin attığın mesaj SOLDA (Gri)
                  : "bg-[#568abb] text-white" // Karşı tarafın attığı mesaj SAĞDA (Mavi)
              }`}
            >
              {msg.message.message}
              {msg.message.location && (
                <div className="mt-2">
                  <a
                    href={msg.message.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600"
                  >
                    📍 Konumu Görüntüle
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mesaj Gönderme Alanı */}
      <div className="relative mt-2">
        <input
          type="text"
          placeholder="Bir mesaj yaz..."
          className="w-full pl-12 pr-16 py-4 rounded-full bg-gray-100 shadow-md outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IoMdSend
          onClick={() => handleClickMessage("")}
          className="absolute right-4 top-5 text-2xl text-[#3872e9] cursor-pointer"
        />
        {coords?.latitude && coords?.longitude && (
          <IoLocationSharp
            className="absolute right-14 top-5 text-2xl text-[#3872e9] cursor-pointer"
            onClick={() =>
              handleClickMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
            }
          />
        )}
        <MdOutlineEmojiEmotions
          className="absolute left-4 top-5 text-2xl text-[#3872e9] cursor-pointer"
          onClick={() => setShowPicker((val) => !val)}
        />
        {showPicker && (
          <div className="absolute bottom-16 left-4 z-10">
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
