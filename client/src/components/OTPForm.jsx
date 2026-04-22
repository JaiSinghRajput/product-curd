// components/OTPForm.jsx
import React, { useState } from "react";
import OTPInput from "./OTPInput";

const OTPForm = ({ onSubmit, onResend, isLoading = false }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleSubmit = () => {
    const code = otp.join("");
    if (code.length !== 6 || isLoading) return;
    onSubmit(code);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">
        Login to your Productr Account
      </h2>

      <p className="text-sm text-gray-600 mb-3">Enter OTP</p>

      <OTPInput otp={otp} setOtp={setOtp} />

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Verifying..." : "Enter your OTP"}
      </button>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Didn’t receive OTP ?{" "}
        <span className="text-blue-900 cursor-pointer" onClick={onResend}>
          Resend
        </span>
      </p>
    </div>
  );
};

export default OTPForm;