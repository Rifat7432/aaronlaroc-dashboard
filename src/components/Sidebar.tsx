import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import React from "react";

interface MenuItem {
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { label: "Overview", path: "/" },
    { label: "Support", path: "/support" },
    { label: "All Users", path: "/users" },
    { label: "Analytics", path: "/analytics" },
    { label: "Reports", path: "/reports" },
    { label: "Corporate", path: "/corporate" },
  ];
  const handleSignOut = (): void => {
    // Add your navigation logic here

    localStorage.removeItem("isAuthenticated");

    navigate("/login");
  };
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-48 bg-white flex flex-col rounded-tl-lg">
      {/* Logo */}
      <div className="p-6 max-h-20">
        <div className="flex items-center gap-2">
          <img
            src="Planeer-logo-Orange.jpg"
            alt="planeer logo"
            className="w-40 h-20 mr-2"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              isActive(item.path)
                ? "bg-sky-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
        >
          <LogOut size={20} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
