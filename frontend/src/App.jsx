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
      default:
        return <Dashboard theme={appTheme} onNavigate={handleNavigate} />;
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

export default App;
