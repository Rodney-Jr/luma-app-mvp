import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../App";

const API = "/api";

export default function ChatbotWidget({ isOpen, onToggle, onSessionStart }) {
  const { theme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      message: "Hi! I'm LumaBot 🤖 I'm here to help you get started. How are you feeling today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      sender: "user",
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    const messageToSend = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Send request immediately without artificial delay
      const response = await axios.post(`${API}/chatbot/query`, {
        message: messageToSend
      });

      // Add bot response immediately
      const botMessage = {
        sender: "bot",
        message: response.data.reply,
        timestamp: new Date().toLocaleTimeString(),
        sentiment: response.data.sentiment,
        category: response.data.category,
        crisis_level: response.data.crisis_level
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Handle crisis situations
      if (response.data.crisis_level === "high") {
        setTimeout(() => {
          const crisisPrompt = {
            sender: "bot",
            message: "🚨 This seems urgent. Would you like me to start an emergency session immediately?",
            timestamp: new Date().toLocaleTimeString(),
            isSessionPrompt: true,
            isUrgent: true
          };
          setMessages(prev => [...prev, crisisPrompt]);
        }, 500);
      }
      // Check if bot suggests starting a session
      else if (response.data.suggested_actions?.includes("session_prompt") || 
               response.data.suggested_actions?.includes("recommended_session")) {
        setTimeout(() => {
          const sessionPrompt = {
            sender: "bot",
            message: "Would you like me to start an anonymous session for you? This will connect you with a trained counsellor.",
            timestamp: new Date().toLocaleTimeString(),
            isSessionPrompt: true
          };
          setMessages(prev => [...prev, sessionPrompt]);
        }, 800);
      }
      
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        sender: "bot",
        message: "I'm having a brief connection issue, but I'm still here! Please try again.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startSession = () => {
    onSessionStart();
    onToggle();
  };

  const styles = {
    widget: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 1000,
      fontFamily: "Inter, sans-serif"
    },
    toggleButton: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      transition: "all 0.3s ease",
      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)"
    },
    chatWindow: {
      position: "absolute",
      bottom: "70px",
      right: "0",
      width: "350px",
      height: "500px",
      backgroundColor: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      transform: isOpen ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? "visible" : "hidden",
      transition: "all 0.3s ease"
    },
    header: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      padding: "16px",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    messagesContainer: {
      flex: 1,
      padding: "16px",
      overflowY: "auto",
      backgroundColor: "var(--background)"
    },
    message: {
      marginBottom: "12px",
      display: "flex",
      flexDirection: "column"
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      padding: "8px 12px",
      borderRadius: "18px 18px 4px 18px",
      maxWidth: "80%",
      wordWrap: "break-word"
    },
    botMessage: {
      alignSelf: "flex-start",
      backgroundColor: "var(--secondary)",
      color: "var(--secondary-foreground)",
      padding: "8px 12px",
      borderRadius: "18px 18px 18px 4px",
      maxWidth: "80%",
      wordWrap: "break-word",
      position: "relative"
    },
    urgentMessage: {
      alignSelf: "flex-start",
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      padding: "8px 12px",
      borderRadius: "18px 18px 18px 4px",
      maxWidth: "80%",
      wordWrap: "break-word",
      border: "1px solid #fca5a5"
    },
    timestamp: {
      fontSize: "11px",
      opacity: 0.6,
      marginTop: "4px",
      alignSelf: "flex-end"
    },
    inputContainer: {
      padding: "16px",
      borderTop: "1px solid var(--border)",
      backgroundColor: "var(--background)"
    },
    inputWrapper: {
      display: "flex",
      gap: "8px",
      alignItems: "flex-end"
    },
    input: {
      flex: 1,
      padding: "8px 12px",
      border: "1px solid var(--border)",
      borderRadius: "20px",
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
      fontSize: "14px",
      resize: "none",
      minHeight: "20px",
      maxHeight: "80px"
    },
    sendButton: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      border: "none",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    sessionButton: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      border: "none",
      padding: "8px 16px",
      borderRadius: "20px",
      cursor: "pointer",
      fontSize: "12px",
      marginTop: "8px"
    },
    typing: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "8px 12px",
      backgroundColor: "var(--secondary)",
      borderRadius: "18px 18px 18px 4px",
      maxWidth: "80px"
    },
    typingDot: {
      width: "6px",
      height: "6px",
      backgroundColor: "var(--foreground)",
      borderRadius: "50%",
      opacity: 0.4,
      animation: "typing 1.4s infinite"
    }
  };

  return (
    <div style={styles.widget}>
      <style>
        {`
          @keyframes typing {
            0%, 60%, 100% { opacity: 0.4; }
            30% { opacity: 1; }
          }
          .typing-dot-1 { animation-delay: 0s; }
          .typing-dot-2 { animation-delay: 0.2s; }
          .typing-dot-3 { animation-delay: 0.4s; }
        `}
      </style>
      
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <div style={{ 
              width: "32px", 
              height: "32px", 
              backgroundColor: "rgba(255,255,255,0.2)", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              🤖
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "14px" }}>LumaBot</div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>Always here to help</div>
            </div>
          </div>

          <div style={styles.messagesContainer}>
            {messages.map((msg, idx) => (
              <div key={idx} style={styles.message}>
                <div style={
                  msg.sender === "user" ? styles.userMessage : 
                  msg.isUrgent ? styles.urgentMessage : 
                  styles.botMessage
                }>
                  {msg.message}
                  {msg.isSessionPrompt && (
                    <button 
                      onClick={startSession} 
                      style={{
                        ...styles.sessionButton,
                        backgroundColor: msg.isUrgent ? "#dc2626" : "var(--primary)",
                        animation: msg.isUrgent ? "pulse 2s infinite" : "none"
                      }}
                    >
                      {msg.isUrgent ? "🚨 Start Emergency Session" : "Start Anonymous Session"}
                    </button>
                  )}
                </div>
                <div style={{
                  ...styles.timestamp,
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start"
                }}>
                  {msg.timestamp}
                  {msg.sender === "bot" && msg.crisis_level === "high" && (
                    <span style={{ color: "#dc2626", marginLeft: "0.5rem", fontSize: "10px" }}>
                      🚨 URGENT
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={styles.message}>
                <div style={styles.typing}>
                  <div style={{...styles.typingDot}} className="typing-dot-1"></div>
                  <div style={{...styles.typingDot}} className="typing-dot-2"></div>
                  <div style={{...styles.typingDot}} className="typing-dot-3"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                style={styles.input}
                rows={1}
              />
              <button onClick={sendMessage} style={styles.sendButton}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={onToggle} style={styles.toggleButton}>
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}