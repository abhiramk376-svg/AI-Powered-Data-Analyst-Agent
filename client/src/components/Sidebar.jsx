import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  MessageSquare,
  History,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const avatarColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-fuchsia-500",
  "bg-teal-500",
];

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const Sidebar = ({ onNewAnalysis, sessionId, messages }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userMessages = messages.filter((m) => m.role === "user");
  const hasSession = !!sessionId;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="flex flex-col h-full w-[280px] p-2 bg-surface border-r border-outline-variant z-20 overflow-y-auto custom-scrollbar flex-shrink-0">
      <div className="px-4 py-6 mb-4">
        <h1 className="font-body text-headline-md font-bold text-primary">
          Data Analyst AI
        </h1>
        <p className="text-on-surface-variant font-label-md text-label-md">
          Insight Engine
        </p>
      </div>

      <button
        onClick={onNewAnalysis}
        className="mx-4 mb-8 bg-primary text-on-primary py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 cursor-pointer"
      >
        <Plus size={20} strokeWidth={1.5} />
        <span className="font-label-md">New Analysis</span>
      </button>

      <div className="flex flex-col gap-6 px-4 pb-20">
        <nav className="flex flex-col gap-2">
          <a
            href="#"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              hasSession
                ? "bg-surface-container text-on-surface"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <MessageSquare size={16} strokeWidth={1.5} />
            <span className="text-sm font-medium">Active Analysis</span>
            {hasSession && (
              <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />
            )}
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-on-surface-variant hover:bg-surface-container-low"
          >
            <History size={16} strokeWidth={1.5} />
            <span className="text-sm font-medium">History</span>
            <span className="ml-auto text-[10px] text-on-surface-variant">
              {userMessages.length}
            </span>
          </a>
        </nav>

        {hasSession && userMessages.length > 0 && (
          <div className="border-t border-outline-variant/50 pt-4">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold mb-2 px-3">
              Recent Queries
            </p>
            <div className="flex flex-col gap-1">
              {userMessages
                .slice(-3)
                .reverse()
                .map((msg, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 text-xs text-on-surface-variant truncate rounded hover:bg-surface-container-low transition-colors"
                  >
                    {msg.content.length > 40
                      ? msg.content.slice(0, 40) + "..."
                      : msg.content}
                  </div>
                ))}
            </div>
          </div>
        )}

        {hasSession && (
          <div className="px-3">
            <div className="flex items-center gap-2 text-[11px] text-green-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Dataset loaded
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-outline-variant pt-2 pb-4 px-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-full ${getAvatarColor(user?.fullName)} flex items-center justify-center flex-shrink-0 overflow-hidden border border-outline-variant text-white text-sm font-semibold`}
            >
              {getInitials(user?.fullName)}
            </div>
            <div className="flex flex-col overflow-hidden text-left flex-1 min-w-0">
              <span className="text-sm font-semibold text-on-surface truncate">
                {user?.fullName || "User"}
              </span>
              <span className="text-[10px] text-on-surface-variant truncate">
                Data Analyst
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-on-surface-variant transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-full left-2 right-2 mb-1 bg-surface-container-high rounded-xl shadow-xl border border-outline-variant overflow-hidden">
              <button
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <Settings size={16} className="text-on-surface-variant" />
                <Link to="/settings" className="w-full">
                  <span>Settings</span>
                </Link>
              </button>
              <button
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <HelpCircle size={16} className="text-on-surface-variant" />
                <Link to="/help" className="w-full">
                  <span>Help</span>
                </Link>
              </button>
              <div className="border-t border-outline-variant/50" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-surface-container transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
