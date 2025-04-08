import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { dummyCourses } from './Courses';

const MotionCard = motion.create(Card);

const Course = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSection, setSelectedSection] = useState('overview');
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // Find the course from dummy data
    const foundCourse = dummyCourses.find(c => c.id === id);
    setCourse(foundCourse);
  }, [id]);

  const handleSectionChange = (event, newValue) => {
    setSelectedSection(newValue);
  };

  const handleBack = () => {
    navigate('/courses');
  };

  if (!course) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Course not found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
      py: 3
    }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component="button"
            onClick={handleBack}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <ArrowBackIcon sx={{ mr: 0.5 }} />
            Back to Courses
          </Link>
          <Typography color="text.primary">{course.title}</Typography>
        </Breadcrumbs>

        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1
                  }}
                >
                  {course.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Chip
                    icon={<SchoolIcon />}
                    label={`Class ${course.class}`}
                    color="primary"
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      color: 'primary.main',
                      fontWeight: 500
                    }}
                  />
                  {course.isPremium && (
                    <Chip
                      label="Premium Course"
                      color="warning"
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Box>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Teacher: {course.teacher.name}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => navigate(`/payment/${course.id}`)}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1
                }}
              >
                {course.isPremium ? `Buy Now (₹${course.price})` : 'Enroll Now (Free)'}
              </Button>
            </Box>

            <Typography 
              variant="body1" 
              paragraph 
              sx={{ 
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'text.secondary',
                mb: 3
              }}
            >
              {course.description}
            </Typography>

            <Tabs 
              value={selectedSection} 
              onChange={handleSectionChange}
              sx={{ 
                mb: 3,
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: 100
                }
              }}
            >
              <Tab label="Overview" value="overview" />
              <Tab label="Syllabus" value="syllabus" />
              <Tab label="Learning Outcomes" value="outcomes" />
              <Tab label="Requirements" value="requirements" />
            </Tabs>

            {selectedSection === 'overview' && (
              <Box>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 2
                  }}
                >
                  Course Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        height: '100%'
                      }}
                    >
                      <Typography 
                        variant="subtitle1" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 1
                        }}
                      >
                        Course Details
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Class Level" 
                            secondary={`Class ${course.class}`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Subject" 
                            secondary={course.subject} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Course Type" 
                            secondary={course.isPremium ? "Premium Course" : "Free Course"} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Price" 
                            secondary={course.isPremium ? `₹${course.price}` : "Free"} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Teacher" 
                            secondary={course.teacher.name} 
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        height: '100%'
                      }}
                    >
                      <Typography 
                        variant="subtitle1" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 1
                        }}
                      >
                        Course Highlights
                      </Typography>
                      <List dense>
                        {course.syllabus.slice(0, 3).map((item, index) => (
                          <ListItem key={index}>
                            <FiberManualRecordIcon 
                              sx={{ 
                                fontSize: 8, 
                                mr: 1.5, 
                                color: 'primary.main' 
                              }} 
                            />
                            <ListItemText 
                              primary={item.topic} 
                              secondary={`${item.duration}`} 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {selectedSection === 'syllabus' && (
              <Box>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 2
                  }}
                >
                  Course Syllabus
                </Typography>
                <Grid container spacing={2}>
                  {course.syllabus.map((item, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2,
                          height: '100%',
                          borderRadius: 2,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <Typography 
                          variant="subtitle1" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 600,
                            color: 'text.primary'
                          }}
                        >
                          {item.topic}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          paragraph
                        >
                          {item.description}
                        </Typography>
                        <Chip
                          label={item.duration}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(0, 0, 0, 0.05)',
                            color: 'text.secondary'
                          }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {selectedSection === 'outcomes' && (
              <Box>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 2
                  }}
                >
                  What You'll Learn
                </Typography>
                <Grid container spacing={1.5}>
                  {course.whatYouWillLearn.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.02)'
                      }}>
                        <CheckCircleIcon 
                          sx={{ 
                            fontSize: 18, 
                            mr: 1.5, 
                            color: 'primary.main' 
                          }} 
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: 'text.primary'
                          }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {selectedSection === 'requirements' && (
              <Box>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 2
                  }}
                >
                  Requirements
                </Typography>
                <List dense>
                  {course.requirements.map((item, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <FiberManualRecordIcon 
                        sx={{ 
                          fontSize: 8, 
                          mr: 1.5, 
                          color: 'primary.main' 
                        }} 
                      />
                      <ListItemText 
                        primary={item}
                        sx={{ 
                          '& .MuiListItemText-primary': {
                            color: 'text.secondary',
                            fontSize: '0.9rem'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </CardContent>
        </MotionCard>
      </Container>
    </Box>
  );
};

export default Course; 