import { Fragment, useState } from "react";
import "./App.css";
import Logo from "./assets/Ellipse.png";
import { BiLogOutCircle } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import User from "./components/User.jsx";
import Chat from "./components/Chat.jsx";
import { users } from "./users.js";
import Modal from "./components/Modal.jsx";
import Welcome from "./components/Welcome.jsx";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [open, setIsOpen] = useState(false);
  const [login] = useState(true);
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
                <p className="font-bold">Saleha Jamshed</p>
                <p className="font-thin ">@saleha_123</p>
              </div>
            </div>
            {open && (
              <div className="top-24 p-3 rounded-full text-4xl text-red-600 cursor-pointer">
                <BiLogOutCircle />
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
          <div className="w-full h-[405px] border overflow-scroll">
            {users.map((user) => (
              <User key={user.id} user={user} />
            ))}
          </div>
        </div>
        {login ? <Welcome /> : <Chat />}
      </div>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
    </Fragment>
  );
}

export default App;
