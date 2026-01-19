# AI Feedback System

A full-stack AI-powered customer feedback analysis system that collects reviews, processes them using Groq's LLM (Llama 3.3 70B), and provides intelligent responses, summaries, and recommended actions.

## 🏗️ Project Structure

```
fynd-task-2/
├── backend/     # Spring Boot REST API
├── frontend/    # React + Vite SPA
└── README.md
```

## ✨ Features

- **Review Submission** - Users can submit feedback with 1-5 star ratings
- **AI Analysis** - Leverages Groq's Llama 3.3 70B for intelligent response generation
- **Admin Dashboard** - Protected dashboard with analytics, filtering, and review management
- **Real-time Updates** - Auto-refresh functionality for live data

## 🛠️ Tech Stack

| Frontend | Backend |
|----------|---------|
| React 19 + Vite | Java 21 + Spring Boot 3.4 |
| TailwindCSS v4 | Spring Data JPA |
| React Query | MySQL (Aiven) |
| Recharts | Groq API |

## 🚀 Quick Start

### Prerequisites
- Java 21+
- MySQL database
- Groq API key

### Backend
```bash
cd backend
# Set environment variables (AIVEN_PASSWORD, ADMIN_TOKEN, GROQ_API_KEY, CORS_ALLOWED_ORIGINS)
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📚 Documentation

- [Backend README](./backend/README.md) - API endpoints, configuration, Docker setup
- [Frontend README](./frontend/README.md) - Components, hooks, theming

## 🔑 Environment Variables

See individual READMEs for complete configuration details:
- Backend: `AIVEN_PASSWORD`, `ADMIN_TOKEN`, `GROQ_API_KEY`, `CORS_ALLOWED_ORIGINS`
- Frontend: `VITE_API_BASE_URL`
