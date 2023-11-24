import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import maxcdn from "../assets/maxcdn.svg";

const BASE_URL = "http://localhost:5000/api/users";
const LoginScreen = () => {
  const [isSignup, setIsSignup] = useState(false);

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  };

  const navigate = useNavigate();

  const userInfo = localStorage.getItem("userInfo");

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/chats";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      if (isSignup) {
        const res = await axios.post(`${BASE_URL}/register`, {
          name: data.get("firstName"),
          email: data.get("email"),
          password: data.get("password"),
        });
        console.log(res.data);
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        navigate("/chats");
      } else {
        const res = await axios.post(`${BASE_URL}/auth`, {
          email: data.get("email"),
          password: data.get("password"),
        });
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        toast.success("Successfully logged in!");
        navigate("/chats");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-[#568abb]">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img className="w-8 h-8 mr-2 " src={maxcdn} alt="logo" />
            ia Chat
          </a>
          <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#568abb] filter drop-shadow-2xl dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {isSignup
                  ? "Sign in to your New account"
                  : "Sign in to your account"}
              </h1>
              <form onSubmit={submitHandler} className="space-y-4 md:space-y-6">
                {isSignup && (
                  <>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Firstname
                      </label>
                      <input
                        type="firstName"
                        name="firstName"
                        id="firstName"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="John "
                        required=""
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        lastName
                      </label>
                      <input
                        type="lastName"
                        name="lastName"
                        id="lastName"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Doe"
                        required=""
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@example.com"
                    required=""
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {isSignup ? "Sign Up" : "Sign In"}
                </button>
                <p className="text-sm font-light">
                  <p
                    onClick={switchMode}
                    className="font-medium text-white hover:underline  cursor-pointer"
                  >
                    {isSignup
                      ? "Already have an Account? Sign In"
                      : "Don't have an account? Sign Up"}
                  </p>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginScreen;
