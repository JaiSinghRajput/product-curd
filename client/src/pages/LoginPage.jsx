// pages/LoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { sendOTP, isLoading, error, clearError } = useAuth();

  const handleLogin = async (emailOrPhone) => {
    const result = await sendOTP(emailOrPhone);
    if (result.success) {
      navigate("/otp");
    }
  };

  const signupFooter = (
    <div className="text-center border rounded-xl p-4 bg-gray-50">
      <p className="text-gray-500 text-sm">
        Don't have a Productr Account
      </p>
      <button className="text-blue-900 font-semibold">
        SignUp Here
      </button>
    </div>
  );

  return (
    <AuthLayout footer={signupFooter}>
      {error && (
        <p className="text-sm text-red-600 mb-3" onClick={clearError}>
          {error}
        </p>
      )}
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </AuthLayout>
  );
};

export default LoginPage;