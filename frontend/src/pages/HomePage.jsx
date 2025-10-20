import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import ChatbotWidget from "../components/ChatbotWidget";

export default function HomePage() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleSessionStart = () => {
    navigate("/counselee");
  };

  const styles = {
    container: {
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
      minHeight: "calc(100vh - 80px)",
      transition: "all 0.3s ease",
    },
    hero: {
      background: "linear-gradient(135deg, var(--primary) 0%, var(--primary) 100%)",
      color: "var(--primary-foreground)",
      padding: "4rem 2rem",
      textAlign: "center",
      position: "relative",
      overflow: "hidden"
    },
    heroContent: {
      maxWidth: "800px",
      margin: "0 auto",
      position: "relative",
      zIndex: 2
    },
    heroBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
      background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    title: {
      fontSize: "3.5rem",
      fontWeight: "700",
      marginBottom: "1.5rem",
      lineHeight: "1.1"
    },
    subtitle: {
      fontSize: "1.25rem",
      opacity: 0.9,
      marginBottom: "2rem",
      lineHeight: "1.6"
    },
    ctaButtons: {
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      flexWrap: "wrap"
    },
    primaryButton: {
      backgroundColor: "var(--primary-foreground)",
      color: "var(--primary)",
      padding: "1rem 2rem",
      borderRadius: "var(--radius)",
      textDecoration: "none",
      fontWeight: "600",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
      border: "none",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: "var(--primary-foreground)",
      padding: "1rem 2rem",
      borderRadius: "var(--radius)",
      textDecoration: "none",
      fontWeight: "600",
      fontSize: "1.1rem",
      border: "2px solid var(--primary-foreground)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    features: {
      padding: "4rem 2rem",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem",
      marginBottom: "4rem"
    },
    featureCard: {
      backgroundColor: "var(--secondary)",
      padding: "2rem",
      borderRadius: "12px",
      border: "1px solid var(--border)",
      transition: "all 0.3s ease",
      cursor: "pointer"
    },
    featureIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
      display: "block"
    },
    featureTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "var(--primary)"
    },
    featureDescription: {
      opacity: 0.8,
      lineHeight: "1.6",
      marginBottom: "1.5rem"
    },
    stats: {
      backgroundColor: "var(--secondary)",
      padding: "3rem 2rem",
      borderRadius: "12px",
      textAlign: "center",
      marginBottom: "4rem"
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "2rem",
      maxWidth: "800px",
      margin: "0 auto"
    },
    statItem: {
      padding: "1rem"
    },
    statNumber: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "var(--primary)",
      display: "block"
    },
    statLabel: {
      opacity: 0.8,
      fontSize: "0.9rem",
      textTransform: "uppercase",
      letterSpacing: "0.05em"
    },
    howItWorks: {
      textAlign: "center",
      marginBottom: "4rem"
    },
    stepsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "2rem",
      marginTop: "2rem"
    },
    step: {
      padding: "2rem 1rem",
      position: "relative"
    },
    stepNumber: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      fontWeight: "700",
      margin: "0 auto 1rem auto"
    },
    stepTitle: {
      fontSize: "1.1rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
      color: "var(--primary)"
    },
    stepDescription: {
      opacity: 0.8,
      lineHeight: "1.5"
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBackground}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>
            🌙 Anonymous Mental Health Support
          </h1>
          <p style={styles.subtitle}>
            Connect with trained volunteer counsellors for confidential support. 
            Your privacy is protected, your wellbeing is our priority.
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/counselee" style={styles.primaryButton}>
              🆘 Get Help Now
            </Link>
            <Link to="/counsellor" style={styles.secondaryButton}>
              ❤️ Volunteer Today
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <span style={styles.featureIcon}>🔒</span>
            <h3 style={styles.featureTitle}>100% Anonymous</h3>
            <p style={styles.featureDescription}>
              No personal information required. Your identity remains completely private 
              throughout the entire process.
            </p>
            <Link to="/counselee" style={{
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}>
              Start Anonymous Session →
            </Link>
          </div>

          <div style={styles.featureCard}>
            <span style={styles.featureIcon}>🤖</span>
            <h3 style={styles.featureTitle}>AI-Powered Triage</h3>
            <p style={styles.featureDescription}>
              Chat with LumaBot for immediate support and guidance. Get matched 
              with the right counsellor for your specific needs.
            </p>
            <button 
              onClick={() => setIsChatbotOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer",
                padding: 0
              }}
            >
              Try LumaBot →
            </button>
          </div>

          <div style={styles.featureCard}>
            <span style={styles.featureIcon}>👥</span>
            <h3 style={styles.featureTitle}>Trained Volunteers</h3>
            <p style={styles.featureDescription}>
              Connect with experienced counsellors specializing in mental health, 
              relationships, academics, and career guidance.
            </p>
            <Link to="/counsellor" style={{
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}>
              Become a Volunteer →
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.stats}>
          <h2 style={{ marginBottom: "2rem", color: "var(--primary)" }}>Making a Difference</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>24/7</span>
              <span style={styles.statLabel}>Available Support</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>100%</span>
              <span style={styles.statLabel}>Confidential</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>5+</span>
              <span style={styles.statLabel}>Support Categories</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>Free</span>
              <span style={styles.statLabel}>Always Free</span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div style={styles.howItWorks}>
          <h2 style={{ color: "var(--primary)", marginBottom: "1rem" }}>How It Works</h2>
          <p style={{ opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>
            Getting support is simple and completely anonymous. Here's how our platform works:
          </p>
          
          <div style={styles.stepsGrid}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Start Anonymous Session</h3>
              <p style={styles.stepDescription}>
                Click "Get Help Now" to create a secure, anonymous session. 
                No personal information required.
              </p>
            </div>
            
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Chat with LumaBot</h3>
              <p style={styles.stepDescription}>
                Describe your situation to our AI assistant. LumaBot provides 
                immediate guidance and helps match you with the right counsellor.
              </p>
            </div>
            
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Connect with Counsellor</h3>
              <p style={styles.stepDescription}>
                Get connected with a trained volunteer counsellor who specializes 
                in your area of need for personalized support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Widget */}
      <ChatbotWidget 
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
        onSessionStart={handleSessionStart}
      />
    </div>
  );
}