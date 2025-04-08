import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const CREATE_COURSE = gql`
  mutation CreateCourse($input: CourseInput!) {
    createCourse(input: $input) {
      id
      title
      description
      class
      subject
      isPremium
      price
      syllabus {
        topic
        description
        duration
      }
    }
  }
`;

const classes = [8, 9, 10];
const defaultSubjects = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Hindi',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Civics',
  'Economics',
  'Computer Science',
  'Physical Education',
  'Art',
  'Music',
];

// Define the allowed subjects for the backend
const allowedSubjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'];

const CreateCourse = () => {
  const navigate = useNavigate();
  const [createCourse] = useMutation(CREATE_COURSE);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [subjects, setSubjects] = useState(defaultSubjects);
  const [openSubjectDialog, setOpenSubjectDialog] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class: 8,
    subject: 'Mathematics',
    isPremium: false,
    price: '',
    syllabus: [{ topic: '', description: '', duration: '' }]
  });

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isPremium' ? checked : name === 'class' ? parseInt(value) : value
    }));
  };

  const handleSyllabusChange = (index, field, value) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index] = {
      ...newSyllabus[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      syllabus: newSyllabus
    }));
  };

  const addSyllabusItem = () => {
    setFormData(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { topic: '', description: '', duration: '' }]
    }));
  };

  const removeSyllabusItem = (index) => {
    setFormData(prev => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== index)
    }));
  };

  const handleOpenSubjectDialog = () => {
    setOpenSubjectDialog(true);
  };

  const handleCloseSubjectDialog = () => {
    setOpenSubjectDialog(false);
    setNewSubject('');
  };

  const handleAddNewSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      const updatedSubjects = [...subjects, newSubject.trim()];
      setSubjects(updatedSubjects);
      
      // Only set the subject if it's in the allowed list
      if (allowedSubjects.includes(newSubject.trim())) {
        setFormData(prev => ({
          ...prev,
          subject: newSubject.trim()
        }));
      } else {
        // If not in allowed list, keep the current subject
        setError("Custom subjects are not allowed. Please select from the standard subjects.");
        setTimeout(() => setError(null), 5000);
      }
    }
    handleCloseSubjectDialog();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.subject) {
        setError("Please fill in all required fields");
        return;
      }

      // Ensure the subject is one of the allowed values
      if (!allowedSubjects.includes(formData.subject)) {
        setError("Invalid subject. Please select from the standard subjects.");
        return;
      }

      // Validate syllabus items
      const validSyllabus = formData.syllabus.filter(item => 
        item.topic && item.description && item.duration
      );

      if (validSyllabus.length === 0) {
        setError("Please add at least one valid syllabus item");
        return;
      }

      // Prepare the course input with exactly the fields the server expects
      const courseInput = {
        title: formData.title,
        description: formData.description,
        class: parseInt(formData.class),
        subject: formData.subject,
        isPremium: formData.isPremium,
        price: formData.isPremium ? parseFloat(formData.price) : 0,
        syllabus: validSyllabus.map(item => ({
          topic: item.topic,
          description: item.description,
          duration: item.duration
        }))
      };

      console.log('Submitting course with data:', courseInput);

      const result = await createCourse({
        variables: { input: courseInput }
      });

      if (result.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/teacher-courses');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating course:', err);
      setError(err.message || "Failed to create course. Please try again.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={8} 
        sx={{ 
          p: { xs: 2, sm: 4 }, 
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
          background: 'linear-gradient(145deg, #ffffff, #f5f7ff)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #3f51b5, #5c6bc0, #7986cb)',
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          pb: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: '#1a237e',
              letterSpacing: '0.5px'
            }}
          >
            Create New Course
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/courses')}
              size="large"
              sx={{ 
                borderColor: '#3f51b5',
                color: '#3f51b5',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#1a237e',
                  backgroundColor: 'rgba(63, 81, 181, 0.08)'
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        <form id="create-course-form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Basic Information Section */}
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  mt: 2, 
                  mb: 3,
                  fontWeight: 600,
                  color: '#3f51b5',
                  display: 'flex',
                  alignItems: 'center',
                  '&::before': {
                    content: '""',
                    display: 'inline-block',
                    width: '4px',
                    height: '24px',
                    backgroundColor: '#3f51b5',
                    marginRight: '12px',
                    borderRadius: '2px'
                  }
                }}
              >
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#3f51b5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3f51b5',
                      borderWidth: '2px',
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#3f51b5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3f51b5',
                      borderWidth: '2px',
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="class-label">Class</InputLabel>
                <Select
                  labelId="class-label"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  label="Class"
                  sx={{ 
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3f51b5',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3f51b5',
                      borderWidth: '2px',
                    }
                  }}
                >
                  {classes.map(cls => (
                    <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControl fullWidth required>
                  <InputLabel id="subject-label">Subject</InputLabel>
                  <Select
                    labelId="subject-label"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    label="Subject"
                    sx={{ 
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3f51b5',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3f51b5',
                        borderWidth: '2px',
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Choose a subject</em>
                    </MenuItem>
                    {allowedSubjects.map(subject => (
                      <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <MenuItem 
                      value="add_new" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenSubjectDialog();
                      }}
                      sx={{ 
                        color: '#3f51b5',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <AddIcon fontSize="small" />
                      Add New Subject
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Course Type Section */}
            <Grid item xs={12}>
              <Box sx={{ 
                p: 3, 
                border: '1px solid rgba(0, 0, 0, 0.08)', 
                borderRadius: 3,
                mt: 2,
                mb: 2,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                background: 'linear-gradient(145deg, #f8f9ff, #f0f3ff)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  backgroundColor: '#3f51b5',
                }
              }}>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    color: '#3f51b5',
                    mb: 2
                  }}
                >
                  Course Type
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPremium}
                      onChange={handleInputChange}
                      name="isPremium"
                      color="primary"
                    />
                  }
                  label="Premium Course"
                  sx={{ mb: 2 }}
                />
                
                {formData.isPremium && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Price (₹)"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: '₹'
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#3f51b5',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3f51b5',
                            borderWidth: '2px',
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Syllabus Section */}
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  mt: 2, 
                  mb: 3,
                  fontWeight: 600,
                  color: '#3f51b5',
                  display: 'flex',
                  alignItems: 'center',
                  '&::before': {
                    content: '""',
                    display: 'inline-block',
                    width: '4px',
                    height: '24px',
                    backgroundColor: '#3f51b5',
                    marginRight: '12px',
                    borderRadius: '2px'
                  }
                }}
              >
                Course Syllabus
              </Typography>
              {formData.syllabus.map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 3, 
                    p: 3, 
                    border: '1px solid rgba(0, 0, 0, 0.08)', 
                    borderRadius: 3,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                    background: 'linear-gradient(145deg, #f8f9ff, #f0f3ff)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      backgroundColor: '#3f51b5',
                    }
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Topic"
                        value={item.topic}
                        onChange={(e) => handleSyllabusChange(index, 'topic', e.target.value)}
                        required
                        variant="outlined"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#3f51b5',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#3f51b5',
                              borderWidth: '2px',
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={item.description}
                        onChange={(e) => handleSyllabusChange(index, 'description', e.target.value)}
                        multiline
                        rows={2}
                        required
                        variant="outlined"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#3f51b5',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#3f51b5',
                              borderWidth: '2px',
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Duration"
                        value={item.duration}
                        onChange={(e) => handleSyllabusChange(index, 'duration', e.target.value)}
                        required
                        placeholder="e.g., 2 weeks"
                        variant="outlined"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#3f51b5',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#3f51b5',
                              borderWidth: '2px',
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {index > 0 && (
                        <IconButton
                          color="error"
                          onClick={() => removeSyllabusItem(index)}
                          sx={{ 
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 0.08)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addSyllabusItem}
                sx={{ 
                  mt: 1,
                  color: '#3f51b5',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(63, 81, 181, 0.08)'
                  }
                }}
              >
                Add Syllabus Item
              </Button>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            mt: 4,
            pt: 2,
            borderTop: '1px solid rgba(0, 0, 0, 0.08)'
          }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ 
                backgroundColor: '#3f51b5',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
                '&:hover': {
                  backgroundColor: '#1a237e',
                  boxShadow: '0 6px 16px rgba(63, 81, 181, 0.4)'
                }
              }}
            >
              Create Course
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog 
        open={openSubjectDialog} 
        onClose={handleCloseSubjectDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #3f51b5, #5c6bc0, #7986cb)',
            }
          }
        }}
      >
        <DialogTitle sx={{ color: '#1a237e', fontWeight: 600, pb: 1 }}>Add New Subject</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subject Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#3f51b5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3f51b5',
                  borderWidth: '2px',
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseSubjectDialog}
            sx={{ 
              color: '#757575',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddNewSubject} 
            sx={{ 
              color: '#3f51b5',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(63, 81, 181, 0.08)'
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ 
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            borderRadius: 3,
            '& .MuiAlert-icon': {
              color: '#f44336'
            }
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert 
          severity="success" 
          onClose={() => setSuccess(false)}
          sx={{ 
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            borderRadius: 3,
            '& .MuiAlert-icon': {
              color: '#4caf50'
            }
          }}
        >
          Course created successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateCourse; 