import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Logo from "../assets/Ellipse.png";

const socket = io("http://localhost:5000");

const User = ({ user }) => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    socket.emit("addUser", user.user.id); // Kullanıcı giriş yaptığında sunucuya bildir

    socket.on("getUsers", (users) => {
      console.log("Aktif Kullanıcılar:", users);
      setActiveUsers(users);
    });

    return () => {
      socket.off("getUsers");
    };
  }, [user]);

  const isOnline = activeUsers.some((u) => u.userId === user.user.id);

  return (
    <div className="flex justify-between items-center pt-12 pr-4 cursor-pointer">
      <div className="flex">
        <img className="h-12" src={Logo} alt="User Avatar" />
        <div className="flex flex-col ml-3">
          <p className="font-bold">{user.user.name}</p>
          <p className="font-thin text-sm">{user.user.email}</p>
        </div>
      </div>
      <div>
        <div
          className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
        ></div>
      </div>
    </div>
  );
};

export default User;
