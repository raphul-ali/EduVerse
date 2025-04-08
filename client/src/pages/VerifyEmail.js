import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
  CircularProgress,
  useTheme,
  styled,
} from '@mui/material';
import { gql } from '@apollo/client';
import { motion } from 'framer-motion';

const MotionPaper = motion.create(Paper);

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '500px',
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
}));

const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const [verifyEmail] = useMutation(VERIFY_EMAIL_MUTATION, {
    onCompleted: (data) => {
      setLoading(false);
      if (data.verifyEmail.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.verifyEmail.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setError(error.message);
    },
  });

  useEffect(() => {
    if (token) {
      setLoading(true);
      verifyEmail({ variables: { token } });
    } else {
      setError('No verification token found');
    }
  }, [token, verifyEmail]);

  return (
    <StyledContainer>
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        component={StyledPaper}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
          }}
        >
          Email Verification
        </Typography>

        {loading && (
          <Box my={3}>
            <CircularProgress />
            <Typography variant="body1" mt={2}>
              Verifying your email...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Email verified successfully! Redirecting to login...
          </Alert>
        )}

        {!token && !loading && (
          <Box mt={3}>
            <Typography variant="body1" gutterBottom>
              Please check your email for the verification link.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        )}
      </MotionPaper>
    </StyledContainer>
  );
};

export default VerifyEmail; 