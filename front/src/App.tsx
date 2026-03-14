import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import WorkoutTracker from './pages/WorkoutTracker';
import NutritionTracker from './pages/NutritionTracker';
import WellnessTracker from './pages/WellnessTracker';
import Profile from './pages/Profile';
import PersonalizedWorkout from './pages/PersonalizedWorkout';
import Analytics from './pages/Analytics';
import WorkoutCalendar from './pages/WorkoutCalendar';
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/workouts" 
            element={
              <ProtectedRoute>
                <Layout>
                  <WorkoutTracker />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/nutrition" 
            element={
              <ProtectedRoute>
                <Layout>
                  <NutritionTracker />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wellness" 
            element={
              <ProtectedRoute>
                <Layout>
                  <WellnessTracker />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/personalized-workout" 
            element={
              <ProtectedRoute>
                <Layout>
                  <PersonalizedWorkout />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/workouts/calendar" 
            element={
              <ProtectedRoute>
                <Layout>
                  <WorkoutCalendar />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
