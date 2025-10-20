/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("stanley@gmail.com");
  const [password, setPassword] = useState<string>("••••••••••");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const navigate = useNavigate();
  const handleSignIn = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Sign in with:", email);
    // Add your navigation logic here
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <div className="mb-12 flex items-center">
          <img
            src="Planeer-logo-Orange.jpg"
            alt="planeer logo"
            className="w-72 h-36 mr-2"
          />
        </div>
        <div className="px-8">
       
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-500 mb-8">
            Hey, welcome back to your special place
          </p>
          <div className="space-y-5">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent bg-gray-50"
                placeholder="stanley@gmail.com"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent bg-gray-50"
                placeholder="Password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                  style={{ accentColor: "#6366F1" }}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Forgot Password?
              </button>
            </div>

            <button
              onClick={(e: any) => handleSignIn(e)}
              className="bg-sky-700 text-white py-3 rounded-lg font-semibold hover:bg-sky-800 transition duration-200 shadow-md px-8"
            >
              Sign in
            </button>
          </div>
          <p className="text-center text-gray-600 mt-8">
            Don't have an account?{" "}
            <button className="text-sky-700 font-semibold hover:text-sky-800">
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 items-center justify-center relative overflow-hidden">
        {/* Decorative Clouds */}
        <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-12 left-16 w-24 h-16 bg-white rounded-full opacity-60"></div>

        <div className="absolute top-20 right-20 w-28 h-18 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-22 right-24 w-20 h-14 bg-white rounded-full opacity-60"></div>

        <div className="absolute bottom-20 left-16 w-36 h-22 bg-white rounded-full opacity-60"></div>
        <div className="absolute bottom-22 left-20 w-28 h-18 bg-white rounded-full opacity-60"></div>

        <div className="absolute bottom-32 right-12 w-32 h-20 bg-white rounded-full opacity-60"></div>
        <div className="absolute bottom-34 right-16 w-24 h-16 bg-white rounded-full opacity-60"></div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center">
          {/* Person Illustration */}
          <div className="relative">
            {/* Person holding phone */}
            <div className="relative z-20">
              {/* Head */}
              <div className="absolute -top-16 left-8 w-12 h-14 bg-amber-100 rounded-full"></div>
              <div className="absolute -top-20 left-6 w-16 h-12 bg-gray-800 rounded-t-full"></div>

              {/* Body - Yellow Jacket */}
              <div className="absolute -top-8 left-2 w-24 h-20 bg-yellow-400 rounded-2xl">
                {/* Jacket stripes */}
                <div className="absolute top-2 right-2 w-1 h-16 bg-gray-800"></div>
                <div className="absolute top-2 left-2 w-1 h-16 bg-gray-800"></div>
              </div>

              {/* Backpack */}
              <div className="absolute -top-6 -left-4 w-10 h-16 bg-gray-800 rounded-lg"></div>

              {/* Arms */}
              <div className="absolute top-2 left-24 w-12 h-3 bg-yellow-400 rounded-full transform rotate-12"></div>
              <div className="absolute top-8 left-28 w-8 h-3 bg-amber-100 rounded-full transform rotate-45"></div>

              {/* Pants - White */}
              <div className="absolute top-12 left-4 w-20 h-20 bg-white rounded-t-lg">
                <div className="absolute bottom-0 left-2 w-7 h-12 bg-white rounded-b-lg"></div>
                <div className="absolute bottom-0 right-2 w-7 h-12 bg-white rounded-b-lg"></div>
              </div>

              {/* Shoes */}
              <div className="absolute top-32 left-4 w-9 h-4 bg-gray-800 rounded-full"></div>
              <div className="absolute top-32 left-14 w-9 h-4 bg-gray-800 rounded-full"></div>
            </div>

            {/* Large Phone/Device */}
            <div className="absolute -top-4 left-32 w-48 h-72 bg-gray-800 rounded-3xl shadow-2xl p-2 transform -rotate-6">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl relative overflow-hidden">
                {/* Phone notch */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-full"></div>

                {/* Settings icon */}
                <div className="absolute top-6 right-4 w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 border border-white rounded-full"></div>
                </div>

                {/* Menu lines */}
                <div className="absolute top-6 right-12 space-y-1">
                  <div className="w-6 h-0.5 bg-white"></div>
                  <div className="w-6 h-0.5 bg-white"></div>
                  <div className="w-6 h-0.5 bg-white"></div>
                </div>

                {/* Fingerprint */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                    <ellipse
                      cx="50"
                      cy="50"
                      rx="30"
                      ry="35"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <ellipse
                      cx="50"
                      cy="50"
                      rx="22"
                      ry="27"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <ellipse
                      cx="50"
                      cy="50"
                      rx="14"
                      ry="19"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <ellipse
                      cx="50"
                      cy="50"
                      rx="6"
                      ry="11"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  {/* Scanning arc */}
                  <div className="absolute top-8 left-2 w-20 h-20 border-4 border-white rounded-full border-t-transparent border-l-transparent transform rotate-45"></div>
                </div>

                {/* Text at bottom */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="text-white text-xs">Please tap your finger</p>
                  <p className="text-white text-xs">to your phone</p>
                </div>
              </div>
            </div>

            {/* Checkmark Circle */}
            <div className="absolute -top-24 left-56 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
              <svg
                className="w-12 h-12 text-purple-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Lock Icon */}
            <div className="absolute top-24 right-4 w-24 h-28 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-4">
              <div className="w-10 h-6 border-4 border-sky-700 rounded-t-full"></div>
              <div className="w-16 h-16 bg-sky-700 rounded-lg flex items-center justify-center -mt-1">
                <div className="w-3 h-6 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
