import Robot from "../assets/robot.gif";
const Welcome = ({ userInfo }) => {
  return (
    <div
      className=" w-3/4 
       my-7 mx-9 rounded-[10px] border border-solid  p-8 filter shadow-2xl"
    >
      <div className="ml-7 flex flex-col items-center">
        <img className="w-96 h-96" src={Robot} alt="Robot Image" />
        <p className="mt-4 font-bold text-3xl">
          Welcome,{" "}
          <span className="text-[#3872e9] text-3xl">{userInfo.name}</span>
        </p>
        <p className="mt-4 font-bold ">
          Please Select a Chat to Start Messaging.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
