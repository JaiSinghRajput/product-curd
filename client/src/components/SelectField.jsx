// components/SelectField.jsx
import { useState } from "react";

const SelectField = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 relative">
      <label className="text-sm text-gray-700 block mb-1">
        {label}
      </label>

      <div
        onClick={() => setOpen(!open)}
        className="border rounded-lg px-3 py-2 cursor-pointer bg-white"
      >
        {value || "Select product type"}
      </div>

      {open && (
        <div className="absolute w-full bg-white border rounded-lg mt-1 shadow z-10">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectField;