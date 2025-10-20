import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "2rem",
      textAlign: "center"
    }}>
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#1f2937" }}>
          Anonymous Mental Health Support
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#6b7280", maxWidth: "600px", margin: "0 auto" }}>
          Connect with trained volunteer counsellors for confidential support with mental health, 
          relationships, academics, and life challenges.
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "2rem",
        marginBottom: "3rem"
      }}>
        <div style={{ 
          background: "#f9fafb", 
          padding: "2rem", 
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}>
          <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>Need Support?</h3>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            Start an anonymous session and get connected with a volunteer counsellor
          </p>
          <Link 
            to="/counselee" 
            style={{ 
              background: "#2563eb", 
              color: "white", 
              padding: "0.75rem 1.5rem", 
              borderRadius: "6px", 
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Get Help Now
          </Link>
        </div>

        <div style={{ 
          background: "#f9fafb", 
          padding: "2rem", 
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}>
          <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>Want to Help?</h3>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            Register as a volunteer counsellor and make a difference in someone's life
          </p>
          <Link 
            to="/counsellor" 
            style={{ 
              background: "#059669", 
              color: "white", 
              padding: "0.75rem 1.5rem", 
              borderRadius: "6px", 
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Volunteer Today
          </Link>
        </div>
      </div>

      <div style={{ 
        background: "#fef3c7", 
        padding: "2rem", 
        borderRadius: "8px",
        border: "1px solid #fbbf24"
      }}>
        <h3 style={{ color: "#92400e", marginBottom: "1rem" }}>How It Works</h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "1.5rem",
          textAlign: "left"
        }}>
          <div>
            <strong style={{ color: "#92400e" }}>1. Start Anonymous Session</strong>
            <p style={{ color: "#92400e", margin: "0.5rem 0 0 0" }}>
              No personal information required. Get a secure session ID.
            </p>
          </div>
          <div>
            <strong style={{ color: "#92400e" }}>2. Chat with LumaBot</strong>
            <p style={{ color: "#92400e", margin: "0.5rem 0 0 0" }}>
              Describe your situation to our AI assistant for initial guidance.
            </p>
          </div>
          <div>
            <strong style={{ color: "#92400e" }}>3. Connect with Counsellor</strong>
            <p style={{ color: "#92400e", margin: "0.5rem 0 0 0" }}>
              Get matched with a trained volunteer for personalized support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}