// src/App.jsx - Premium SaaS Dashboard Application
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./components/modules/Dashboard";
import PDFTools from "./components/modules/PDFTools";
import AITools from "./components/modules/AITools";
import Convert from "./components/modules/Convert";
import Security from "./components/modules/Security";
import theme from "./config/theme";

function App() {
  const [currentModule, setCurrentModule] = useState("dashboard");
  const [appTheme, setAppTheme] = useState("light");
  const [pdfTool, setPdfTool] = useState(null); // Track which PDF tool to activate
  const [securityTool, setSecurityTool] = useState(null); // Track which Security tool to activate

  const currentTheme = theme[appTheme];

  const handleNavigate = (module, tool = null) => {
    setCurrentModule(module);
    if (tool) {
      if (module === "pdf-tools") {
        setPdfTool(tool);
      } else if (module === "security") {
        setSecurityTool(tool);
      }
    }
  };

  const renderModule = () => {
    switch (currentModule) {
      case "dashboard":
        return <Dashboard theme={appTheme} onNavigate={handleNavigate} />;
      case "pdf-tools":
        return <PDFTools theme={appTheme} initialTool={pdfTool} />;
      case "ai-tools":
        return <AITools theme={appTheme} />;
      case "convert":
        return <Convert theme={appTheme} />;
      case "security":
        return <Security theme={appTheme} initialTool={securityTool} />;
      case "activity":
        return <ComingSoon module="Activity" theme={appTheme} />;
      case "settings":
        return <ComingSoon module="Settings" theme={appTheme} />;
      default:
        return <Dashboard theme={appTheme} />;
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.text.primary,
      }}
    >
      {/* Sidebar */}
      <Sidebar
        currentModule={currentModule}
        onModuleChange={(module) => {
          setCurrentModule(module);
          // Reset tools when navigating away
          if (module !== "pdf-tools") {
            setPdfTool(null);
          }
          if (module !== "security") {
            setSecurityTool(null);
          }
        }}
        theme={appTheme}
      />

      {/* Top Bar */}
      <TopBar
        theme={appTheme}
        onThemeToggle={() => setAppTheme(appTheme === "light" ? "dark" : "light")}
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300"
        style={{
          marginLeft: "256px", // Sidebar width
          marginTop: "64px",    // Top bar height
          padding: "2rem",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {renderModule()}
        </div>
      </main>
    </div>
  );
}

// Coming Soon Component for future modules
function ComingSoon({ module, theme }) {
  const themeColors = theme === "dark"
    ? {
        bg: "#1F1515",
        surface: "#2B1D1D",
        text: "#FAF7F5",
        textSecondary: "#D4C7C0",
        border: "#3F2E2E",
      }
    : {
        bg: "#FAF7F5",
        surface: "#FFFFFF",
        text: "#2B1D1D",
        textSecondary: "#7A5C58",
        border: "#E5DED9",
      };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: themeColors.text }}>
          {module}
        </h1>
        <p className="text-sm" style={{ color: themeColors.textSecondary }}>
          This feature is coming soon
        </p>
      </div>

      <div
        className="p-12 rounded-xl text-center"
        style={{
          backgroundColor: themeColors.surface,
          border: `1px solid ${themeColors.border}`,
        }}
      >
        <div className="max-w-md mx-auto">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: themeColors.bg }}
          >
            <span className="text-4xl">🚀</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2" style={{ color: themeColors.text }}>
            Coming Soon
          </h2>
          <p className="text-sm" style={{ color: themeColors.textSecondary }}>
            We're working hard to bring you {module.toLowerCase()} features. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
