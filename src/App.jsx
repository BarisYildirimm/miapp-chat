import "./App.css";
import Logo from "./assets/Ellipse.png";
import { GoBell } from "react-icons/go";
import { FaVideo } from "react-icons/fa";
import User from "./components/User.jsx";
import { users } from "./users.js";

function App() {
  return (
    <div className="bg-[#EDEDED] w-full min-h-screen flex justify-evenly text-black">
      <div className=" w-1/4 my-7 ml-9 rounded-[10px] border border-solid  p-8 filter shadow-2xl">
        <div className="h-6 flex justify-between items-center mb-10">
          <div className="flex">
            <img className="h-12" src={Logo} />
            <div className="flex flex-col ml-3">
              <p className="font-bold">Saleha Jamshed</p>
              <p className="font-thin ">@saleha_123</p>
            </div>
          </div>
          <div>
            <GoBell className="w-6 h-6" />
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
      <div className="bg-[#3872e9] text-white my-7 mx-9 rounded-[10px] h-20 w- w-3/4 flex justify-between items-center px-8">
        <div className="flex items-center">
          <img className="h-12" src={Logo} />
          <p className="font-bold ml-4">Meera</p>
        </div>
        <div>
          <FaVideo className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default App;
