// components/OTPInput.jsx
import React, { useRef } from "react";

const OTPInput = ({ length = 6, otp, setOtp, onEnter }) => {
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    const numericValue = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    if (numericValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter?.();
      return;
    }

    if (e.key !== "Backspace" && e.key !== "Delete") return;

    e.preventDefault();
    const newOtp = [...otp];
    newOtp[index] = "";
    setOtp(newOtp);

    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text") || "";
    const pastedDigits = pastedText.replace(/\D/g, "");

    if (!pastedDigits) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedDigits.length && index + i < length; i += 1) {
      newOtp[index + i] = pastedDigits[i];
    }
    setOtp(newOtp);

    const nextFocusIndex = Math.min(index + pastedDigits.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center mb-6">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          maxLength={1}
          value={otp[i] || ""}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          inputMode="numeric"
          autoComplete="one-time-code"
          className="w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
};

export default OTPInput;