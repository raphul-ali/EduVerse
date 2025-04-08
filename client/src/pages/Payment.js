import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Paper,
} from '@mui/material';
import { dummyCourses } from './Courses';
import { ENROLL_COURSE } from '../graphql/mutations';
import { GET_COURSES } from '../graphql/queries';

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [enrollCourse] = useMutation(ENROLL_COURSE);

  useEffect(() => {
    // Find the course from dummy data
    const foundCourse = dummyCourses.find(c => c.id === courseId);
    if (foundCourse) {
      if (!foundCourse.isPremium) {
        // Redirect back to courses if someone tries to access payment page for a free course
        navigate('/courses');
        return;
      }
      setCourse(foundCourse);
    } else {
      setError('Course not found');
    }
    setLoading(false);
  }, [courseId, navigate]);

  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      setError(null);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Enroll in the course after successful payment
      await enrollCourse({
        variables: { courseId: course.id },
        refetchQueries: [{ query: GET_COURSES }],
      });

      // Get existing enrolled courses from localStorage
      const existingEnrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      
      // Add the new course to enrolled courses if not already enrolled
      if (!existingEnrolledCourses.includes(course.id)) {
        const updatedEnrolledCourses = [...existingEnrolledCourses, course.id];
        localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses));
        
        // Also store course details for quick access
        const enrolledCourseDetails = JSON.parse(localStorage.getItem('enrolledCourseDetails') || '{}');
        enrolledCourseDetails[course.id] = {
          ...course,
          enrolledAt: new Date().toISOString(),
          progress: 0,
          completedLessons: [],
          teacher: course.teacher || { name: 'Unknown Teacher' }
        };
        localStorage.setItem('enrolledCourseDetails', JSON.stringify(enrolledCourseDetails));
      }

      // Simulate successful payment
      console.log('Payment successful for course:', course.title);
      navigate('/dashboard');
    } catch (error) {
      setError('Payment failed. Please try again.');
      setProcessingPayment(false);
      console.error('Payment error:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/courses')}
          sx={{ mt: 2 }}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 4,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          Complete Your Purchase
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Course: {course.title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Price: ₹{course.price}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This is a test payment flow. Click "Proceed to Pay" to simulate a successful payment.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/courses')}
            disabled={processingPayment}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            disabled={processingPayment}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            {processingPayment ? <CircularProgress size={24} /> : 'Proceed to Pay'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Payment; 