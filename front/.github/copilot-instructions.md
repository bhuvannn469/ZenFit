<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# React Login Page

This workspace contains a React frontend with a login page that includes:

- Username and password authentication
- Google login integration
- New user registration
- Password reset functionality

The project is built with React, TypeScript, Material UI, and Firebase Authentication.

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components (Login, Register, Home)
- `/src/services` - Service modules (auth, firebase)

## Key Files

- `src/App.tsx` - Main application component with routing
- `src/pages/Login.tsx` - Login page with email/password and Google authentication
- `src/pages/Register.tsx` - Registration page for new users
- `src/pages/Home.tsx` - Home page shown after successful authentication
- `src/services/firebase.ts` - Firebase configuration and initialization
- `src/services/auth.ts` - Authentication service methods
