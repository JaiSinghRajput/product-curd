// components/Sidebar.jsx
import { Home, Box } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-linear-to-b from-[#0f172a] to-[#1e293b] text-white p-4">
      <h1 className="text-xl font-bold mb-6">Productr</h1>

      <input
        placeholder="Search"
        className="w-full mb-6 px-3 py-2 rounded bg-gray-700 text-sm outline-none"
      />

      <nav className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Home size={18} /> Home
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Box size={18} /> Products
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;