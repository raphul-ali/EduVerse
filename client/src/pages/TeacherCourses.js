import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Science as ScienceIcon,
  Calculate as CalculateIcon,
  Language as LanguageIcon,
  History as HistoryIcon,
  Psychology as PsychologyIcon,
  Public as PublicIcon,
  Code as CodeIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const GET_TEACHER_COURSES = gql`
  query GetTeacherCourses {
    me {
      id
      name
      email
      role
      courses {
        id
        title
        description
        class
        subject
        isPremium
        teacher {
          id
          name
          email
        }
        students {
          id
          name
          email
        }
        lectures {
          id
          title
        }
        syllabus {
          topic
          description
          duration
        }
        createdAt
        updatedAt
      }
    }
  }
`;

const TeacherCourses = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { loading, error, data } = useQuery(GET_TEACHER_COURSES, {
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Error fetching teacher courses:', error);
      if (error.message.includes('Not authenticated')) {
        navigate('/login');
        return;
      }
      setSnackbar({
        open: true,
        message: 'Error loading courses. Please try again.',
        severity: 'error'
      });
    }
  });

  const handleCreateCourse = () => {
    navigate('/create-course');
  };

  const handleEditCourse = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleViewStudents = (courseId) => {
    navigate(`/course-students/${courseId}`);
  };

  const handleDeleteCourse = async (courseId) => {
    // TODO: Implement delete course mutation
    setSnackbar({
      open: true,
      message: 'Course deleted successfully',
      severity: 'success'
    });
  };

  const getSubjectIcon = (subject) => {
    const icons = {
      'Mathematics': <CalculateIcon />,
      'Science': <ScienceIcon />,
      'English': <LanguageIcon />,
      'History': <HistoryIcon />,
      'Geography': <PublicIcon />,
      'Computer Science': <CodeIcon />,
      'Psychology': <PsychologyIcon />,
      'default': <BookIcon />
    };
    return icons[subject] || icons.default;
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': theme.palette.primary.main,
      'Science': theme.palette.success.main,
      'English': theme.palette.info.main,
      'History': theme.palette.warning.main,
      'Geography': theme.palette.error.main,
      'Computer Science': theme.palette.secondary.main,
      'Psychology': theme.palette.primary.dark,
      'default': theme.palette.grey[500]
    };
    return colors[subject] || colors.default;
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading your courses...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading courses: {error.message}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const courses = data?.me?.courses || [];
  const filteredCourses = courses.filter(course => {
    const matchesClass = selectedClass === 'all' || course.class === selectedClass;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          My Courses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCourse}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1
          }}
        >
          Create New Course
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Tabs
          value={selectedClass}
          onChange={(e, newValue) => setSelectedClass(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 3
          }}
        >
          <Tab label="All Classes" value="all" />
          <Tab label="Class 8" value="8" />
          <Tab label="Class 9" value="9" />
          <Tab label="Class 10" value="10" />
        </Tabs>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
      </Box>

      {filteredCourses.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2
        }}>
          <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No courses found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery || selectedClass !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first course to get started'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCourse}
            sx={{ borderRadius: 2 }}
          >
            Create New Course
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      p: 1,
                      borderRadius: 1,
                      bgcolor: alpha(getSubjectColor(course.subject), 0.1),
                      color: getSubjectColor(course.subject),
                      mr: 1
                    }}>
                      {getSubjectIcon(course.subject)}
                    </Box>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {course.title}
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={`Class ${course.class}`}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {course.students?.length || 0} students enrolled
                    </Typography>
                    {course.isPremium && (
                      <Chip
                        label="Premium"
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<PeopleIcon />}
                    onClick={() => handleViewStudents(course.id)}
                  >
                    Students
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditCourse(course.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeacherCourses; 