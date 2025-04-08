import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  useTheme,
  styled,
  CircularProgress,
  Grid,
  Snackbar,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';

const MotionPaper = motion.create(Paper);
const MotionTypography = motion.create(Typography);
const MotionButton = motion.create(Button);
const MotionBox = motion.create(Box);

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '400px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.dark,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  fontSize: '1.1rem',
  boxShadow: theme.shadows[2],
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const LogoIcon = styled(SchoolIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const theme = useTheme();

  const [login, { loading: loginLoading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      if (data.login.token) {
        localStorage.setItem('token', data.login.token);
        localStorage.setItem('user', JSON.stringify(data.login.user));
        setSnackbarMessage('Login successful! Redirecting to dashboard...');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      setError(error.message);
      setLoading(false);
      
      // Handle different types of errors
      if (error.networkError) {
        setError('Network error. Please check your connection and try again.');
        // Suggest using demo mode when network is down
        setSnackbarMessage('Network error. You can try the demo account to continue.');
        setSnackbarSeverity('warning');
        setOpenSnackbar(true);
      } else if (error.message.includes('timed out') || error.message.includes('buffering timed out')) {
        setError('Server is taking too long to respond. Please try again later or contact support.');
        // Suggest using demo mode when server is slow
        setSnackbarMessage('Server is slow. You can try the demo account to continue.');
        setSnackbarSeverity('warning');
        setOpenSnackbar(true);
      } else if (error.message.includes('users.findOne')) {
        setError('Invalid email or password.');
        setSnackbarMessage('Invalid email or password. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } else {
        setError('Login failed. Please try again.');
        setSnackbarMessage('Login failed. You can try the demo account to continue.');
        setSnackbarSeverity('warning');
        setOpenSnackbar(true);
      }
    }
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        if (userData && userData.id) {
          console.log('User already logged in, redirecting to dashboard');
          navigate('/dashboard');
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({
        variables: {
          email: formData.email,
          password: formData.password
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setSnackbarMessage(`${provider} login is not implemented yet.`);
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Add a function to handle offline mode or demo login
  const handleDemoLogin = () => {
    setLoading(true);
    setSnackbarMessage('Logging in with demo account...');
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
    
    // Simulate a successful login after a short delay
    setTimeout(() => {
      const demoUser = {
        id: 'demo-user-id',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'student',
        isEmailVerified: true,
        profileCompleted: true
      };
      
      // Set demo token and user data
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      // Set demo enrolled courses
      localStorage.setItem('enrolledCourses', JSON.stringify(['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']));
      
      // Set demo course details
      const demoCourseDetails = {
        '507f1f77bcf86cd799439011': {
          id: '507f1f77bcf86cd799439011',
          title: 'Advanced Mathematics',
          description: 'Comprehensive course covering advanced mathematical concepts.',
          class: 10,
          subject: 'Mathematics',
          isPremium: true,
          price: 999,
          enrolledAt: new Date().toISOString(),
          progress: 30,
          completedLessons: ['507f1f77bcf86cd799439021'],
          teacher: {
            id: 'demo-teacher-1',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@example.com'
          }
        },
        '507f1f77bcf86cd799439012': {
          id: '507f1f77bcf86cd799439012',
          title: 'Physics Fundamentals',
          description: 'Introduction to basic physics principles and laws.',
          class: 9,
          subject: 'Physics',
          isPremium: false,
          enrolledAt: new Date().toISOString(),
          progress: 15,
          completedLessons: [],
          teacher: {
            id: 'demo-teacher-2',
            name: 'Prof. Michael Chen',
            email: 'michael.chen@example.com'
          }
        }
      };
      localStorage.setItem('enrolledCourseDetails', JSON.stringify(demoCourseDetails));
      
      setSnackbarMessage('Demo login successful! Redirecting to dashboard...');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 1000);
  };

  // Add a function to check server status
  const checkServerStatus = async () => {
    try {
      // Simple fetch to check if server is responding
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: '{ __schema { types { name } } }'
        }),
      });
      
      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Server status check failed:', error);
      return false;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <MotionPaper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                color: 'white',
                mx: 'auto',
                mb: 2,
              }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                mb: 2,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              size="large"
              disabled={loading}
              onClick={handleDemoLogin}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                mb: 3,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              Try Demo Account
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin('Google')}
                sx={{ py: 1, borderRadius: 2 }}
              >
                Google
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => handleSocialLogin('Facebook')}
                sx={{ py: 1, borderRadius: 2 }}
              >
                Facebook
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AppleIcon />}
                onClick={() => handleSocialLogin('Apple')}
                sx={{ py: 1, borderRadius: 2 }}
              >
                Apple
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link href="/register" variant="body2" sx={{ fontWeight: 600 }}>
                Sign Up
              </Link>
            </Typography>
            <Link href="/forgot-password" variant="body2" sx={{ display: 'block', mt: 1 }}>
              Forgot password?
            </Link>
          </Box>
        </MotionPaper>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
          elevation={6}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login; 