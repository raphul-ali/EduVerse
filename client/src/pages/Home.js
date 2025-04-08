import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  useTheme,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  School as SchoolIcon,
  VideoLibrary as VideoLibraryIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
  AccessTime as AccessTimeIcon,
  MobileFriendly as MobileIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("https://images.unsplash.com/photo-1503676260728-1c00e094c0d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.1,
  },
}));

const LogoIcon = styled(SchoolIcon)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const FeatureSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)',
}));

const FeatureGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  width: '100%',
  maxWidth: 350,
  margin: '0 auto',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  color: theme.palette.primary.main,
}));

const MotionTypography = motion.create(Typography);
const MotionButton = motion.create(Button);
const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      name
      email
      role
    }
  }
`;

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: 'network-only', // Don't use cache for auth check
    onError: (error) => {
      console.error('Auth check error:', error);
      // Clear token if there's an authentication error
      if (error.message.includes('Not authenticated') || error.message.includes('Invalid token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  });

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // If there's an auth error, show the home page
  if (error) {
    console.error('Authentication error:', error);
    // Clear token if there's an authentication error
    if (error.message.includes('Not authenticated') || error.message.includes('Invalid token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    // Continue showing the home page
  }

  // If user is logged in and we have their data, don't render the home page content
  if (data?.me) {
    return null;
  }

  const features = [
    {
      icon: <SchoolIcon />,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with real-world experience',
      benefits: [
        'Certified instructors',
        'Industry-relevant curriculum',
        'Practical project work',
        'Regular Q&A sessions',
      ],
    },
    {
      icon: <VideoLibraryIcon />,
      title: 'Rich Learning Resources',
      description: 'Access comprehensive learning materials anytime, anywhere',
      benefits: [
        'HD video lectures',
        'Downloadable resources',
        'Interactive quizzes',
        'Practice exercises',
      ],
    },
    {
      icon: <AssessmentIcon />,
      title: 'Progress Tracking',
      description: 'Monitor and enhance your learning journey',
      benefits: [
        'Detailed analytics',
        'Performance reports',
        'Achievement badges',
        'Learning milestones',
      ],
    },
    {
      icon: <GroupIcon />,
      title: 'Community Learning',
      description: 'Join a vibrant community of learners',
      benefits: [
        'Discussion forums',
        'Peer reviews',
        'Group projects',
        'Networking opportunities',
      ],
    },
    {
      icon: <AccessTimeIcon />,
      title: 'Flexible Learning',
      description: 'Learn at your own pace and schedule',
      benefits: [
        'Self-paced courses',
        'Lifetime access',
        'Mobile-friendly platform',
        'Offline viewing',
      ],
    },
    {
      icon: <SecurityIcon />,
      title: 'Secure Platform',
      description: 'Your data and progress are always protected',
      benefits: [
        'SSL encryption',
        'Regular backups',
        'Privacy controls',
        'Secure payments',
      ],
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <LogoIcon />
                <MotionTypography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    background: 'linear-gradient(45deg, #fff 30%, #e0e0e0 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome to EduVerse
                </MotionTypography>
                <MotionTypography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Your gateway to quality education. Learn, grow, and succeed with our expert-led courses.
                </MotionTypography>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/register"
                    sx={{ mr: 2 }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    component={RouterLink}
                    to="/login"
                  >
                    Login
                  </Button>
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <FeatureSection>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              mb: 2,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Choose EduVerse?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Experience a revolutionary way of learning with our comprehensive platform designed to help you achieve your educational goals.
          </Typography>

          <FeatureGrid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} display="flex" justifyContent="center">
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  sx={{ width: '100%', maxWidth: 350 }}
                >
                  <MotionCard>
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                        <FeatureIcon>
                          {React.cloneElement(feature.icon, { sx: { fontSize: 32 } })}
                        </FeatureIcon>
                        <MotionTypography variant="h5" component="h3" gutterBottom>
                          {feature.title}
                        </MotionTypography>
                        <MotionTypography variant="body1" color="text.secondary" paragraph>
                          {feature.description}
                        </MotionTypography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <List dense sx={{ flexGrow: 1 }}>
                        {feature.benefits.map((benefit, idx) => (
                          <StyledListItem key={idx}>
                            <StyledListItemIcon>
                              <CheckCircleIcon />
                            </StyledListItemIcon>
                            <ListItemText primary={benefit} />
                          </StyledListItem>
                        ))}
                      </List>
                    </CardContent>
                  </MotionCard>
                </MotionBox>
              </Grid>
            ))}
          </FeatureGrid>
        </Container>
      </FeatureSection>
    </Box>
  );
};

export default Home; 