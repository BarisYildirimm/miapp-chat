import { Fragment, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Logo from "../assets/Ellipse.png";
import { BiLogOutCircle } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import User from "../components/User.jsx";
import Chat from "../components/Chat.jsx";
import { users } from "../users.js";
import Modal from "../components/Modal.jsx";
import Welcome from "../components/Welcome.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:5000";

const HomeScreen = () => {
  //   const [socket, setSocket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [open, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [messagesConversations, setMessagesConverstaions] = useState([]);

  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    setTimeout(() => {
      axios.get(`${BASE_URL}/api/conversation/${userInfo._id}`).then((res) => {
        setChats(res.data);
      });
    }, 1000);
  }, []);

  const handleClickUserMessage = async (conId, user) => {
    axios.get(`${BASE_URL}/api/messages/${conId}`).then((res) => {
      setMessagesConverstaions({
        message: res.data,
        receiver: user,
        conversationId: conId,
      });
    });
  };

  const logoutHandler = () => {
    try {
      localStorage.clear();
      navigate("/");
      toast.success("logout successful!");
    } catch (error) {
      toast.error("logout failed");
      console.log(error);
    }
  };
  return (
    <Fragment>
      <div className="bg-[#EDEDED] w-full min-h-screen flex  text-black ">
        <div className=" my-7 ml-9 rounded-[10px] border border-solid  p-8 filter shadow-2xl">
          <div className="h-6 flex justify-between items-center mb-10">
            <div
              className="relative flex cursor-pointer"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <img className="h-12" src={Logo} alt="lupi" />
              <div className="flex flex-col ml-3">
                <p className="font-bold">{userInfo.name}</p>
                <p className="font-thin ">{userInfo.userId}</p>
              </div>
            </div>
            {open && (
              <div className="top-24 p-3 rounded-full text-4xl text-red-600 cursor-pointer">
                <BiLogOutCircle onClick={logoutHandler} />
              </div>
            )}
            <div>
              <IoIosAddCircleOutline
                onClick={() => setShowModal(true)}
                className="w-9 h-9 cursor-pointer"
              />
            </div>
          </div>
          <div className="font-bold mb-6">Messages</div>
          <form>
            <div>
              <input
                type="text"
                placeholder="Search chats"
                className="w-full p-3 rounded-2xl bg-gray-300  filter drop-shadow-2xl  outline-none"
              />
            </div>
          </form>
          <div className="w-full h-[405px] border overflow-scroll ">
            {chats?.map((user) => (
              <div
                key={user.id}
                onClick={() =>
                  handleClickUserMessage(user.conversationId, user.user)
                }
              >
                <User user={user} />
              </div>
            ))}
          </div>
        </div>
        {messagesConversations?.conversationId ? (
          <Chat messagesConversations={messagesConversations} />
        ) : (
          <Welcome userInfo={userInfo} />
        )}
      </div>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
    </Fragment>
  );
};

export default HomeScreen;
