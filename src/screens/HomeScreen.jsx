import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Logo from "../assets/Ellipse.png";
import { BiLogOutCircle } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import User from "../components/User.jsx";
import Chat from "../components/Chat.jsx";
import Modal from "../components/Modal.jsx";
import Welcome from "../components/Welcome.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:5000";

const HomeScreen = () => {
  const [socket, setSocket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [open, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [messagesConversations, setMessagesConversations] = useState(null);
  const [coords, setCoords] = useState({});

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          toast.error("Konum alınamadı!");
          console.error(error);
        }
      );
    } else {
      toast.error("Tarayıcınız konum hizmetlerini desteklemiyor.");
    }
  }, []);

  useEffect(() => {
    const newSocket = io(BASE_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("addUser", userInfo._id);
    socket.on("getUsers", (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.off("getUsers");
    };
  }, [socket, userInfo._id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("getMessage", (data) => {
      setMessagesConversations((prev) => {
        if (!prev || prev.conversationId !== data.conversationId) return prev;

        return {
          ...prev,
          message: [...prev.message, { user: data.user, message: data.message.message }],
        };
      });
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/conversation/${userInfo._id}`)
      .then((res) => setChats(res.data))
      .catch((err) => console.error(err));
  }, [userInfo._id]);

  const handleClickUserMessage = async (conId, user) => {
    axios.get(`${BASE_URL}/api/messages/${conId}`)
      .then((res) => {
        setMessagesConversations({
          message: res.data,
          receiver: user,
          conversationId: conId,
        });
      })
      .catch((err) => console.error(err));
  };

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/");
    toast.success("Çıkış başarılı!");
  };

  return (
    <Fragment>
      <div className="bg-[#EDEDED] w-full h-screen text-black flex flex-col lg:flex-row">
        {/* Sol Panel (Kullanıcı Listesi) */}
        <div className="lg:w-1/4 h-full p-6 my-4 mx-4 border rounded-lg shadow-xl bg-white flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex items-center cursor-pointer" onClick={() => setIsOpen(!open)}>
              <img className="h-12 w-12 rounded-full" src={Logo} alt="User Avatar" />
              <div className="ml-3">
                <p className="font-bold">{userInfo.name}</p>
                <p className="font-thin text-sm">{userInfo.userId}</p>
              </div>
            </div>
            {open && (
              <BiLogOutCircle className="text-4xl text-red-600 cursor-pointer" onClick={logoutHandler} />
            )}
            <IoIosAddCircleOutline className="text-3xl cursor-pointer" onClick={() => setShowModal(true)} />
          </div>

          <div className="font-bold mb-4">Mesajlar</div>
          <input
            type="text"
            placeholder="Sohbetleri ara..."
            className="w-full p-3 rounded-lg bg-gray-200 shadow-md outline-none"
          />
          <div className="flex-1 overflow-y-auto mt-3 border rounded-lg">
            {chats.length > 0 ? (
              chats.map((user) => (
                <div key={user.user.id} onClick={() => handleClickUserMessage(user.conversationId, user.user)}>
                  <User user={user} activeUsers={activeUsers} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">Sohbet bulunamadı</p>
            )}
          </div>
        </div>

        {/* Sağ Panel (Mesajlaşma Alanı) */}
        <div className="flex-1 h-full bg-white p-6 mx-4 border rounded-lg shadow-xl">
          {messagesConversations ? (
            <Chat messagesConversations={messagesConversations} coords={coords} />
          ) : (
            <Welcome userInfo={userInfo} />
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isVisible={showModal} onClose={() => setShowModal(false)} activeUsers={activeUsers} />
    </Fragment>
  );
};

export default HomeScreen;
