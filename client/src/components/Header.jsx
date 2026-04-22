// components/Header.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { user } = useAuth();
  const avatar = user?.profileImage;
  const initials = (user?.name || user?.email || user?.phone || "P")
    .slice(0, 1)
    .toUpperCase();

  return (
    <div className="h-16 flex items-center justify-end px-6 bg-linear-to-r from-pink-100 to-blue-100">
      <Link
        to="/profile"
        title="Profile"
        aria-label="Open profile"
        className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:scale-105 hover:bg-white"
      >
        <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700 ring-2 ring-transparent group-hover:ring-slate-300">
          {avatar ? (
            <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
      </Link>
    </div>
  );
};

export default Header;