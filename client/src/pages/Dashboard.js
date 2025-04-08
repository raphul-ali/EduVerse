import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Paper,
  CardMedia,
  CardActions,
  Chip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { gql } from '@apollo/client';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PublicIcon from '@mui/icons-material/Public';
import TranslateIcon from '@mui/icons-material/Translate';
import ComputerIcon from '@mui/icons-material/Computer';
import SportsIcon from '@mui/icons-material/Sports';
import PaletteIcon from '@mui/icons-material/Palette';
import SchoolIcon from '@mui/icons-material/School';

const GET_USER_COURSES = gql`
  query GetUserCourses {
    me {
      id
      name
      email
      role
      courses {
        id
        title
        description
        isPremium
        teacher {
          name
        }
      }
    }
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_USER_COURSES, {
    onError: (error) => {
      console.error('Dashboard query error:', error);
      if (error.message.includes('Not authenticated')) {
        // Check if this is a demo user
        const token = localStorage.getItem('token');
        if (token === 'demo-token') {
          // For demo user, don't redirect to login
          return;
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // For demo user, use localStorage data instead of GraphQL data
  const isDemoUser = localStorage.getItem('token') === 'demo-token';
  
  if (loading && !isDemoUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !isDemoUser) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error: {error.message}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  // Get user data from localStorage for demo user
  let userData;
  if (isDemoUser) {
    const userJson = localStorage.getItem('user');
    userData = userJson ? JSON.parse(userJson) : null;
    
    if (!userData) {
      return (
        <Container>
          <Typography variant="h6">
            Demo user data not found. Please log in again.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Container>
      );
    }
  } else if (!data || !data.me) {
    return (
      <Container>
        <Typography variant="h6">
          No user data found. Please log in again.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  // Get courses data
  let courses = [];
  if (isDemoUser) {
    // Get enrolled courses from localStorage for demo user
    const enrolledCoursesJson = localStorage.getItem('enrolledCourses');
    const enrolledCourses = enrolledCoursesJson ? JSON.parse(enrolledCoursesJson) : [];
    
    const courseDetailsJson = localStorage.getItem('enrolledCourseDetails');
    const courseDetails = courseDetailsJson ? JSON.parse(courseDetailsJson) : {};
    
    courses = enrolledCourses.map(courseId => courseDetails[courseId] || { id: courseId });
  } else {
    // For regular users, check localStorage first, then fall back to GraphQL data
    const enrolledCoursesJson = localStorage.getItem('enrolledCourses');
    const enrolledCourses = enrolledCoursesJson ? JSON.parse(enrolledCoursesJson) : [];
    
    const courseDetailsJson = localStorage.getItem('enrolledCourseDetails');
    const courseDetails = courseDetailsJson ? JSON.parse(courseDetailsJson) : {};
    
    if (enrolledCourses.length > 0) {
      courses = enrolledCourses.map(courseId => courseDetails[courseId] || { id: courseId });
    } else {
      courses = data.me.courses || [];
    }
  }

  const { role } = isDemoUser ? userData : data.me;

  // Function to get the appropriate icon for a subject
  const getSubjectIcon = (subject) => {
    switch (subject?.toLowerCase()) {
      case 'mathematics':
        return <CalculateIcon sx={{ fontSize: 40, color: '#2196F3' }} />;
      case 'science':
        return <ScienceIcon sx={{ fontSize: 40, color: '#4CAF50' }} />;
      case 'english':
        return <MenuBookIcon sx={{ fontSize: 40, color: '#9C27B0' }} />;
      case 'social studies':
        return <PublicIcon sx={{ fontSize: 40, color: '#FF9800' }} />;
      case 'hindi':
        return <TranslateIcon sx={{ fontSize: 40, color: '#F44336' }} />;
      case 'computer science':
        return <ComputerIcon sx={{ fontSize: 40, color: '#607D8B' }} />;
      case 'physical education':
        return <SportsIcon sx={{ fontSize: 40, color: '#795548' }} />;
      case 'art':
        return <PaletteIcon sx={{ fontSize: 40, color: '#E91E63' }} />;
      default:
        return <SchoolIcon sx={{ fontSize: 40, color: '#3f51b5' }} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography
          variant="h3"
          sx={{ 
            fontWeight: 'bold', 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {role === 'teacher' ? 'My Courses' : 'Enrolled Courses'}
        </Typography>
        <Box>
          {role === 'teacher' ? (
            <>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/teacher-courses"
                sx={{ mr: 2, borderRadius: 2, textTransform: 'none', fontWeight: 'medium' }}
              >
                Browse My Courses
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/create-course"
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'medium' }}
              >
                Create New Course
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/courses"
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'medium' }}
            >
              Browse All Courses
            </Button>
          )}
        </Box>
      </Box>

      {courses.length === 0 ? (
        <Paper 
          elevation={3} 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 2,
            borderRadius: 2,
            background: 'rgba(30, 30, 30, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            color: 'white'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
            {role === 'teacher' 
              ? 'You haven\'t created any courses yet.' 
              : 'You haven\'t enrolled in any courses yet.'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
            {role === 'teacher' 
              ? 'Start by creating your first course.' 
              : 'Browse our available courses to get started.'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
              <Card
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                  },
                  background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  maxWidth: '320px',
                  mx: 'auto',
                }}
              >
                <Box 
                  sx={{ 
                    height: '160px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {getSubjectIcon(course.subject)}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'white',
                      mb: 1,
                      fontSize: '1.1rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {course.title}
                  </Typography>
                  <Typography 
                    gutterBottom 
                    sx={{ 
                      fontSize: '0.9rem',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: '1rem' }} />
                    {course.teacher?.name || 'Unknown Teacher'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    paragraph 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {course.description}
                  </Typography>
                  {course.isPremium && (
                    <Chip
                      icon={<StarIcon />}
                      label="Premium"
                      color="warning"
                      size="small"
                      sx={{ 
                        mb: 2,
                        fontWeight: 'medium',
                        backgroundColor: 'rgba(255, 167, 38, 0.2)',
                        color: '#ffa726',
                        '& .MuiChip-icon': {
                          color: '#ffa726',
                        },
                      }}
                    />
                  )}
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={RouterLink}
                    to={`/course/${course.id}`}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      py: 1,
                      background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                      boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #303f9f 30%, #3949ab 90%)',
                      },
                    }}
                  >
                    View Course
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard; 