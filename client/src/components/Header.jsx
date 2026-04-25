// components/Header.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const avatar = user?.profileImage;
  const initials = (user?.name || user?.email || user?.phone || "P")
    .slice(0, 1)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="h-16 flex items-center justify-end px-6 bg-linear-to-r from-pink-100 to-blue-100">
      <div className="group relative">
        <Link
          to="/profile"
          title="Profile"
          aria-label="Open profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:scale-105 hover:bg-white"
        >
          <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700 ring-2 ring-transparent group-hover:ring-slate-300">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
        </Link>

        <div className="pointer-events-none absolute right-0 top-full z-20 pt-2 opacity-0 translate-y-1 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0">
          <div className="min-w-36 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;