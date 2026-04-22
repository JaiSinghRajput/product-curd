// components/Header.jsx
const Header = () => {
  return (
    <div className="h-16 flex items-center justify-end px-6 bg-linear-to-r from-pink-100 to-blue-100">
      <div className="flex items-center gap-2">
        <img
          src="https://i.pravatar.cc/40"
          className="w-8 h-8 rounded-full"
        />
        <span>▼</span>
      </div>
    </div>
  );
};

export default Header;