# AI Feedback System

A production-style React + Vite web application for collecting and managing AI-powered feedback analysis.

## Features

### User Dashboard (`/`)
- Star rating selector (1-5 stars)
- Feedback textarea with character counter (max 2000 chars)
- Client-side validation
- AI-generated response display
- Success/error toasts

### Admin Dashboard (`/admin`)
- Protected with token authentication
- Analytics overview with rating distribution chart
- Reviews table with filtering, search, and pagination
- Auto-refresh every 5 seconds
- Responsive design (table on desktop, cards on mobile)

### Admin Login (`/admin/login`)
- Token-based authentication
- Token stored in sessionStorage

## Tech Stack

- **React 19** with Vite
- **TailwindCSS v4** for styling
- **React Router** for routing
- **React Query** for data fetching
- **Axios** for API calls
- **Recharts** for analytics charts
- **Lucide React** for icons
- **date-fns** for date formatting

## Project Structure

```
src/
├── api/                    # API layer
│   ├── axios.js           # Axios instance with interceptors
│   ├── reviewApi.js       # User review API
│   └── adminApi.js        # Admin API
├── components/
│   ├── common/            # Shared components
│   ├── layout/            # Layout components
│   └── ui/                # UI primitives (shadcn-style)
├── hooks/                  # Custom React hooks
│   ├── useTheme.jsx       # Theme management
│   ├── useToast.jsx       # Toast notifications
│   ├── useAdminAuth.js    # Admin authentication
│   └── useApi.js          # React Query hooks
├── lib/                    # Utilities
├── pages/                  # Page components
│   ├── UserDashboard.jsx
│   ├── AdminDashboard.jsx
│   └── AdminLogin.jsx
├── App.jsx                # Main app with routing
├── main.jsx               # Entry point
└── index.css              # Global styles with CSS variables
```

## Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Available Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## API Endpoints

### Public
- `POST /api/v1/reviews` - Submit a review

### Admin (requires X-ADMIN-TOKEN header)
- `GET /api/v1/admin/reviews` - List reviews with filtering
- `GET /api/v1/admin/analytics` - Get analytics data

## Theming

The app supports light and dark themes. Theme preference is persisted in localStorage.

CSS variables are defined in `src/index.css`:
- `--bg`, `--card`, `--text`, `--muted`, `--primary`, `--border`, etc.

Toggle theme using the sun/moon button in the navbar.

## Security

- Admin routes are protected
- Token stored in sessionStorage (cleared on browser close)
- 401 responses automatically redirect to login
- X-ADMIN-TOKEN header added to admin API requests
