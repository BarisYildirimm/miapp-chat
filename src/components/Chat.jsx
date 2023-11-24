/* eslint-disable react/no-unescaped-entities */
import { FaVideo } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import Logo from "../assets/Ellipse.png";

const Chat = () => {
  
  return (
    <>
      <div
        className="w-3/4 
       my-7 mx-9"
      >
        <div className="bg-[#3872e9] text-white  rounded-[10px] h-20  flex justify-between items-center px-8">
          <div className="flex items-center">
            <img className="h-12" src={Logo} />
            <p className="font-bold ml-4">Meera</p>
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
          <div className="w-96 rounded-[10px] border border-solid filter shadow-2xl p-5 mb-5 ">
            Awesome! 🍨 I love chocolate chip cookie dough. Looking forward....
          </div>
          <div className="w-96 rounded-[10px] border border-solid filter shadow-2xl p-5 mb-5 ml-auto bg-[#3872e9] text-white ">
            Sounds delicious, Meera! 🤩 Can't wait for Saturday! By the way, do
            you think we should get some ice cream for dessert?"
          </div>
          <div className="w-96 rounded-[10px] border border-solid filter shadow-2xl p-5 mb-5 ml-auto bg-[#3872e9] text-white ">
            Sounds delicious, Meera! 🤩 Can't wait for Saturday! By the way, do
            you think we should get some ice cream for dessert?"
          </div>
          <div className="w-96 rounded-[10px] border border-solid filter shadow-2xl p-5 mb-5 ml-auto bg-[#3872e9] text-white ">
            Sounds delicious, Meera! 🤩 Can't wait for Saturday! By the way, do
            you think we should get some ice cream for dessert?"
          </div>
          <div className="w-96 rounded-[10px] border border-solid filter shadow-2xl p-5 mb-5 ml-auto bg-[#3872e9] text-white ">
            Sounds delicious, Meera! 🤩 Can't wait for Saturday! By the way, do
            you think we should get some ice cream for dessert?"
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="relative w-full p-5 mt-4 rounded-2xl bg-white filter drop-shadow-2xl outline-none"
          />
          <IoMdSend className="absolute right-10 mt-4 text-3xl text-[#3872e9] w-12 cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default Chat;
