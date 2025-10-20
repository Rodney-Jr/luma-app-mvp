import React, { useContext } from "react";
import { ThemeContext } from "./_app";

export default function Home() {
    const { theme, setTheme } = useContext(ThemeContext);

    const styles = {
        container: {
            padding: "2rem",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            transition: "all 0.3s ease",
        },
        button: {
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            padding: "0.8rem 1.6rem",
            borderRadius: "var(--radius)",
            cursor: "pointer",
            fontWeight: 600,
            transition: "opacity 0.2s ease",
        },
        card: {
            backgroundColor: "var(--secondary)",
            color: "var(--secondary-foreground)",
            padding: "2rem",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        },
        code: {
            backgroundColor: "var(--secondary)",
            padding: "0.4rem 0.6rem",
            borderRadius: "4px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.9rem",
            color: "var(--primary)",
        },
    };

    return (
        <div style={styles.container}>
            <h1>🌙 Luma Support Platform</h1>
            <button
                style={styles.button}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </button>

            <div style={styles.card}>
                <h2>Welcome to Luma</h2>
                <p>
                    This is a <code style={styles.code}>Next.js</code> setup that uses
                    inline JSX and CSS variables for theming — no Tailwind, no external
                    CSS.
                </p>
                <ul>
                    <li>Light/Dark mode toggle</li>
                    <li>Global typography via Google Fonts</li>
                    <li>Reusable theme context</li>
                </ul>
            </div>
        </div>
    );
}
