import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { gql } from '@apollo/client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { styled } from '@mui/material/styles';

const LectureCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingBottom: '56.25%', // 16:9 aspect ratio
  height: 0,
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  '& iframe': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
}));

const PDFContainer = styled(Box)(({ theme }) => ({
  height: '600px',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  marginTop: theme.spacing(3),
  '& iframe': {
    border: 'none',
  },
}));

const GET_LECTURE = gql`
  query GetLecture($id: ID!) {
    lecture(id: $id) {
      id
      title
      videoUrl
      pdfUrl
      course {
        id
        title
      }
    }
  }
`;

const Lecture = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_LECTURE, {
    variables: { id },
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            Error: {error.message}
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  const { lecture } = data;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Home
        </Link>
        <Link
          component={RouterLink}
          to={`/course/${lecture.course.id}`}
          color="inherit"
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          {lecture.course.title}
        </Link>
        <Typography color="text.primary">{lecture.title}</Typography>
      </Breadcrumbs>

      <LectureCard>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {lecture.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Course: {lecture.course.title}
            </Typography>
          </Box>

          {lecture.videoUrl && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VideoLibraryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Video Lecture</Typography>
              </Box>
              <VideoContainer>
                <iframe
                  src={lecture.videoUrl}
                  title={lecture.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </VideoContainer>
            </>
          )}

          {lecture.pdfUrl && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PictureAsPdfIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Lecture Notes</Typography>
              </Box>
              <PDFContainer>
                <iframe
                  src={lecture.pdfUrl}
                  title={`PDF: ${lecture.title}`}
                />
              </PDFContainer>
            </>
          )}
        </CardContent>
      </LectureCard>
    </Container>
  );
};

export default Lecture; 