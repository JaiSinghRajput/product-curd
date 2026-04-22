// components/LoginForm.jsx
import React, { useState } from "react";
import InputField from "./InputField";

const LoginForm = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.trim() || isLoading) return;
    onSubmit(email.trim());
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">
        Login to your Productr Account
      </h2>

      <InputField
        label="Email or Phone number"
        placeholder="Enter email or phone number"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-blue-900 text-white py-2 rounded-lg mt-4 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Sending OTP..." : "Login"}
      </button>
    </div>
  );
};

export default LoginForm;