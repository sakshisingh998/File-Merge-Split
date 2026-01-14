// src/components/Sidebar.jsx - SaaS Sidebar Navigation
import React from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  Image, 
  Lock, 
  ChevronRight
} from "lucide-react";

function Sidebar({ currentModule, onModuleChange, theme }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pdf-tools", label: "PDF Tools", icon: FileText },
    { id: "ai-tools", label: "AI Tools", icon: Sparkles },
    { id: "convert", label: "Convert", icon: Image },
    { id: "security", label: "Security", icon: Lock },
  ];

  const themeColors = theme === "dark" 
    ? {
        bg: "#1F1515",
        text: "#FAF7F5",
        hover: "#2B1D1D",
        active: "#E0B089",
        border: "#3F2E2E",
      }
    : {
        bg: "#3F2E2E",
        text: "#FAF7F5",
        hover: "#4A3A3A",
        active: "#E0B089",
        border: "#4A3A3A",
      };

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 z-40 transition-all duration-300"
      style={{
        backgroundColor: themeColors.bg,
        borderRight: `1px solid ${themeColors.border}`,
      }}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b" style={{ borderColor: themeColors.border }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: themeColors.active }}>
            <FileText size={18} className="text-white" />
          </div>
          <span className="font-semibold text-lg" style={{ color: themeColors.text }}>
            PDF Suite
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-1 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          const isComingSoon = item.comingSoon;

          return (
            <button
              key={item.id}
              onClick={() => !isComingSoon && onModuleChange(item.id)}
              disabled={isComingSoon}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                isComingSoon ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
              }`}
              style={{
                backgroundColor: isActive ? themeColors.active : "transparent",
                color: isActive ? "#FFFFFF" : themeColors.text,
              }}
              onMouseEnter={(e) => {
                if (!isActive && !isComingSoon) {
                  e.currentTarget.style.backgroundColor = themeColors.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isComingSoon && (
                <span className="text-xs px-2 py-0.5 rounded" style={{ 
                  backgroundColor: themeColors.border,
                  color: themeColors.text,
                  opacity: 0.6
                }}>
                  Soon
                </span>
              )}
              {isActive && <ChevronRight size={16} />}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: themeColors.border }}>
        <p className="text-xs" style={{ color: themeColors.text, opacity: 0.6 }}>
          Files auto-deleted after processing
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
