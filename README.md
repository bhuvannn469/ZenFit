# ZenFit

ZenFit is a full-stack fitness and wellness tracker with a React frontend and a Node.js/Express backend.

This repository contains:
- A frontend app for authentication, dashboards, workout and wellness tracking.
- A backend API with JWT authentication and MongoDB persistence.

## Project Structure

```
webpage/
  backend/
    backend/
      config/
      controllers/
      middleware/
      models/
      routes/
      server.js
      package.json
  front/
    src/
      components/
      contexts/
      pages/
      services/
    public/
    package.json
  start.bat
```

## Tech Stack

- Frontend: React, TypeScript, Material UI, Axios, Recharts
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, CORS

## Features

- User registration and login
- Protected frontend routes
- Workout tracking and workout calendar
- Nutrition tracking
- Wellness tracking
- Profile management
- Analytics pages and dashboards

## API Modules

The backend exposes routes under `/api`:

- `/api/auth`
- `/api/workouts`
- `/api/stats`
- `/api/goals`
- `/api/friends`
- `/api/leaderboard`
- `/api/nutrition`
- `/api/wellness`
- `/api/users`

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or hosted)

## Environment Variables

Create `webpage/backend/backend/.env` with:

```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000
```

## Installation

From `webpage/`:

1. Install frontend dependencies:

   ```bash
   cd front
   npm install
   ```

2. Install backend dependencies:

   ```bash
   cd ../backend/backend
   npm install
   ```

## Running Locally

Start backend:

```bash
cd webpage/backend/backend
npm run dev
```

Start frontend:

```bash
cd webpage/front
npm start
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

Note: The frontend API client currently points to `http://localhost:5000/api`.

## Scripts

Frontend (`webpage/front`):
- `npm start`
- `npm run build`
- `npm test`

Backend (`webpage/backend/backend`):
- `npm start`
- `npm run dev`

## Notes

- Do not commit `.env` files.
- The project contains backup and experimental files under frontend pages; production code should prefer the main page files.

## License

No license has been defined for this project yet.