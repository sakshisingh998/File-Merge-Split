// src/components/modules/Dashboard.jsx - Main Dashboard View
import React from "react";
import { FileText, Sparkles, Image, Lock, PenTool } from "lucide-react";

function Dashboard({ theme, onNavigate }) {
  const themeColors = theme === "dark"
    ? {
        bg: "#1F1515",
        surface: "#2B1D1D",
        text: "#FAF7F5",
        textSecondary: "#D4C7C0",
        border: "#3F2E2E",
        accent: "#E0B089",
      }
    : {
        bg: "#FAF7F5",
        surface: "#FFFFFF",
        text: "#2B1D1D",
        textSecondary: "#7A5C58",
        border: "#E5DED9",
        accent: "#E0B089",
      };

  const handleActionClick = (action) => {
    if (!onNavigate) return;
    
    switch (action) {
      case "split":
        onNavigate("pdf-tools", "split");
        break;
      case "merge":
        onNavigate("pdf-tools", "merge");
        break;
      case "extract":
        onNavigate("pdf-tools", "extract");
        break;
      case "ai-summary":
        onNavigate("ai-tools");
        break;
      case "convert":
        onNavigate("convert");
        break;
      case "protect":
        onNavigate("security", "protect");
        break;
      case "sign":
        onNavigate("security", "sign");
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: themeColors.text }}>
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: themeColors.textSecondary }}>
          Quick access to your PDF tools and AI-powered features
        </p>
      </div>

      {/* Quick Actions */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: themeColors.surface,
          border: `1px solid ${themeColors.border}`,
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Split PDF"
            description="Divide PDFs by page ranges"
            icon={FileText}
            theme={theme}
            themeColors={themeColors}
            onClick={() => handleActionClick("split")}
          />
          <QuickActionCard
            title="Merge PDFs"
            description="Combine multiple files"
            icon={FileText}
            theme={theme}
            themeColors={themeColors}
            onClick={() => handleActionClick("merge")}
          />
          <QuickActionCard
            title="Extract Text"
            description="Extract text from PDFs"
            icon={FileText}
            theme={theme}
            themeColors={themeColors}
            onClick={() => handleActionClick("extract")}
          />
          <QuickActionCard
            title="AI Summary"
            description="Get intelligent summaries"
            icon={Sparkles}
            theme={theme}
            themeColors={themeColors}
            onClick={() => handleActionClick("ai-summary")}
          />
          <QuickActionCard
            title="Convert"
            description="PDF ↔ Image conversion"
            icon={Image}
            theme={theme}
            themeColors={themeColors}
            onClick={() => handleActionClick("convert")}
          />
          <QuickActionCard
            title="Protect PDF"
            description="Add password protection"
            icon={Lock}
            theme={theme}
            themeColors={themeColors}
            onClick={() => handleActionClick("protect")}
          />
          <QuickActionCard
            title="Sign PDF"
            description="Add digital signature"
            icon={PenTool}
            theme={theme}
            themeColors={themeColors}
            onClick={() => handleActionClick("sign")}
          />
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, icon, theme, themeColors, onClick }) {
  const Icon = icon;
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
      style={{
        backgroundColor: theme === "dark" ? "#1F1515" : "#FAF7F5",
        border: `1px solid ${themeColors.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = themeColors.accent;
        e.currentTarget.style.backgroundColor = theme === "dark" ? "#2B1D1D" : "#FFFFFF";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = themeColors.border;
        e.currentTarget.style.backgroundColor = theme === "dark" ? "#1F1515" : "#FAF7F5";
      }}
    >
      <Icon size={24} style={{ color: themeColors.accent }} className="mb-2" />
      <h3 className="font-semibold mb-1" style={{ color: themeColors.text }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: themeColors.textSecondary }}>
        {description}
      </p>
    </div>
  );
}

export default Dashboard;

