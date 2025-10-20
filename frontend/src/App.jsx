import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { lightTheme, darkTheme } from "./styles/theme";
import HomePage from "./pages/HomePage";
import CounseleeApp from "./components/CounseleeApp";
import CounsellorApp from "./components/CounsellorApp";

export const ThemeContext = createContext();

export default function App() {
  const [theme, setTheme] = useState("light");

  // Apply CSS variables dynamically
  useEffect(() => {
    const root = document.documentElement;
    const vars = theme === "dark" ? darkTheme : lightTheme;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  // Apply global styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: "Inter", sans-serif;
        background-color: var(--background);
        color: var(--foreground);
        transition: background-color 0.3s ease, color 0.3s ease;
        min-height: 100vh;
      }

      h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      code, pre {
        font-family: "JetBrains Mono", monospace;
      }

      button {
        font-family: inherit;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Router>
        <div style={{ fontFamily: "Inter, sans-serif" }}>
          <nav style={{ 
            background: "var(--primary)", 
            color: "var(--primary-foreground)", 
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
          }}>
            <Link to="/" style={{ 
              color: "var(--primary-foreground)", 
              textDecoration: "none", 
              fontSize: "1.5rem", 
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              🌙 Luma
            </Link>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              <Link 
                to="/counselee" 
                style={{ 
                  color: "var(--primary-foreground)", 
                  textDecoration: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  transition: "background-color 0.2s ease",
                  fontWeight: "500"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              >
                🆘 Get Help
              </Link>
              <Link 
                to="/counsellor" 
                style={{ 
                  color: "var(--primary-foreground)", 
                  textDecoration: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  transition: "background-color 0.2s ease",
                  fontWeight: "500"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              >
                ❤️ Volunteer
              </Link>
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "var(--primary-foreground)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/counselee" element={<CounseleeApp />} />
            <Route path="/counsellor" element={<CounsellorApp />} />
          </Routes>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}
