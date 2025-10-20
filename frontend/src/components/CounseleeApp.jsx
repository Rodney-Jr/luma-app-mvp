import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { ThemeContext } from "../App";
import ChatbotWidget from "./ChatbotWidget";

const API = "/api";

export default function CounseleeApp() {
  const { theme } = useContext(ThemeContext);
  const [session, setSession] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("idle"); // idle, starting, active, waiting
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [counsellorConnected, setCounsellorConnected] = useState(false);
  const [counsellorInfo, setCounsellorInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Poll for messages when session is active
  useEffect(() => {
    if (session && sessionStatus === "active") {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(`${API}/counselees/session/${session}/messages`);
          if (response.data.messages) {
            setChatMessages(response.data.messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp * 1000).toLocaleTimeString()
            })));
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [session, sessionStatus]);

  async function startSession() {
    setIsLoading(true);
    setSessionStatus("starting");
    
    try {
      const res = await axios.post(`${API}/counselees/session/start`);
      setSession(res.data.session_id);
      setSessionStatus("waiting");
      
      // Add welcome message
      const welcomeMessage = {
        sender: "system",
        message: "Session started! You're now in the queue to be connected with a counsellor. You can also chat with LumaBot while you wait.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages([welcomeMessage]);
      
    } catch (err) {
      alert("Failed to start session: " + err.message);
      setSessionStatus("idle");
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !session) return;
    
    const message = {
      sender: "counselee",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
    
    try {
      await axios.post(`${API}/counselees/session/${session}/message`, {
        message: newMessage
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      // Add error message
      const errorMessage = {
        sender: "system",
        message: "Failed to send message. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChatbotSessionStart = () => {
    setIsChatbotOpen(false);
    startSession();
  };

  const styles = {
    container: {
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
      minHeight: "calc(100vh - 80px)",
      padding: "2rem"
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
    startCard: {
      backgroundColor: "var(--secondary)",
      padding: "3rem",
      borderRadius: "12px",
      textAlign: "center",
      border: "1px solid var(--border)",
      maxWidth: "500px",
      margin: "0 auto",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
    },
    sessionInfo: {
      backgroundColor: "var(--secondary)",
      padding: "1rem 1.5rem",
      borderRadius: "8px",
      marginBottom: "2rem",
      border: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    chatContainer: {
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      height: "600px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
    },
    chatHeader: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      padding: "1rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    messagesArea: {
      flex: 1,
      padding: "1rem",
      overflowY: "auto",
      backgroundColor: "var(--background)"
    },
    message: {
      marginBottom: "1rem",
      display: "flex",
      flexDirection: "column"
    },
    messageContent: {
      padding: "0.75rem 1rem",
      borderRadius: "18px",
      maxWidth: "70%",
      wordWrap: "break-word",
      lineHeight: "1.4"
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      borderBottomRightRadius: "4px"
    },
    counsellorMessage: {
      alignSelf: "flex-start",
      backgroundColor: "var(--secondary)",
      color: "var(--secondary-foreground)",
      borderBottomLeftRadius: "4px"
    },
    systemMessage: {
      alignSelf: "center",
      backgroundColor: "var(--secondary)",
      color: "var(--secondary-foreground)",
      fontSize: "0.9rem",
      fontStyle: "italic",
      maxWidth: "90%",
      textAlign: "center"
    },
    timestamp: {
      fontSize: "0.75rem",
      opacity: 0.6,
      marginTop: "0.25rem"
    },
    inputArea: {
      padding: "1rem",
      borderTop: "1px solid var(--border)",
      backgroundColor: "var(--background)"
    },
    inputWrapper: {
      display: "flex",
      gap: "0.75rem",
      alignItems: "flex-end"
    },
    messageInput: {
      flex: 1,
      padding: "0.75rem 1rem",
      border: "1px solid var(--border)",
      borderRadius: "20px",
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
      fontSize: "1rem",
      resize: "none",
      minHeight: "20px",
      maxHeight: "100px"
    },
    sendButton: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      border: "none",
      borderRadius: "50%",
      width: "44px",
      height: "44px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.2rem",
      transition: "all 0.2s ease"
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
      transition: "all 0.2s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    secondaryButton: {
      backgroundColor: "var(--secondary)",
      color: "var(--secondary-foreground)",
      border: "1px solid var(--border)",
      padding: "0.75rem 1.5rem",
      borderRadius: "6px",
      fontSize: "0.9rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease"
    },
    statusIndicator: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.9rem"
    },
    onlineIndicator: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: "#10b981"
    },
    waitingIndicator: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: "#f59e0b"
    }
  };

  if (!session) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🆘 Get Anonymous Support</h1>
          <p style={styles.subtitle}>
            Start a confidential session with our trained counsellors. 
            Your privacy is completely protected.
          </p>
        </div>

        <div style={styles.startCard}>
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🔒</div>
          <h2 style={{ marginBottom: "1rem", color: "var(--primary)" }}>
            Ready to Start?
          </h2>
          <p style={{ marginBottom: "2rem", opacity: 0.8, lineHeight: "1.6" }}>
            • No personal information required<br/>
            • Completely anonymous and secure<br/>
            • Connect with trained volunteers<br/>
            • Available 24/7
          </p>
          
          <button 
            onClick={startSession}
            disabled={isLoading}
            style={{
              ...styles.primaryButton,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "🔄 Starting..." : "🚀 Start Anonymous Session"}
          </button>
          
          <div style={{ marginTop: "1.5rem" }}>
            <button 
              onClick={() => setIsChatbotOpen(true)}
              style={styles.secondaryButton}
            >
              💬 Chat with LumaBot First
            </button>
          </div>
        </div>

        <ChatbotWidget 
          isOpen={isChatbotOpen}
          onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
          onSessionStart={handleChatbotSessionStart}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.sessionInfo}>
        <div>
          <strong>Session ID:</strong> {session}
          <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.25rem" }}>
            Status: {sessionStatus === "waiting" ? "Waiting for counsellor" : "Active"}
          </div>
        </div>
        <div style={styles.statusIndicator}>
          <div style={counsellorConnected ? styles.onlineIndicator : styles.waitingIndicator}></div>
          {counsellorConnected ? "Counsellor Online" : "In Queue"}
        </div>
      </div>

      <div style={styles.chatContainer}>
        <div style={styles.chatHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "50%", 
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {counsellorConnected ? "👨‍⚕️" : "⏳"}
            </div>
            <div>
              <div style={{ fontWeight: "600" }}>
                {counsellorConnected ? (counsellorInfo?.name || "Counsellor") : "Waiting for Counsellor"}
              </div>
              <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                {counsellorConnected ? "Online now" : "You're in the queue"}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsChatbotOpen(true)}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              border: "none",
              color: "var(--primary-foreground)",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem"
            }}
          >
            💬 LumaBot
          </button>
        </div>

        <div style={styles.messagesArea}>
          {chatMessages.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "3rem 1rem",
              opacity: 0.6 
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
              <p>Your conversation will appear here</p>
              <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                {counsellorConnected ? 
                  "Start by saying hello!" : 
                  "A counsellor will join shortly. Feel free to start typing."
                }
              </p>
            </div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div key={idx} style={styles.message}>
                <div style={{
                  ...styles.messageContent,
                  ...(msg.sender === "counselee" ? styles.userMessage : 
                      msg.sender === "system" ? styles.systemMessage : 
                      styles.counsellorMessage)
                }}>
                  {msg.message}
                </div>
                <div style={{
                  ...styles.timestamp,
                  alignSelf: msg.sender === "counselee" ? "flex-end" : 
                           msg.sender === "system" ? "center" : "flex-start"
                }}>
                  {msg.timestamp}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <div style={styles.inputWrapper}>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={counsellorConnected ? 
                "Type your message..." : 
                "Type a message (counsellor will see it when they join)..."
              }
              style={styles.messageInput}
              rows={1}
            />
            <button 
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              style={{
                ...styles.sendButton,
                opacity: newMessage.trim() ? 1 : 0.5,
                cursor: newMessage.trim() ? "pointer" : "not-allowed"
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      <ChatbotWidget 
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
        onSessionStart={handleChatbotSessionStart}
      />
    </div>
  );
}