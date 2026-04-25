// components/AuthLayout.jsx
import React from "react";
import sidebarImage from "../assets/SideBar.png";

const AuthLayout = ({ children, footer }) => {
  return (
    <div className="h-dvh flex bg-[#f3f4f6] overflow-hidden">
      {/* Left Section */}
      <div className="w-1/2 rounded-3xl overflow-hidden m-8 smooth-rise-in">
        <img 
          src={sidebarImage} 
          alt="Sidebar" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-between items-center pt-30 px-6 pb-20 smooth-rise-in">
        <div className="w-100 transition-all duration-300">
          <div className="w-100">{children}</div>
        </div>
        {footer && <div className="w-100">{footer}</div>}
      </div>
    </div>
  );
};

export default AuthLayout;