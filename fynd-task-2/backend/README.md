# AI Feedback System - Backend

A Spring Boot application that provides an AI-powered customer feedback analysis system. The system collects customer reviews, processes them using Groq's LLM API (Llama 3.3 70B), and provides intelligent responses, summaries, and recommended actions.

## 🚀 Features

- **Review Submission**: Accept customer feedback with ratings (1-5 stars) and review text
- **AI-Powered Analysis**: Leverage Groq's Llama 3.3 70B model to:
  - Generate personalized responses to customers
  - Create concise summaries of feedback
  - Suggest actionable follow-up items
- **Admin Dashboard API**: View and manage all submitted reviews with filtering and pagination
- **Analytics**: Retrieve aggregated statistics on feedback data
- **Token-Based Admin Authentication**: Secure admin endpoints with token verification
- **CORS Support**: Configurable cross-origin resource sharing

## 🛠️ Tech Stack

- **Java 21**
- **Spring Boot 3.4.1**
- **Spring Data JPA** - Database ORM
- **MySQL** - Primary database (Aiven cloud-hosted)
- **Groq API** - LLM integration (Llama 3.3 70B Versatile)
- **Lombok** - Reduce boilerplate code
- **SpringDoc OpenAPI** - API documentation (Swagger UI)
- **Maven** - Build tool
- **Docker** - Containerization

## 📋 Prerequisites

- Java 21 or higher
- Maven 3.9+
- MySQL database
- Groq API key (get one at [groq.com](https://groq.com))

## ⚙️ Configuration

Set the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 8080) | No |
| `AIVEN_PASSWORD` | MySQL database password | Yes |
| `ADMIN_TOKEN` | Token for admin API authentication | Yes |
| `GROQ_API_KEY` | Groq API key for LLM integration | Yes |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed origins | Yes |

## 🏃 Running Locally

### Using Maven

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Set environment variables
set AIVEN_PASSWORD=your_db_password
set ADMIN_TOKEN=your_admin_token
set GROQ_API_KEY=your_groq_api_key
set CORS_ALLOWED_ORIGINS=http://localhost:3000

# Run the application
./mvnw spring-boot:run
```

### Using Docker

```bash
# Build the Docker image
docker build -t ai-feedback-backend .

# Run the container
docker run -p 8080:8080 \
  -e AIVEN_PASSWORD=your_db_password \
  -e ADMIN_TOKEN=your_admin_token \
  -e GROQ_API_KEY=your_groq_api_key \
  -e CORS_ALLOWED_ORIGINS=http://localhost:3000 \
  ai-feedback-backend
```

## 📡 API Endpoints

### Public Endpoints

#### Submit Review
```http
POST /api/v1/reviews
Content-Type: application/json

{
  "rating": 4,
  "review": "Great product! Really enjoyed using it."
}
```

**Response:**
```json
{
  "id": 1,
  "rating": 4,
  "reviewText": "Great product! Really enjoyed using it.",
  "aiUserResponse": "Thank you for your wonderful feedback!...",
  "aiSummary": "Customer expressed satisfaction with the product...",
  "aiRecommendedActions": ["Continue providing quality products", "..."],
  "status": "SUCCESS",
  "createdAt": "2026-01-19T10:30:00"
}
```

### Admin Endpoints (Require `X-Admin-Token` header)

#### Get Reviews
```http
GET /api/v1/admin/reviews?rating=5&limit=50&offset=0&search=great
X-Admin-Token: your_admin_token
```

**Query Parameters:**
| Parameter | Description | Default |
|-----------|-------------|---------|
| `rating` | Filter by rating (1-5) | - |
| `limit` | Number of results | 50 |
| `offset` | Pagination offset | 0 |
| `search` | Search in review text | - |

#### Get Analytics
```http
GET /api/v1/admin/analytics
X-Admin-Token: your_admin_token
```

**Response:**
```json
{
  "total": 150,
  "countByRating": {
    "1": 10,
    "2": 15,
    "3": 25,
    "4": 50,
    "5": 50
  }
}
```

## 📖 API Documentation

Once the application is running, access the Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

## 🗂️ Project Structure

```
src/main/java/com/fynd/task2/
├── Task2Application.java       # Main application entry point
├── config/                     # Configuration classes
│   └── WebConfig.java          # CORS configuration
├── controller/                 # REST controllers
│   ├── AdminController.java    # Admin endpoints
│   └── ReviewController.java   # Review submission endpoint
├── dto/                        # Data Transfer Objects
│   ├── ReviewRequestDto.java
│   ├── ReviewResponseDto.java
│   ├── AdminReviewItemDto.java
│   ├── AdminReviewListResponseDto.java
│   ├── AnalyticsResponseDto.java
│   └── ErrorResponseDto.java
├── entity/                     # JPA entities
│   ├── ReviewSubmission.java
│   └── SubmissionStatus.java
├── exception/                  # Exception handlers
├── llm/                        # LLM integration
│   ├── GroqClient.java         # Groq API client
│   ├── GroqResponseDto.java
│   └── GroqResult.java
├── repository/                 # JPA repositories
├── security/                   # Security components
│   └── AdminTokenInterceptor.java
└── service/                    # Business logic
    ├── AdminService.java
    └── ReviewService.java
```

## 🔒 Security

- Admin endpoints are protected with token-based authentication
- Database credentials are managed via environment variables
- CORS is configured to allow only specified origins

## 🧪 Testing

```bash
# Run tests
./mvnw test
```

## 📦 Building

```bash
# Build JAR
./mvnw clean package -DskipTests

# The JAR will be created at target/task2-0.0.1-SNAPSHOT.jar
```

## 🐳 Docker Build

```bash
# Multi-stage build (builds and creates optimized image)
docker build -t ai-feedback-backend .
```

## 📝 License

This project is part of Fynd Task 2.

---

Made with ❤️ using Spring Boot and Groq AI

