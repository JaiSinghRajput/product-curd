// components/EmptyState.jsx
const EmptyState = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="text-5xl mb-4">⬜➕</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
};

export default EmptyState;