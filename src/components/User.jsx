import Logo from "../assets/Ellipse.png";

const User = ({ user }) => {
  console.log("components", user);
  return (
    <div className=" flex justify-between items-center pt-12 pr-4 cursor-pointer">
      <div className="flex">
        <img className="h-12" src={Logo} />
        <div className="flex flex-col ml-3">
          <p className="font-bold">{user.user.name}</p>
          <p className="font-thin text-sm ">{user.user.message}</p>
        </div>
      </div>
      <div>
        <div
          className={`w-3 h-3 rounded-full ${
            user.user.online ? `bg-green-500` : `bg-red-500`
          } `}
        ></div>
      </div>
    </div>
  );
};

export default User;
