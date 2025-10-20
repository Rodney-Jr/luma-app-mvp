import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../App";

const API = "/api";

export default function CounsellorApp() {
  const { theme } = useContext(ThemeContext);
  const [isRegistered, setIsRegistered] = useState(false);
  const [counsellorData, setCounsellorData] = useState({
    display_name: "",
    categories: [],
    languages: [],
    bio: ""
  });
  const [availableSessions, setAvailableSessions] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);

  const categories = ["Mental Health", "Marriage & Relationships", "Academic", "Career", "Family"];
  const languages = ["English", "Spanish", "French", "German", "Mandarin", "Other"];

  async function registerCounsellor() {
    if (!counsellorData.display_name.trim()) {
      alert("Please enter your display name");
      return;
    }
    if (counsellorData.categories.length === 0) {
      alert("Please select at least one category");
      return;
    }
    if (counsellorData.languages.length === 0) {
      alert("Please select at least one language");
      return;
    }

    try {
      const res = await axios.post(`${API}/counsellors/register`, counsellorData);
      setIsRegistered(true);
      alert("Registration successful! Your application is pending approval.");
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  }

  async function loadSessions() {
    try {
      const response = await axios.get(`${API}/counsellors/sessions/available`);
      if (response.data.sessions) {
        setAvailableSessions(response.data.sessions);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
      // Fallback to demo data for development
      setAvailableSessions([
        { session_id: "s-1729368000-abc123", created_at: Date.now() - 300000, category: "Mental Health" },
        { session_id: "s-1729368100-def456", created_at: Date.now() - 180000, category: "Academic" }
      ]);
    }
  }

  async function acceptSession(sessionId) {
    try {
      // Note: In a real implementation, we'd need counsellor authentication
      // For now, we'll use a placeholder counsellor ID
      const response = await axios.post(`${API}/counsellors/sessions/${sessionId}/accept`, {
        counsellor_id: 1 // This would come from authenticated user
      });
      
      if (response.data.status === "accepted") {
        alert(`Session accepted! You can now start chatting with the counselee.`);
        setActiveSessions(prev => [...prev, sessionId]);
        setAvailableSessions(prev => prev.filter(s => s.session_id !== sessionId));
      }
    } catch (err) {
      alert("Failed to accept session: " + err.message);
    }
  }

  const handleCategoryChange = (category) => {
    setCounsellorData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleLanguageChange = (language) => {
    setCounsellorData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  useEffect(() => {
    if (isRegistered) {
      loadSessions();
      const interval = setInterval(loadSessions, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isRegistered]);

  const styles = {
    container: {
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
      minHeight: "calc(100vh - 80px)",
      padding: "2rem"
    },
    registrationContainer: {
      maxWidth: "700px",
      margin: "0 auto"
    },
    dashboardContainer: {
      maxWidth: "1200px",
      margin: "0 auto"
    },
    header: {
      textAlign: "center",
      marginBottom: "3rem"
    },
    title: {
      color: "var(--primary)",
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "1rem"
    },
    subtitle: {
      opacity: 0.8,
      fontSize: "1.1rem",
      maxWidth: "600px",
      margin: "0 auto"
    },
    card: {
      backgroundColor: "var(--secondary)",
      padding: "2rem",
      borderRadius: "12px",
      border: "1px solid var(--border)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
    },
    formGroup: {
      marginBottom: "1.5rem"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "600",
      color: "var(--foreground)"
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid var(--border)",
      borderRadius: "6px",
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
      fontSize: "1rem"
    },
    textarea: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid var(--border)",
      borderRadius: "6px",
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
      fontSize: "1rem",
      resize: "vertical",
      minHeight: "100px"
    },
    checkboxGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "0.5rem"
    },
    checkboxItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.5rem"
    },
    primaryButton: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      width: "100%",
      transition: "all 0.2s ease"
    },
    dashboardGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "2rem",
      marginTop: "2rem"
    },
    sessionCard: {
      backgroundColor: "var(--background)",
      padding: "1.5rem",
      borderRadius: "8px",
      border: "1px solid var(--border)",
      marginBottom: "1rem",
      transition: "all 0.2s ease"
    },
    sessionButton: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "500"
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem 1rem",
      opacity: 0.6
    }
  };

  if (!isRegistered) {
    return (
      <div style={styles.container}>
        <div style={styles.registrationContainer}>
          <div style={styles.header}>
            <h1 style={styles.title}>❤️ Volunteer as a Counsellor</h1>
            <p style={styles.subtitle}>
              Join our community of trained volunteers and make a difference in someone's life. 
              Help provide anonymous support to those who need it most.
            </p>
          </div>
        
        <div style={styles.card}>
          <h2 style={{ color: "var(--primary)", marginBottom: "1.5rem" }}>Registration Form</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Display Name *
            </label>
            <input
              type="text"
              value={counsellorData.display_name}
              onChange={e => setCounsellorData(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="How you'd like to be known to counselees"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Categories of Support *
            </label>
            <div style={styles.checkboxGrid}>
              {categories.map(category => (
                <label key={category} style={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={counsellorData.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Languages *
            </label>
            <div style={styles.checkboxGrid}>
              {languages.map(language => (
                <label key={language} style={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={counsellorData.languages.includes(language)}
                    onChange={() => handleLanguageChange(language)}
                  />
                  {language}
                </label>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Bio (Optional)
            </label>
            <textarea
              value={counsellorData.bio}
              onChange={e => setCounsellorData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Brief description of your background and approach to counselling"
              style={styles.textarea}
            />
          </div>

          <button
            onClick={registerCounsellor}
            style={styles.primaryButton}
          >
            🚀 Register as Volunteer Counsellor
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>👨‍⚕️ Counsellor Dashboard</h1>
          <p style={styles.subtitle}>
            Welcome back! Here you can view available sessions and manage your active conversations.
          </p>
        </div>
        
        <div style={styles.dashboardGrid}>
          {/* Available Sessions */}
          <div style={styles.card}>
            <h2 style={{ color: "var(--primary)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              ⏳ Available Sessions
              {availableSessions.length > 0 && (
                <span style={{ 
                  backgroundColor: "var(--primary)", 
                  color: "var(--primary-foreground)", 
                  borderRadius: "50%", 
                  width: "24px", 
                  height: "24px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "0.8rem" 
                }}>
                  {availableSessions.length}
                </span>
              )}
            </h2>
            
            {availableSessions.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😴</div>
                <p>No sessions waiting</p>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  Check back soon for people who need support
                </p>
              </div>
            ) : (
              availableSessions.map(session => (
                <div key={session.session_id} style={styles.sessionCard}>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <strong>Session:</strong> {session.session_id}
                  </div>
                  <div style={{ marginBottom: "0.5rem", opacity: 0.8 }}>
                    <strong>Category:</strong> {session.category || "General"}
                  </div>
                  <div style={{ marginBottom: "1rem", opacity: 0.7, fontSize: "0.9rem" }}>
                    <strong>Waiting:</strong> {Math.floor((Date.now() - session.created_at) / 60000)} minutes
                  </div>
                  <button
                    onClick={() => acceptSession(session.session_id)}
                    style={styles.sessionButton}
                  >
                    🤝 Accept Session
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Active Sessions */}
          <div style={styles.card}>
            <h2 style={{ color: "var(--primary)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              💬 Active Sessions
              {activeSessions.length > 0 && (
                <span style={{ 
                  backgroundColor: "#10b981", 
                  color: "white", 
                  borderRadius: "50%", 
                  width: "24px", 
                  height: "24px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "0.8rem" 
                }}>
                  {activeSessions.length}
                </span>
              )}
            </h2>
            
            {activeSessions.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💭</div>
                <p>No active sessions</p>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  Accept a session to start helping someone
                </p>
              </div>
            ) : (
              activeSessions.map(sessionId => (
                <div key={sessionId} style={{
                  ...styles.sessionCard,
                  border: "1px solid #10b981",
                  backgroundColor: "#ecfdf5"
                }}>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <strong>Session:</strong> {sessionId}
                  </div>
                  <div style={{ marginBottom: "1rem", opacity: 0.8, fontSize: "0.9rem" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.5rem" 
                    }}>
                      <div style={{ 
                        width: "8px", 
                        height: "8px", 
                        borderRadius: "50%", 
                        backgroundColor: "#10b981" 
                      }}></div>
                      Active conversation
                    </div>
                  </div>
                  <button
                    style={{
                      ...styles.sessionButton,
                      backgroundColor: "#10b981"
                    }}
                  >
                    💬 Open Chat
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}