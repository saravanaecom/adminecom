import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { loginUser } from '../services/AdminCommanFuncation';
import AdminLogo from '../assets/logo.png';
import Imageside from '../assets/imagedesign.png';
import UserLogo from '../assets/user.png';
import PasswordLogo from '../assets/password.png';
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel";

const Login = () => {
  const { setIsAuthenticated } = useAuth();
  const [loginData, setLoginData] = useState({
    Username: '',
    Password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); // Unified modal message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setErrors({});
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validate = () => {
    let tempErrors = {};
    if (!loginData.Username) {
      tempErrors.Username = "Username is required";
    }
    if (!loginData.Password) {
      tempErrors.Password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const closeModal = () => {
    setIsErrorModalOpen(false);
    setIsSuccessModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await loginUser(loginData.Username, loginData.Password);

      if (!response.ok) {
        setModalMessage("Invalid Username or Password");
        setIsErrorModalOpen(true);
        throw new Error("Invalid Username or Password");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        // Save user details in localStorage
        localStorage.setItem("userLogin", "true");
        localStorage.setItem("adminuserid", data[0].Id);
        localStorage.setItem("adminusername", data[0].Username);
        localStorage.setItem("FireBaseId", data[0].CName);

        setIsAuthenticated(true);
        setModalMessage("Login successful! Redirecting...");
        setIsSuccessModalOpen(true);

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/index");
        }, 2000);
      } else {
        throw new Error("Invalid response data.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setModalMessage(error.message || "An error occurred during login.");
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-6xl h-[90vh] flex">
        <div className="w-1/2  bg-gradient-to-br from-[#0166ff] via-[#0166ff] to-white text-white p-10 flex flex-col justify-center relative">
          <div>
            <h2 className="text-3xl font-bold mb-4">Simplify management With Our dashboard.</h2>
            <p className="text-sm mb-6">
              Simplify your e-commerce management with our user-friendly admin dashboard.
            </p>
            <img
              src={Imageside}
              alt="Illustration"
              className="w-full h-72 object-contain"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <div className="text-center mb-9">
            <img src={AdminLogo} alt="Admin Logo" className="w-72 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Please login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <img src={UserLogo} alt="Username Icon" className="absolute w-5 left-3 top-3.5" />
              <input
                type="text"
                name="Username"
                value={loginData.Username}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
              {errors.Username && <p className="text-sm text-red-500 mt-1">{errors.Username}</p>}
            </div>

            <div className="relative">
              <img src={PasswordLogo} alt="Password Icon" className="absolute w-5 left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="Password"
                value={loginData.Password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleClickShowPassword}
                className="absolute right-3 top-3 text-sm text-gray-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {errors.Password && <p className="text-sm text-red-500 mt-1">{errors.Password}</p>}
            </div>

          
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Modals */}
      {isErrorModalOpen && <ErrorModal message={modalMessage} onClose={closeModal} />}
      {isSuccessModalOpen && <SuccessModal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default Login;
