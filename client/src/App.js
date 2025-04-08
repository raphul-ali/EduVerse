import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import client from './apollo/client';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import TeacherCourses from './pages/TeacherCourses';
import Course from './pages/Course';
import Lecture from './pages/Lecture';
import Payment from './pages/Payment';
import CreateCourse from './pages/CreateCourse';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route component to check user role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isDemoUser = localStorage.getItem('token') === 'demo-token';
  
  if (!user && !isDemoUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role) && !isDemoUser) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Courses />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher-courses" 
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherCourses />
                </ProtectedRoute>
              } 
            />
            <Route path="/course/:id" element={<Course />} />
            <Route path="/payment/:courseId" element={<Payment />} />
            <Route path="/lecture/:id" element={<Lecture />} />
            <Route 
              path="/create-course" 
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <CreateCourse />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
