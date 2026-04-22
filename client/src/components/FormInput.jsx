// components/FormInput.jsx
const FormInput = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="text-sm text-gray-700 block mb-1">
        {label}
      </label>

      <input
        {...props}
        className={`w-full px-3 py-2 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;