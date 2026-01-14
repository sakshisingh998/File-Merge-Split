// src/config/theme.js - Premium SaaS Theme System

const lightTheme = {
  colors: {
    // Base palette - Custom color scheme
    background: "#FAF7F5",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    
    // Text hierarchy
    text: {
      primary: "#2B1D1D",      // Custom text color
      secondary: "#7A5C58",    // Secondary color
      tertiary: "#A08B88",     // Lighter secondary
      inverse: "#FFFFFF",
    },
    
    // Brand colors
    primary: {
      50: "#F5F3F2",
      100: "#E8E0DD",
      500: "#3F2E2E",          // Primary color
      600: "#2B1D1D",          // Darker primary
      700: "#1F1515",          // Darkest primary
    },
    
    // Accent color
    accent: {
      50: "#F9F5F0",
      100: "#F2E5D5",
      500: "#E0B089",          // Accent color
      600: "#D49A6B",
      700: "#C8854D",
    },
    
    // Status colors
    status: {
      success: "#10B981",      // Green 500
      error: "#EF4444",        // Red 500
      warning: "#F59E0B",      // Amber 500
      info: "#3B82F6",         // Blue 500
    },
    
    // Borders & dividers
    border: {
      default: "#E5DED9",      // Light border
      hover: "#D4C7C0",        // Hover border
      focus: "#E0B089",        // Accent color for focus
    },
    
    // Sidebar
    sidebar: {
      bg: "#3F2E2E",           // Primary color
      text: "#FAF7F5",         // Background color (light text)
      hover: "#4A3A3A",        // Darker primary
      active: "#E0B089",       // Accent color
    },
  },
  
  shadows: {
    sm: "0 1px 2px 0 rgba(63, 46, 46, 0.05)",
    md: "0 4px 6px -1px rgba(63, 46, 46, 0.1)",
    lg: "0 10px 15px -3px rgba(63, 46, 46, 0.1)",
    xl: "0 20px 25px -5px rgba(63, 46, 46, 0.1)",
    card: "0 1px 3px 0 rgba(63, 46, 46, 0.1), 0 1px 2px -1px rgba(63, 46, 46, 0.1)",
    cardHover: "0 4px 6px -1px rgba(63, 46, 46, 0.1), 0 2px 4px -2px rgba(63, 46, 46, 0.1)",
  },
};

const darkTheme = {
  colors: {
    // Base palette - Dark mode with custom colors
    background: "#1F1515",     // Dark version of primary
    surface: "#2B1D1D",       // Text color as surface
    surfaceElevated: "#3F2E2E", // Primary as elevated
    
    // Text hierarchy
    text: {
      primary: "#FAF7F5",      // Background color (light text)
      secondary: "#D4C7C0",   // Lighter secondary
      tertiary: "#A08B88",    // Secondary color
      inverse: "#2B1D1D",
    },
    
    // Brand colors (same as light)
    primary: {
      50: "#F5F3F2",
      100: "#E8E0DD",
      500: "#3F2E2E",
      600: "#2B1D1D",
      700: "#1F1515",
    },
    
    // Accent color (same as light)
    accent: {
      50: "#F9F5F0",
      100: "#F2E5D5",
      500: "#E0B089",
      600: "#D49A6B",
      700: "#C8854D",
    },
    
    // Status colors (same as light)
    status: {
      success: "#10B981",
      error: "#EF4444",
      warning: "#F59E0B",
      info: "#3B82F6",
    },
    
    // Borders & dividers
    border: {
      default: "#3F2E2E",      // Primary color
      hover: "#4A3A3A",        // Darker primary
      focus: "#E0B089",        // Accent color
    },
    
    // Sidebar
    sidebar: {
      bg: "#1F1515",           // Darkest primary
      text: "#FAF7F5",         // Background color (light text)
      hover: "#2B1D1D",        // Text color
      active: "#E0B089",       // Accent color
    },
  },
  
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.6)",
    card: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)",
    cardHover: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)",
  },
};

const theme = {
  light: lightTheme,
  dark: darkTheme,
};

export default theme;
