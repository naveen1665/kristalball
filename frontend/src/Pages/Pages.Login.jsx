import React, { useContext, useState } from 'react';
import image from '../assets/login.jpg';
import { BackendClient } from '../AxiosClient/BackendClient';
import { useNavigate } from 'react-router-dom'
import LoginFailed from '../Components/Component.LoginFailed';
import { authContext } from '../Context/AuthContext';

function Login() {

  const [user_name, setUser_name] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("logistic");
  const [error,setError]=useState(false);
  const [message,setMessage]=useState("");
  const navigate = useNavigate();
  console.log(user_name);
  console.log(password);
  console.log(role);

  const authFuntion = async (e) => {
  e.preventDefault();
  try {
    console.log("API triggered");

    

    const res = await BackendClient.post("/login", { 
      user_name, 
      user_pass:password, 
      user_role: role   
    });

    if (res.status === 200) {
      setMessage("Login Successful");
      navigate('#');
      console.log(res);

      localStorage.setItem("user_name", res.data.data.user_name);
      localStorage.setItem("role", res.data.data.role);
    }
  } catch (e) {
    setMessage("Invalid Credential. Please try again");
    console.error("Login error:", e);
    setError(true);
  }
};

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      {/* Left Side: Hero Image with Overlay */}
      <div
        className="hidden md:flex md:w-1/2 relative items-center justify-center"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Deep navy base overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 opacity-80"></div>
        {/* Soft warm tint */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/20 to-transparent pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-20 max-w-lg text">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
            Welcome to <br />
            <span className="text-orange-200 drop-shadow-lg">Military Management</span>
          </h1>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6 sm:px-10 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo / Brand */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-800">
              <span className="text-rose-600 text-5xl">M</span>ilitary
              <span className="text-orange-500 text-5xl"> M</span>anagement
            </h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your Inventory hub</p>
          </div>

          {/* Form */}
          <form className="space-y-6 mt-6">
            {/* User Role Selection */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                I am a:
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    id="LogisticOfficer"
                    type="radio"
                    name="role"
                    defaultChecked
                    onChange={() => { setRole("logisticOfficer") }}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                  />
                  <label htmlFor="student" className="ml-2 block text-sm text-gray-700">
                    Logistic Officer
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="commander"
                    type="radio"
                    name="role"
                    onChange={() => { setRole("commander") }}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                  />
                  <label htmlFor="commander" className="ml-2 block text-sm text-gray-700">
                    Commander
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="admin"
                    type="radio"
                    name="role"
                    onChange={() => { setRole("admin") }}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                  />
                  <label htmlFor="admin" className="ml-2 block text-sm text-gray-700">
                    Admin
                  </label>
                </div>
              </div>
            </div>

            {/* Username Field */}
            <div className="flex flex-col">
              <label htmlFor="user_name" className="text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                id="user_name"
                type="text"
                required
                onChange={(e) => { setUser_name(e.target.value) }}
                className="w-full px-4 py-3 bg-white border-0 border-b-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 transition duration-200 ease-in-out"
                placeholder="Enter your username"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-rose-600 hover:text-rose-800 font-medium">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                required
                onChange={(e) => { setPassword(e.target.value) }}
                className="w-full px-4 py-3 bg-white border-0 border-b-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 transition duration-200 ease-in-out"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={authFuntion}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:from-rose-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-rose-300 transform transition hover:scale-[1.02] duration-200"
            >
              Log In
            </button>
          </form>
          {error && <LoginFailed duration={3000} text={message} onClose={() => setError(false)} />}
          <p className="mt-8 text-xs text-center text-gray-400">
            Secure login • Your data stays private
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
