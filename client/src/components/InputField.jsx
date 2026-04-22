// components/InputField.jsx
import React from "react";

const InputField = ({ label, placeholder, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="text-sm text-gray-700 mb-1 block">{label}</label>
      <input
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;