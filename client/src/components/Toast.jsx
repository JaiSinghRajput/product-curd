// components/Toast.jsx
const Toast = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-lg border rounded-xl px-4 py-3 flex items-center gap-3 z-50 min-w-75">
      
      {/* Icon */}
      <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
        ✓
      </div>

      {/* Message */}
      <p className="text-sm text-gray-700 flex-1">
        {message}
      </p>

      {/* Close */}
      <button onClick={onClose} className="text-gray-500">
        ✕
      </button>
    </div>
  );
};

export default Toast;