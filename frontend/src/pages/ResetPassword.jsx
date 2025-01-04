import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const ResetPassword = ({ backendUrl }) => {
  const { token } = useParams(); // Get the token from the URL
  const [newPassword, setNewPassword] = useState("");
  const {navigate} = useContext(ShopContext)

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
        token,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password reset successful!");
        navigate('/login')
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleResetPassword}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Reset Password</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      <input
        onChange={(e) => setNewPassword(e.target.value)}
        value={newPassword}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Enter your new password"
        required
      />
      <button className="bg-black text-white font-light px-8 py-2 mt-4 active:bg-gray-700">
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
