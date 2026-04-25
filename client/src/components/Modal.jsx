// components/Modal.jsx
const Modal = ({
  title,
  children,
  onClose,
  footer,
  bodyScrollable = true,
  panelClassName = "w-120",
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 p-4 overflow-y-auto">
      <div
        className={`mx-auto my-6 bg-white rounded-2xl shadow-lg overflow-hidden max-w-full ${panelClassName}`}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div
          className={`p-6 ${bodyScrollable ? "max-h-[70vh] overflow-y-auto" : ""}`}
        >
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