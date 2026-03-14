# ZenFit Frontend

The ZenFit frontend is a React + TypeScript application for fitness, nutrition, and wellness tracking.

## Stack

- React 18
- TypeScript
- Material UI
- Axios
- Recharts

## Main Screens

- Login and Register
- Home Dashboard
- Workout Tracker and Workout Calendar
- Nutrition Tracker
- Wellness Tracker
- Profile
- Analytics

## Folder Structure

```text
front/
├─ public/
├─ src/
│  ├─ components/
│  ├─ contexts/
│  ├─ pages/
│  └─ services/
├─ package.json
└─ tsconfig.json
```

## API Integration

Axios base URL is configured in src/services/api.ts:

- http://localhost:5000/api

Make sure backend is running before using authenticated features.

## Scripts

In the front directory:

```bash
npm install
npm start
```

Other useful scripts:

- npm test
- npm run build

## Notes

- Authentication token is stored in localStorage.
- Route protection is handled via ProtectedRoute.
- Some backup or experimental page files exist in src/pages.

## Project-Level Documentation

For full-stack setup (frontend + backend), see the root documentation:

- ../README.md
