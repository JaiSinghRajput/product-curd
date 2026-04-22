// layouts/DashboardLayout.jsx
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;