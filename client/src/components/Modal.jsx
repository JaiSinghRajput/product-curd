// components/Modal.jsx
const Modal = ({ title, children, onClose, footer }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-120 rounded-2xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t flex justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;