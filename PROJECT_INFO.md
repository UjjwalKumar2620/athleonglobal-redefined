# 🚀 Athleon Global — Project Overview

Athleon Global is a premium AI-powered athletic performance platform designed to provide elite-level coaching, video analysis, and career tracking for athletes across all disciplines.

## 🌟 Key Features

### 1. AthleonAI Coach
- **Real-time Performance Advice**: Specialized AI chatbot that understands sports context and provides actionable training tips.
- **Persistent Chat History**: Session-based memory allowing athletes to resume their coaching conversations.

### 2. Elite Performance Dashboard
- **Comprehensive Career View**: Track your personal achievements, top statistics, and season highlights in one unified view.
- **Dynamic Skill Visualization**: Modular layout for viewing recent progress and technical milestones.

### 3. AI Video Lab
- **Performance Video Uploads**: Seamless integration with the backend for secure storage and processing of training footage.
- **Automatic Analysis**: Managed video analysis workflow for identifying tactical and technical improvements.

### 4. Premium Credits System
- **Tiered Pricing**: A sophisticated "Buy AI Credits" modal with Starter, Pro, and Elite tiers.
- **Interactive UI**: Glassmorphism design and micro-interactions for a seamless purchasing experience.

### 5. High-Fidelity UI/UX
- **Modern Landing Page**: Built with advanced GSAP animations and scroll-triggered transitions.
- **Responsive Design**: Fully optimized for various viewports, from desktop to mobile.

## 🛠 Tech Stack

### Frontend Core
- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS3 (Modern Flex/Grid, Custom tokens)
- **Logic**: Vanilla JavaScript (ES6+, IIFE architecture)
- **Animations**: GSAP (GreenSock Animation Platform) & ScrollTrigger

### Backend Infrastructure
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: OpenRouter API (Access to advanced LLMs like Qwen and Llama)
- **Data & Storage**: Supabase (via @supabase/supabase-js)
- **Utilities**: Multer (File uploads), Dotenv (Config), CORS (Cross-origin security)

## 💻 Core Commands

### 📦 Installation
Initial setup requires installing dependencies for the backend services:
```bash
cd Backend
npm install
```

### 🚀 Running the Project
To run the full Athleon Global experience, you need to start the backend and frontend simultaneously:

**1. Start the Backend API (Port 3001)**
```bash
cd Backend
npm run dev   # Recommended: Start with nodemon auto-reload
# OR
npm start     # Standard production start
```

**2. Serve the Frontend (Port 8000)**
```bash
cd Frontend
python3 -m http.server 8000
```

### ⚙️ Environment Configuration
Create a `.env` file in the `Backend/` directory:
```env
PORT=3001
OPENROUTER_API_KEY=your_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
ALLOWED_ORIGIN=http://localhost:8000
```
