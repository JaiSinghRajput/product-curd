// components/Tabs.jsx
const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-6 border-b mb-6">
      {["Published", "Unpublished"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 text-sm font-medium ${
            activeTab === tab
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;