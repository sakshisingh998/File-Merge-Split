// src/config/theme.js

const theme = {
  colors: {
    // Base palette
    primary: "#362222",    // Dark reddish-brown (headers, strong accents)
    secondary: "#675D50",  // Warm brown (cards, secondary elements)
    accent: "#A9907E",     // Warm Taupe (highlights)
    tertiary: "#171010",   // Deepest dark (text, borders)
    background: "#F3DEBA", // Light beige (page background)

    text: "#171010",       // Dark text for readability

    // Enhanced buttons with more variants
    button: {
      bg: "#F3DEBA",       // Button background (light)
      text: "#362222",     // Button text (dark)
      hoverBg: "#A9907E",  // Button hover (warm taupe)
      border: "#362222",   // Border for contrast

      // Additional button states
      active: "#675D50",   // Active button background
      disabled: "#E5E5E5", // Disabled button background
      disabledText: "#999999", // Disabled button text
    },

    // Enhanced cards with gradients
    card: {
      split: "linear-gradient(135deg, #362222, #A9907E)",       // Split PDF card
      merge: "linear-gradient(135deg, #675D50, #A9907E)",       // Merge PDF card
      extract: "linear-gradient(135deg, #362222, #F3DEBA)",     // Extract PDF card
      summarize: "linear-gradient(135deg, #A9907E, #F3DEBA)",   // Summarize card
      text: "#F3DEBA",                                           // Card text
      bg: "#675D50",                                             // Fallback solid bg

      // Card interaction states
      hover: "linear-gradient(135deg, #4A2E2E, #B59B8E)",       // Hover effect overlay
      shadow: "0 10px 25px rgba(54, 34, 34, 0.3)",             // Enhanced shadow
      hoverShadow: "0 15px 35px rgba(54, 34, 34, 0.4)",        // Hover shadow
    },

    // Enhanced inputs
    input: {
      bg: "#F3DEBA",       // Light input background
      text: "#171010",     // Dark text
      border: "#362222",   // Dark border
      placeholder: "#A9907E", // Placeholder color

      // Focus states
      focusBorder: "#A9907E",      // Focus border color
      focusRing: "rgba(169, 144, 126, 0.3)", // Focus ring color
      focusBg: "#FFFFFF",          // Focus background (lighter)
    },

    // Status colors for feedback
    status: {
      success: "#10B981",    // Green for success
      error: "#EF4444",      // Red for errors
      warning: "#F59E0B",    // Amber for warnings
      info: "#3B82F6",       // Blue for information
    },

    // Modal and overlay colors
    modal: {
      overlay: "rgba(0, 0, 0, 0.5)",     // Modal backdrop
      bg: "#FFFFFF",                      // Modal background
      text: "#171010",                    // Modal text
      border: "#E5E7EB",                  // Modal border
    },

    // Navigation specific colors
    navigation: {
      active: "#A9907E",         // Active navigation item
      inactive: "#675D50",       // Inactive navigation item
      hover: "#8A7A6B",          // Navigation hover state
    },

    // Borders & highlights
    border: "#362222",
    highlight: "#A9907E",

    // Additional utility colors
    overlay: "rgba(54, 34, 34, 0.1)",    // Light overlay
    divider: "rgba(54, 34, 34, 0.2)",    // Divider lines
  },

  // Typography scale
  typography: {
    fontSize: {
      xs: "0.75rem",     // 12px
      sm: "0.875rem",    // 14px
      base: "1rem",      // 16px
      lg: "1.125rem",    // 18px
      xl: "1.25rem",     // 20px
      "2xl": "1.5rem",   // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem",  // 36px
      "5xl": "3rem",     // 48px
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    }
  },

  // Spacing scale
  spacing: {
    xs: "0.25rem",   // 4px
    sm: "0.5rem",    // 8px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    "2xl": "3rem",   // 48px
    "3xl": "4rem",   // 64px
  },

  // Border radius
  borderRadius: {
    sm: "0.375rem",  // 6px
    md: "0.5rem",    // 8px
    lg: "0.75rem",   // 12px
    xl: "1rem",      // 16px
    "2xl": "1.5rem", // 24px
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
    "2xl": "0 25px 50px rgba(0, 0, 0, 0.25)",
    card: "0 10px 25px rgba(54, 34, 34, 0.3)",
    cardHover: "0 15px 35px rgba(54, 34, 34, 0.4)",
  },

  // Animation durations
  animation: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  }
};

export default theme;