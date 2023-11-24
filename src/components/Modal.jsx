/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:5000/api";

const Modal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;
  const [search, setSearch] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleSearchChange = async (item) => {
    if (item === "") {
      return setSearch([]);
    }
    const res = await fetch(`${BASE_URL}/users?search=${item}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resData = await res.json();

    setSearch(resData);
  };

  const handleClickFriend = async (friendId) => {
    console.log(friendId);
    try {
      const res = await axios.post(`${BASE_URL}/conversation`, {
        senderId: userInfo._id,
        receiverId: friendId,
      });
      console.log(res);
      toast.success("friend request sent successfully");
    } catch (error) {
      toast.error("error");
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[600px] flex flex-col">
        <div className="relative bg-white p-2 rounded">
          <button
            className="absolute right-5 text-black text-xl place-self-end"
            onClick={() => onClose()}
          >
            X
          </button>
          <div className="py-6 px-6 lg:px8 text-left">
            <h3 className="mb-4 text-xl font-medium text-gray-900">
              Add Friend
            </h3>
            <form className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Friend Code
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="#"
                  required
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </form>
            {search.map((user) => (
              <>
                <div
                  onClick={() => handleClickFriend(user._id)}
                  className="h-6 flex justify-between items-center mt-10 cursor-pointer"
                >
                  <div className="flex ">
                    <img
                      className="h-12 rounded-full"
                      src={"https://material-ui.com/static/images/avatar/1.jpg"}
                      alt="lupi"
                    />
                    <div className="flex flex-col ml-3">
                      <p className="font-bold">{user.name}</p>
                      <p className="font-thin ">{user.userId}</p>
                    </div>
                  </div>
                  <div>Online </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
