import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  styled,
  useTheme,
  Container,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 500,
}));

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isAuthenticated = !!token;
  const isDemoUser = token === 'demo-token';
  const userRole = user?.role || (isDemoUser ? 'student' : null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('enrolledCourses');
    localStorage.removeItem('enrolledCourseDetails');
    window.location.href = '/login';
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        zIndex: 1100
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '64px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '1.5rem',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <SchoolIcon sx={{ fontSize: '2rem' }} />
              EduVaerse
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {token ? (
              <>
                {userRole === 'student' && (
                  <NavButton
                    component={RouterLink}
                    to="/courses"
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '1rem',
                      px: 2
                    }}
                  >
                    Courses
                  </NavButton>
                )}
                <NavButton
                  component={RouterLink}
                  to="/dashboard"
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    px: 2
                  }}
                >
                  Dashboard
                </NavButton>
                <Button
                  color="primary"
                  onClick={handleLogout}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    px: 2,
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.08)'
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    px: 2
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/register"
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    px: 2,
                    borderRadius: 2
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 