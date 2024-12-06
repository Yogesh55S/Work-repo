import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Component/providers/AuthContext";
import GoogleSignInButton from "../Component/GoogleSignInButton"; // Import the Google Sign-In button component

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleEmailLogin = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        login(response.data.user);
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else if (error.response?.status === 403) {
        setErrorMessage("Please verify your email before logging in.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <div className="w-full max-w-md bg-hover shadow-lg rounded-lg p-6 md:p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-button-primary mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-text text-sm mb-8">
          Login to your account to continue.
        </p>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white text-button-primary focus:outline-none focus:ring focus:ring-button-primary"
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-center text-red-600 text-sm mb-4">{errorMessage}</p>
        )}

        {/* Login Button */}
        <button
          onClick={handleEmailLogin}
          className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${
            isLoading ? "bg-opacity-70 cursor-not-allowed" : "bg-button-primary hover:bg-hover"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-sm text-text">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center">
          <GoogleSignInButton />
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-text mt-6">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-button-primary hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
