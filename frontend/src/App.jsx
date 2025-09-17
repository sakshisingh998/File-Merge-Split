// src/App.jsx
import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingCircles3D from "./components/FloatingCircles3D";
import SplitCard from "./components/SplitCard";
import MergeCard from "./components/MergeCard";
import ExtractCard from "./components/ExtractCard";
import { Split, Merge, FileText } from "lucide-react";
import theme from "./config/theme";

function App() {
  const [currentCard, setCurrentCard] = useState(0);

  const cards = [
    { component: SplitCard, name: "Split", icon: Split },
        { component: ExtractCard, name: "Extract & Summarize", icon: FileText }
,
    { component: MergeCard, name: "Merge", icon: Merge }
  ];

  const CurrentCardComponent = cards[currentCard].component;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 3D Floating Circles Background */}
      <FloatingCircles3D />

      {/* Background Gradient */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.background} 0%, #E8C997 50%, #D4B786 100%)`,
        }}
      />

      {/* Main Content with backdrop blur for glass effect */}
      <main
        className="flex-grow flex flex-col items-center py-8 px-4 relative z-10"
        style={{
          backdropFilter: "blur(0.5px)",
          background: "rgba(243, 222, 186, 0.1)"
        }}
      >
        {/* Header */}
        <Header />

        {/* Navigation Description */}
        <div className="text-center mb-8 max-w-2xl">

            <p className="text-lg mb-6" style={{ color: theme.colors.secondary }}>
              This utility suite provides a comprehensive solution for managing PDF files,
              allowing you to split, merge, extract, and summarize documents efficiently.
            </p>

            {/* Horizontal Navigation Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              {cards.map((card, index) => {
                const IconComponent = card.icon;
                const isActive = currentCard === index;

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentCard(index)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold shadow-lg
                               transition-all duration-200 transform hover:scale-105 active:scale-95
                               focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-sm ${
                      isActive
                        ? 'ring-2 scale-105'
                        : 'hover:shadow-xl'
                    }`}
                    style={{
                      backgroundColor: isActive ? theme.colors.accent : theme.colors.button.bg,
                      color: isActive ? theme.colors.card.text : theme.colors.button.text,
                      border: `2px solid ${isActive ? theme.colors.accent : theme.colors.button.border}`,
                    }}
                  >
                    <IconComponent size={20} />
                    <span>{card.name}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Single Card Display with enhanced glass effect */}
        <div className="w-full max-w-md mx-auto">
          <div className="backdrop-blur-sm rounded-2xl p-1" style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <CurrentCardComponent />
          </div>
        </div>

        {/* Current Card Indicator */}
        <div
          className="mt-6 text-center text-sm opacity-80 backdrop-blur-sm px-4 py-2 rounded-lg"
          style={{
            background: "rgba(243, 222, 186, 0.6)",
            color: theme.colors.secondary
          }}
        >
          <p>{cards[currentCard].name} • {currentCard + 1} of {cards.length}</p>
        </div>
      </main>

      {/* Footer with backdrop blur */}
      <div className="backdrop-blur-sm">
        <Footer />
      </div>
    </div>
  );
}

export default App;