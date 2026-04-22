// pages/OTPPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import OTPForm from "../components/OTPForm";
import { useAuth } from "../hooks/useAuth";

const OTPPage = () => {
  const navigate = useNavigate();
  const { verifyOTP, sendOTP, otpContact, isLoading, error, clearError } = useAuth();

  const handleOTPSubmit = async (otp) => {
    const result = await verifyOTP(otpContact, otp);
    if (result.success) {
      navigate("/products");
    }
  };

  const handleResend = async () => {
    if (!otpContact) return;
    await sendOTP(otpContact);
  };

  return (
    <AuthLayout>
      {error && (
        <p className="text-sm text-red-600 mb-3" onClick={clearError}>
          {error}
        </p>
      )}
      <OTPForm
        onSubmit={handleOTPSubmit}
        onResend={handleResend}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
};

export default OTPPage;