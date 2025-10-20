# Luma — MVP

Minimal viable product connecting volunteer counsellors to anonymous counselees.

## 🚀 Quick Start

### Option 1: One-Click Start (Recommended)
```powershell
.\start_mvp.ps1
```

This script will:
- Set up the environment
- Install dependencies  
- Start both backend (port 8000) and frontend (port 3000)

### Option 2: Manual Start

#### Backend

## 🌟 Features

### For Counselees (People Seeking Help)
- **Anonymous Sessions**: No personal information required
- **LumaBot**: AI assistant for initial guidance and triage
- **Real-time Chat**: Connect with volunteer counsellors
- **Multiple Categories**: Mental health, relationships, academic, career support

### For Counsellors (Volunteers)
- **Easy Registration**: Simple form to become a volunteer
- **Dashboard**: View available and active sessions
- **Category Selection**: Choose your areas of expertise
- **Session Management**: Accept and manage counseling sessions

## 🏗️ Architecture

- **Backend**: FastAPI with SQLite database
- **Frontend**: React with Vite
- **Database**: SQLite (file-based, no setup required)
- **Deployment**: Docker containers ready for production

## 📱 Usage

1. **Visit** http://localhost:3000
2. **Get Help**: Click "Get Help" to start an anonymous session
3. **Volunteer**: Click "Volunteer" to register as a counsellor
4. **Chat**: Use LumaBot for immediate guidance or wait for a counsellor

## 🔧 Development

### API Documentation
Visit http://localhost:8000/docs for interactive API documentation

### Database
SQLite database is created automatically at `./data/luma.sqlite3`

### Testing
```powershell
& .\.venv\Scripts\Activate.ps1
pytest -q
```

## 🚢 Deployment

See `deployment/` folder for Docker and production deployment configurations.

## 📋 Roadmap

- [ ] Real-time messaging with WebSockets
- [ ] Counsellor availability scheduling  
- [ ] Session ratings and feedback
- [ ] Advanced LLM integration for better triage
- [ ] Mobile app support