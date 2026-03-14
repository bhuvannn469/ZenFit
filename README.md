# ZenFit

<p align="center">
  <img src="./ZenFit.png" alt="ZenFit Banner" width="100%" />
</p>

<p align="center">
  <strong>Track workouts, nutrition, and wellness in one place.</strong>
</p>

<p align="center">
  <img alt="Frontend" src="https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61dafb?style=for-the-badge&logo=react&logoColor=white">
  <img alt="Backend" src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white">
  <img alt="Database" src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
  <img alt="Auth" src="https://img.shields.io/badge/Auth-JWT-f59e0b?style=for-the-badge">
</p>

ZenFit is a full-stack fitness platform designed to help users build consistent healthy habits.
It combines workout logging, nutrition monitoring, wellness tracking, and progress analytics in a single web app.

## Why ZenFit

- Unified health dashboard for workouts, meals, and wellness metrics
- JWT-based authentication with protected app routes
- Modular backend architecture for easy feature expansion
- Frontend built with reusable service and component patterns
- Ready for local development with separate frontend and backend processes

## Feature Highlights

### Core User Flow

- Register and login securely
- Access authenticated pages only after login
- Manage user profile and personal details

### Fitness and Activity

- Track workouts
- Visualize workout activity with calendar views
- Set and monitor goals

### Nutrition and Wellness

- Track nutrition records
- Track wellness entries
- View health trends through analytics pages

### Social and Progress

- Friends and leaderboard modules
- Stats endpoints for summary insights

## Tech Stack

### Frontend

- React 18 + TypeScript
- Material UI + Emotion
- Axios for API requests
- Recharts for data visualization

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs for auth and password security
- CORS + dotenv middleware stack

## Repository Layout

```text
webpage/
├─ front/                    # React + TypeScript client
│  ├─ src/
│  │  ├─ components/
│  │  ├─ contexts/
│  │  ├─ pages/
│  │  └─ services/
│  └─ package.json
├─ backend/
│  └─ backend/               # Express API server
│     ├─ config/
│     ├─ controllers/
│     ├─ middleware/
│     ├─ models/
│     ├─ routes/
│     ├─ server.js
│     └─ package.json
├─ ZenFit.png
└─ start.bat
```

## API Surface

All backend routes are mounted under /api.

| Module | Base Route | Purpose |
|---|---|---|
| Auth | /api/auth | Register, login, profile auth operations |
| Workouts | /api/workouts | Workout create/read/update flows |
| Stats | /api/stats | Aggregated dashboard metrics |
| Goals | /api/goals | User goal management |
| Friends | /api/friends | Social/friend relationships |
| Leaderboard | /api/leaderboard | Ranking and progress comparisons |
| Nutrition | /api/nutrition | Nutrition logging and history |
| Wellness | /api/wellness | Wellness tracking entries |
| Users | /api/users | User-level data operations |

## Local Development Setup

### 1. Prerequisites

- Node.js 18 or later
- npm 9 or later
- MongoDB instance (local or cloud)

### 2. Configure Environment Variables

Create file: backend/backend/.env

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

### 3. Install Dependencies

Frontend:

```bash
cd front
npm install
```

Backend:

```bash
cd ../backend/backend
npm install
```

### 4. Run the Application

Start backend server:

```bash
cd backend/backend
npm run dev
```

Start frontend app (separate terminal):

```bash
cd front
npm start
```

### 5. Open in Browser

- Frontend: http://localhost:3000
- Backend health route: http://localhost:5000

Current frontend API base URL is configured as:

- http://localhost:5000/api

## Available Scripts

### Frontend (front)

- npm start
- npm run build
- npm test

### Backend (backend/backend)

- npm start
- npm run dev

## Project Notes

- Keep .env files out of version control.
- Repository currently includes some backup/experimental page variants in front/src/pages.
- Production cleanup can remove unused backup files once final pages are confirmed.

## Security Practices

### Secret Handling

- Never commit real API keys, tokens, or passwords.
- Keep real values only in local env files such as front/.env.local and backend/backend/.env.
- Use templates (for example front/.env.example) for variable names only.
- If a secret is exposed, rotate it immediately and rewrite history.

### Pre-commit Secret Scanning

This repository uses Husky with a pre-commit scanner:

- Hook file: .husky/pre-commit
- Scanner script: scripts/secret-scan.js

To verify manually before committing:

```bash
npm run secret-scan
```

### GitHub Push Protection

Enable Push Protection in repository settings:

1. Open GitHub repository Settings.
2. Go to Security > Code security and analysis.
3. Enable Secret scanning.
4. Enable Push protection.

This blocks pushes that contain known secret patterns.

## Contribution

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

No explicit license file is present yet.
Add a LICENSE file before public distribution if needed.