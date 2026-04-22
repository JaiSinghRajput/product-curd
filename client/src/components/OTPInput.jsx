// components/OTPInput.jsx
import React from "react";

const OTPInput = ({ length = 6, otp, setOtp }) => {
  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <div className="flex gap-3 justify-center mb-6">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          maxLength={1}
          value={otp[i] || ""}
          onChange={(e) => handleChange(e.target.value, i)}
          className="w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
};

export default OTPInput;