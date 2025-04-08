import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  Paper,
  CardMedia,
  CardActions,
  Icon,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import TimerIcon from '@mui/icons-material/Timer';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PublicIcon from '@mui/icons-material/Public';
import TranslateIcon from '@mui/icons-material/Translate';
import ComputerIcon from '@mui/icons-material/Computer';
import SportsIcon from '@mui/icons-material/Sports';
import PaletteIcon from '@mui/icons-material/Palette';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      description
      class
      subject
      isPremium
      teacher {
        name
      }
      syllabus {
        topic
        description
        duration
      }
    }
  }
`;

const ENROLL_COURSE = gql`
  mutation EnrollCourse($courseId: ID!) {
    enrollCourse(courseId: $courseId) {
      id
      title
    }
  }
`;

const INITIALIZE_COURSES = gql`
  mutation InitializeCourses($courses: [CourseInput!]!) {
    initializeCourses(courses: $courses) {
      id
      title
      description
      class
      subject
      isPremium
      teacher {
        name
      }
      syllabus {
        topic
        description
        duration
      }
    }
  }
`;

const MotionGrid = motion.create(Grid);
const MotionCard = motion.create(Card);

const subjects = [
  { name: 'Mathematics', icon: CalculateIcon, color: '#2196F3' },
  { name: 'Science', icon: ScienceIcon, color: '#4CAF50' },
  { name: 'English', icon: MenuBookIcon, color: '#9C27B0' },
  { name: 'Social Studies', icon: PublicIcon, color: '#FF9800' },
  { name: 'Hindi', icon: TranslateIcon, color: '#F44336' },
  { name: 'Computer Science', icon: ComputerIcon, color: '#607D8B' },
  { name: 'Physical Education', icon: SportsIcon, color: '#795548' },
  { name: 'Art', icon: PaletteIcon, color: '#E91E63' }
];

export const dummyCourses = [
  // Class 8 Courses
  {
    id: '507f1f77bcf86cd799439011',
    title: 'Advanced Mathematics',
    description: 'Master complex mathematical concepts and problem-solving techniques. This course covers everything from basic algebra to advanced calculus, with practical applications and real-world examples.',
    class: 8,
    subject: 'Mathematics',
    isPremium: true,
    price: 999,
    teacher: { name: 'Dr. Sarah Johnson' },
    syllabus: [
      { topic: 'Algebra Fundamentals', description: 'Learn basic algebraic concepts', duration: '2 weeks' },
      { topic: 'Geometry Basics', description: 'Understand geometric shapes and properties', duration: '3 weeks' },
      { topic: 'Trigonometry', description: 'Study trigonometric functions and applications', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Solve complex algebraic equations',
      'Apply geometric theorems',
      'Use trigonometric functions in real-world problems',
      'Develop logical thinking skills',
      'Master mathematical problem-solving techniques',
      'Understand mathematical proofs'
    ],
    requirements: [
      'Basic understanding of arithmetic',
      'Notebook and calculator',
      'Dedication to practice',
      'Regular attendance',
      'Willingness to solve problems'
    ]
  },
  {
    id: '507f1f77bcf86cd799439012',
    title: 'Science Explorer',
    description: 'Explore the wonders of science through hands-on experiments and interactive learning. This course makes science fun and engaging with practical demonstrations and real-world applications.',
    class: 8,
    subject: 'Science',
    isPremium: false,
    price: 0,
    teacher: { name: 'Prof. Michael Chen' },
    syllabus: [
      { topic: 'Physics Basics', description: 'Introduction to fundamental physics concepts', duration: '2 weeks' },
      { topic: 'Chemistry Fundamentals', description: 'Learn about elements and compounds', duration: '3 weeks' },
      { topic: 'Biology Essentials', description: 'Study of living organisms', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Understand scientific principles',
      'Conduct basic experiments',
      'Analyze scientific data',
      'Develop critical thinking skills',
      'Learn about the scientific method',
      'Explore environmental science'
    ],
    requirements: [
      'Curiosity about the natural world',
      'Basic lab safety knowledge',
      'Willingness to participate in experiments',
      'Notebook for observations',
      'Safety goggles for experiments'
    ]
  },
  {
    id: '507f1f77bcf86cd799439013',
    title: 'English Language Mastery',
    description: 'Enhance your English language skills through comprehensive grammar, vocabulary, and communication exercises. This course focuses on both written and spoken English proficiency.',
    class: 8,
    subject: 'English',
    isPremium: true,
    price: 799,
    teacher: { name: 'Ms. Emily Wilson' },
    syllabus: [
      { topic: 'Grammar Essentials', description: 'Master English grammar rules', duration: '3 weeks' },
      { topic: 'Vocabulary Building', description: 'Expand your word power', duration: '2 weeks' },
      { topic: 'Creative Writing', description: 'Develop writing skills', duration: '3 weeks' }
    ],
    whatYouWillLearn: [
      'Improve grammar and punctuation',
      'Expand vocabulary and usage',
      'Enhance writing skills',
      'Develop reading comprehension',
      'Master communication techniques',
      'Build confidence in speaking'
    ],
    requirements: [
      'Basic English reading skills',
      'Notebook for writing exercises',
      'Dictionary or vocabulary app',
      'Regular practice time',
      'Willingness to participate in discussions'
    ]
  },
  {
    id: '507f1f77bcf86cd799439014',
    title: 'Social Studies Explorer',
    description: 'Journey through history, geography, and civics to understand our world better. This course combines historical events with current affairs for a comprehensive understanding of society.',
    class: 8,
    subject: 'Social Studies',
    isPremium: false,
    price: 0,
    teacher: { name: 'Mr. David Thompson' },
    syllabus: [
      { topic: 'World History', description: 'Study major historical events', duration: '3 weeks' },
      { topic: 'Geography Basics', description: 'Learn about world geography', duration: '2 weeks' },
      { topic: 'Civics Education', description: 'Understand government and citizenship', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Understand historical events',
      'Analyze geographical patterns',
      'Learn about government systems',
      'Develop critical thinking about society',
      'Understand cultural diversity',
      'Build awareness of current affairs'
    ],
    requirements: [
      'Interest in world events',
      'Notebook for notes',
      'World map or atlas',
      'Regular reading of news',
      'Willingness to discuss current events'
    ]
  },
  {
    id: '507f1f77bcf86cd799439015',
    title: 'Hindi Language Excellence',
    description: 'Master the Hindi language through comprehensive grammar, vocabulary, and literature studies. This course focuses on both written and spoken Hindi proficiency.',
    class: 8,
    subject: 'Hindi',
    isPremium: true,
    price: 699,
    teacher: { name: 'Shri Rajesh Kumar' },
    syllabus: [
      { topic: 'Hindi Grammar', description: 'Learn Hindi grammar rules', duration: '3 weeks' },
      { topic: 'Vocabulary Development', description: 'Expand Hindi vocabulary', duration: '2 weeks' },
      { topic: 'Hindi Literature', description: 'Study Hindi literature', duration: '3 weeks' }
    ],
    whatYouWillLearn: [
      'Master Hindi grammar',
      'Expand vocabulary',
      'Improve writing skills',
      'Enhance reading comprehension',
      'Develop speaking fluency',
      'Understand Hindi literature'
    ],
    requirements: [
      'Basic Hindi reading skills',
      'Notebook for writing practice',
      'Hindi dictionary',
      'Regular practice time',
      'Willingness to participate in discussions'
    ]
  },
  {
    id: '507f1f77bcf86cd799439016',
    title: 'Computer Science Fundamentals',
    description: 'Learn the basics of computer science, programming, and digital literacy. This course provides hands-on experience with coding and computer applications.',
    class: 8,
    subject: 'Computer Science',
    isPremium: true,
    price: 899,
    teacher: { name: 'Mr. Alex Rodriguez' },
    syllabus: [
      { topic: 'Programming Basics', description: 'Introduction to coding', duration: '3 weeks' },
      { topic: 'Computer Applications', description: 'Learn essential software', duration: '2 weeks' },
      { topic: 'Digital Literacy', description: 'Understand technology basics', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Basic programming concepts',
      'Use of essential software',
      'Understand computer systems',
      'Develop problem-solving skills',
      'Learn about internet safety',
      'Create simple programs'
    ],
    requirements: [
      'Access to a computer',
      'Basic computer knowledge',
      'Notebook for notes',
      'Willingness to learn coding',
      'Regular practice time'
    ]
  },
  {
    id: '507f1f77bcf86cd799439017',
    title: 'Physical Education & Health',
    description: 'Develop physical fitness, learn about health and wellness, and understand the importance of an active lifestyle. This course combines theory with practical exercises.',
    class: 8,
    subject: 'Physical Education',
    isPremium: false,
    price: 0,
    teacher: { name: 'Coach Maria Garcia' },
    syllabus: [
      { topic: 'Fitness Training', description: 'Learn exercise techniques', duration: '2 weeks' },
      { topic: 'Health Education', description: 'Understand health basics', duration: '2 weeks' },
      { topic: 'Sports Skills', description: 'Develop sports abilities', duration: '3 weeks' }
    ],
    whatYouWillLearn: [
      'Improve physical fitness',
      'Learn about health and nutrition',
      'Develop sports skills',
      'Understand exercise safety',
      'Build teamwork abilities',
      'Maintain healthy lifestyle'
    ],
    requirements: [
      'Sports attire and shoes',
      'Water bottle',
      'Towel',
      'Regular exercise time',
      'Medical clearance if needed'
    ]
  },
  {
    id: '507f1f77bcf86cd799439018',
    title: 'Art & Creativity',
    description: 'Explore various art forms and develop your creative skills. This course covers different artistic techniques and encourages creative expression.',
    class: 8,
    subject: 'Art',
    isPremium: true,
    price: 799,
    teacher: { name: 'Ms. Sophia Chen' },
    syllabus: [
      { topic: 'Drawing Techniques', description: 'Learn basic drawing skills', duration: '2 weeks' },
      { topic: 'Color Theory', description: 'Understand color concepts', duration: '2 weeks' },
      { topic: 'Creative Expression', description: 'Develop artistic style', duration: '3 weeks' }
    ],
    whatYouWillLearn: [
      'Master basic drawing skills',
      'Understand color theory',
      'Develop artistic techniques',
      'Express creativity',
      'Learn about art history',
      'Create original artwork'
    ],
    requirements: [
      'Art supplies (pencils, colors, paper)',
      'Sketchbook',
      'Willingness to experiment',
      'Regular practice time',
      'Creative mindset'
    ]
  },

  // Class 9 Courses
  {
    id: '507f1f77bcf86cd799439019',
    title: 'Mathematics Mastery - Class 9',
    description: 'Advanced mathematical concepts and problem-solving techniques for Class 9 students. This course builds upon previous knowledge and introduces new mathematical concepts.',
    class: 9,
    subject: 'Mathematics',
    isPremium: true,
    price: 1099,
    teacher: { name: 'Dr. Sarah Johnson' },
    syllabus: [
      { topic: 'Advanced Algebra', description: 'Complex algebraic equations and functions', duration: '3 weeks' },
      { topic: 'Coordinate Geometry', description: 'Study of geometric shapes using coordinates', duration: '2 weeks' },
      { topic: 'Trigonometry & Calculus', description: 'Advanced trigonometric concepts and introduction to calculus', duration: '3 weeks' }
    ],
    whatYouWillLearn: [
      'Solve advanced algebraic problems',
      'Apply coordinate geometry concepts',
      'Master trigonometric identities',
      'Understand basic calculus concepts',
      'Develop analytical thinking skills',
      'Solve real-world mathematical problems'
    ],
    requirements: [
      'Strong foundation in Class 8 mathematics',
      'Scientific calculator',
      'Graph paper and geometry set',
      'Regular practice time',
      'Willingness to solve complex problems'
    ]
  },
  {
    id: '507f1f77bcf86cd799439020',
    title: 'Science Advanced - Class 9',
    description: 'In-depth exploration of scientific concepts with advanced experiments and practical applications. This course challenges students to think critically about scientific phenomena.',
    class: 9,
    subject: 'Science',
    isPremium: true,
    price: 999,
    teacher: { name: 'Prof. Michael Chen' },
    syllabus: [
      { topic: 'Advanced Physics', description: 'Complex physics concepts and applications', duration: '3 weeks' },
      { topic: 'Organic Chemistry', description: 'Study of carbon compounds and reactions', duration: '3 weeks' },
      { topic: 'Cell Biology', description: 'In-depth study of cell structure and function', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Understand advanced physics concepts',
      'Master chemical reactions and equations',
      'Study cell biology in detail',
      'Conduct complex experiments',
      'Analyze scientific data',
      'Develop research skills'
    ],
    requirements: [
      'Basic understanding of Class 8 science',
      'Laboratory safety knowledge',
      'Scientific calculator',
      'Notebook for observations',
      'Safety equipment for experiments'
    ]
  },
  {
    id: '507f1f77bcf86cd799439021',
    title: 'English Literature & Language - Class 9',
    description: 'Advanced English language and literature course focusing on critical analysis, creative writing, and advanced grammar concepts.',
    class: 9,
    subject: 'English',
    isPremium: true,
    price: 899,
    teacher: { name: 'Ms. Emily Wilson' },
    syllabus: [
      { topic: 'Advanced Grammar', description: 'Complex grammar rules and usage', duration: '3 weeks' },
      { topic: 'Literary Analysis', description: 'Study of classic literature', duration: '3 weeks' },
      { topic: 'Advanced Writing', description: 'Creative and academic writing skills', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Master advanced grammar concepts',
      'Analyze literary works critically',
      'Develop sophisticated writing skills',
      'Enhance vocabulary and expression',
      'Understand literary devices',
      'Build research and citation skills'
    ],
    requirements: [
      'Strong foundation in English',
      'Notebook for writing exercises',
      'Dictionary and thesaurus',
      'Regular reading practice',
      'Willingness to participate in discussions'
    ]
  },
  {
    id: '507f1f77bcf86cd799439022',
    title: 'Social Studies Advanced - Class 9',
    description: 'Comprehensive study of history, geography, and civics with focus on critical analysis and current affairs.',
    class: 9,
    subject: 'Social Studies',
    isPremium: true,
    price: 899,
    teacher: { name: 'Mr. David Thompson' },
    syllabus: [
      { topic: 'Modern History', description: 'Study of recent historical events', duration: '3 weeks' },
      { topic: 'Economic Geography', description: 'Understanding global economies', duration: '2 weeks' },
      { topic: 'Political Science', description: 'Study of political systems', duration: '3 weeks' }
    ],
    whatYouWillLearn: [
      'Analyze historical events critically',
      'Understand economic systems',
      'Study political structures',
      'Develop research skills',
      'Understand global issues',
      'Build critical thinking abilities'
    ],
    requirements: [
      'Interest in current affairs',
      'Notebook for notes',
      'World map or atlas',
      'Regular reading of news',
      'Willingness to discuss current events'
    ]
  },
  {
    id: '507f1f77bcf86cd799439023',
    title: 'Hindi Literature & Language - Class 9',
    description: 'Advanced Hindi language and literature course focusing on grammar, composition, and literary analysis.',
    class: 9,
    subject: 'Hindi',
    isPremium: true,
    price: 799,
    teacher: { name: 'Shri Rajesh Kumar' },
    syllabus: [
      { topic: 'Advanced Hindi Grammar', description: 'Complex grammar rules and usage', duration: '3 weeks' },
      { topic: 'Hindi Literature', description: 'Study of classic Hindi literature', duration: '3 weeks' },
      { topic: 'Creative Writing', description: 'Advanced writing skills in Hindi', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Master advanced Hindi grammar',
      'Analyze Hindi literature',
      'Develop writing skills',
      'Enhance vocabulary',
      'Understand literary devices',
      'Build research skills'
    ],
    requirements: [
      'Strong foundation in Hindi',
      'Notebook for writing practice',
      'Hindi dictionary',
      'Regular reading practice',
      'Willingness to participate in discussions'
    ]
  },
  {
    id: '507f1f77bcf86cd799439024',
    title: 'Computer Science Advanced - Class 9',
    description: 'Advanced computer science course covering programming, data structures, and computer applications.',
    class: 9,
    subject: 'Computer Science',
    isPremium: true,
    price: 999,
    teacher: { name: 'Mr. Alex Rodriguez' },
    syllabus: [
      { topic: 'Programming Fundamentals', description: 'Introduction to programming concepts', duration: '3 weeks' },
      { topic: 'Data Structures', description: 'Study of basic data structures', duration: '3 weeks' },
      { topic: 'Web Development', description: 'Introduction to web technologies', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Master programming concepts',
      'Understand data structures',
      'Develop web applications',
      'Learn problem-solving skills',
      'Understand algorithms',
      'Build practical projects'
    ],
    requirements: [
      'Basic computer knowledge',
      'Access to a computer',
      'Programming software',
      'Notebook for notes',
      'Willingness to learn coding'
    ]
  },
  {
    id: '507f1f77bcf86cd799439025',
    title: 'Physical Education Advanced - Class 9',
    description: 'Advanced physical education course focusing on fitness, sports science, and health education.',
    class: 9,
    subject: 'Physical Education',
    isPremium: false,
    price: 0,
    teacher: { name: 'Coach Maria Garcia' },
    syllabus: [
      { topic: 'Advanced Fitness', description: 'Advanced exercise techniques', duration: '2 weeks' },
      { topic: 'Sports Science', description: 'Understanding sports physiology', duration: '3 weeks' },
      { topic: 'Health Education', description: 'Advanced health concepts', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Master advanced fitness techniques',
      'Understand sports science',
      'Develop leadership skills',
      'Learn about sports psychology',
      'Build team management skills',
      'Maintain healthy lifestyle'
    ],
    requirements: [
      'Sports attire and shoes',
      'Water bottle',
      'Towel',
      'Regular exercise time',
      'Medical clearance if needed'
    ]
  },
  {
    id: '507f1f77bcf86cd799439026',
    title: 'Art & Design Advanced - Class 9',
    description: 'Advanced art course focusing on various art forms, design principles, and creative expression.',
    class: 9,
    subject: 'Art',
    isPremium: true,
    price: 899,
    teacher: { name: 'Ms. Sophia Chen' },
    syllabus: [
      { topic: 'Advanced Drawing', description: 'Advanced drawing techniques', duration: '3 weeks' },
      { topic: 'Design Principles', description: 'Study of design concepts', duration: '2 weeks' },
      { topic: 'Creative Expression', description: 'Advanced artistic techniques', duration: '3 weeks' }
    ],
    whatYouWillLearn: [
      'Master advanced drawing skills',
      'Understand design principles',
      'Develop artistic style',
      'Learn about art history',
      'Build portfolio skills',
      'Create original artwork'
    ],
    requirements: [
      'Art supplies (pencils, colors, paper)',
      'Sketchbook',
      'Willingness to experiment',
      'Regular practice time',
      'Creative mindset'
    ]
  },

  // Class 10 Courses
  {
    id: '507f1f77bcf86cd799439027',
    title: 'Mathematics Excellence - Class 10',
    description: 'Comprehensive mathematics course for Class 10 students, covering all essential topics for board examinations and competitive tests.',
    class: 10,
    subject: 'Mathematics',
    isPremium: true,
    price: 1199,
    teacher: { name: 'Dr. Sarah Johnson' },
    syllabus: [
      { topic: 'Advanced Algebra & Calculus', description: 'Complex algebraic equations and calculus concepts', duration: '4 weeks' },
      { topic: 'Analytical Geometry', description: 'Advanced geometric concepts and applications', duration: '3 weeks' },
      { topic: 'Statistics & Probability', description: 'Data analysis and probability theory', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Master advanced mathematical concepts',
      'Solve complex calculus problems',
      'Apply statistical methods',
      'Develop problem-solving strategies',
      'Prepare for competitive exams',
      'Build strong mathematical foundation'
    ],
    requirements: [
      'Strong foundation in Class 9 mathematics',
      'Scientific calculator',
      'Graph paper and geometry set',
      'Regular practice time',
      'Dedication to problem-solving'
    ]
  },
  {
    id: '507f1f77bcf86cd799439028',
    title: 'Science Comprehensive - Class 10',
    description: 'Complete science course covering physics, chemistry, and biology for Class 10 students. This course prepares students for board examinations and future scientific studies.',
    class: 10,
    subject: 'Science',
    isPremium: true,
    price: 1099,
    teacher: { name: 'Prof. Michael Chen' },
    syllabus: [
      { topic: 'Modern Physics', description: 'Advanced physics concepts and applications', duration: '3 weeks' },
      { topic: 'Chemical Reactions', description: 'Study of chemical equations and reactions', duration: '3 weeks' },
      { topic: 'Human Physiology', description: 'Detailed study of human body systems', duration: '3 weeks' }
    ],
    whatYouWillLearn: [
      'Understand modern physics concepts',
      'Master chemical reactions and equations',
      'Study human physiology in detail',
      'Conduct advanced experiments',
      'Analyze complex scientific data',
      'Prepare for competitive exams'
    ],
    requirements: [
      'Strong foundation in Class 9 science',
      'Laboratory safety knowledge',
      'Scientific calculator',
      'Notebook for observations',
      'Safety equipment for experiments'
    ]
  },
  {
    id: '507f1f77bcf86cd799439029',
    title: 'English Mastery - Class 10',
    description: 'Advanced English course focusing on board examination preparation, literature analysis, and advanced communication skills.',
    class: 10,
    subject: 'English',
    isPremium: true,
    price: 999,
    teacher: { name: 'Ms. Emily Wilson' },
    syllabus: [
      { topic: 'Board Exam Preparation', description: 'Comprehensive exam preparation', duration: '4 weeks' },
      { topic: 'Advanced Literature', description: 'Study of prescribed literature', duration: '3 weeks' },
      { topic: 'Communication Skills', description: 'Advanced speaking and writing', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Master exam preparation techniques',
      'Analyze prescribed literature',
      'Develop advanced communication skills',
      'Enhance vocabulary and expression',
      'Build critical thinking abilities',
      'Prepare for competitive exams'
    ],
    requirements: [
      'Strong foundation in English',
      'Notebook for writing exercises',
      'Dictionary and thesaurus',
      'Regular reading practice',
      'Willingness to participate in discussions'
    ]
  },
  {
    id: '507f1f77bcf86cd799439030',
    title: 'Social Studies Mastery - Class 10',
    description: 'Comprehensive social studies course preparing students for board examinations and developing critical understanding of society.',
    class: 10,
    subject: 'Social Studies',
    isPremium: true,
    price: 999,
    teacher: { name: 'Mr. David Thompson' },
    syllabus: [
      { topic: 'Indian History', description: 'Detailed study of Indian history', duration: '4 weeks' },
      { topic: 'World Geography', description: 'Comprehensive world geography', duration: '3 weeks' },
      { topic: 'Political Science', description: 'Advanced political concepts', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Master Indian history',
      'Understand world geography',
      'Study political systems',
      'Develop research skills',
      'Build critical thinking abilities',
      'Prepare for board examinations'
    ],
    requirements: [
      'Interest in current affairs',
      'Notebook for notes',
      'World map or atlas',
      'Regular reading of news',
      'Willingness to discuss current events'
    ]
  },
  {
    id: '507f1f77bcf86cd799439031',
    title: 'Hindi Mastery - Class 10',
    description: 'Advanced Hindi course focusing on board examination preparation, literature analysis, and advanced language skills.',
    class: 10,
    subject: 'Hindi',
    isPremium: true,
    price: 899,
    teacher: { name: 'Shri Rajesh Kumar' },
    syllabus: [
      { topic: 'Board Exam Preparation', description: 'Comprehensive exam preparation', duration: '4 weeks' },
      { topic: 'Hindi Literature', description: 'Study of prescribed literature', duration: '3 weeks' },
      { topic: 'Advanced Grammar', description: 'Complex grammar concepts', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Master exam preparation techniques',
      'Analyze prescribed literature',
      'Develop advanced writing skills',
      'Enhance vocabulary and expression',
      'Build critical thinking abilities',
      'Prepare for competitive exams'
    ],
    requirements: [
      'Strong foundation in Hindi',
      'Notebook for writing practice',
      'Hindi dictionary',
      'Regular reading practice',
      'Willingness to participate in discussions'
    ]
  },
  {
    id: '507f1f77bcf86cd799439032',
    title: 'Computer Science Mastery - Class 10',
    description: 'Advanced computer science course preparing students for board examinations and future studies in technology.',
    class: 10,
    subject: 'Computer Science',
    isPremium: true,
    price: 1099,
    teacher: { name: 'Mr. Alex Rodriguez' },
    syllabus: [
      { topic: 'Programming Languages', description: 'Advanced programming concepts', duration: '4 weeks' },
      { topic: 'Database Management', description: 'Introduction to databases', duration: '3 weeks' },
      { topic: 'Web Development', description: 'Advanced web technologies', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Master programming languages',
      'Understand database concepts',
      'Develop web applications',
      'Learn problem-solving skills',
      'Build practical projects',
      'Prepare for competitive exams'
    ],
    requirements: [
      'Strong foundation in programming',
      'Access to a computer',
      'Programming software',
      'Notebook for notes',
      'Willingness to learn coding'
    ]
  },
  {
    id: '507f1f77bcf86cd799439033',
    title: 'Physical Education Mastery - Class 10',
    description: 'Advanced physical education course focusing on fitness, sports science, and health education for board examinations.',
    class: 10,
    subject: 'Physical Education',
    isPremium: false,
    price: 0,
    teacher: { name: 'Coach Maria Garcia' },
    syllabus: [
      { topic: 'Sports Science', description: 'Advanced sports concepts', duration: '3 weeks' },
      { topic: 'Health Education', description: 'Comprehensive health studies', duration: '3 weeks' },
      { topic: 'Fitness Training', description: 'Advanced fitness techniques', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Master sports science concepts',
      'Understand health education',
      'Develop leadership skills',
      'Learn about sports psychology',
      'Build team management skills',
      'Maintain healthy lifestyle'
    ],
    requirements: [
      'Sports attire and shoes',
      'Water bottle',
      'Towel',
      'Regular exercise time',
      'Medical clearance if needed'
    ]
  },
  {
    id: '507f1f77bcf86cd799439034',
    title: 'Art & Design Mastery - Class 10',
    description: 'Advanced art course focusing on various art forms, design principles, and creative expression for board examinations.',
    class: 10,
    subject: 'Art',
    isPremium: true,
    price: 999,
    teacher: { name: 'Ms. Sophia Chen' },
    syllabus: [
      { topic: 'Advanced Art Techniques', description: 'Mastering art techniques', duration: '4 weeks' },
      { topic: 'Design Principles', description: 'Advanced design concepts', duration: '3 weeks' },
      { topic: 'Portfolio Development', description: 'Building art portfolio', duration: '2 weeks' }
    ],
    whatYouWillLearn: [
      'Master advanced art techniques',
      'Understand design principles',
      'Develop artistic style',
      'Learn about art history',
      'Build portfolio skills',
      'Create original artwork'
    ],
    requirements: [
      'Art supplies (pencils, colors, paper)',
      'Sketchbook',
      'Willingness to experiment',
      'Regular practice time',
      'Creative mindset'
    ]
  }
];

const Courses = () => {
  const [selectedClass, setSelectedClass] = useState('8');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const { data: coursesData, loading: coursesLoading, error: coursesError, refetch: refetchCourses } = useQuery(GET_COURSES);
  const [enrollCourse] = useMutation(ENROLL_COURSE);
  const [initializeCourses] = useMutation(INITIALIZE_COURSES);

  useEffect(() => {
    const initializeCoursesIfNeeded = async () => {
      try {
        if (!coursesData?.courses || coursesData.courses.length === 0) {
          // Format the dummy courses to match the CourseInput type
          const formattedCourses = dummyCourses.map(course => ({
            title: course.title,
            description: course.description,
            class: parseInt(course.class),
            subject: course.subject,
            isPremium: course.isPremium,
            price: course.price,
            syllabus: course.syllabus.map(item => ({
              topic: item.topic,
              description: item.description,
              duration: item.duration
            }))
          }));

          await initializeCourses({
            variables: { courses: formattedCourses }
          });
          // Refetch courses after initialization
          await refetchCourses();
        }
      } catch (error) {
        console.error('Error initializing courses:', error);
        setError('Failed to initialize courses. Please try again later.');
      }
    };

    initializeCoursesIfNeeded();
  }, [coursesData, initializeCourses, refetchCourses]);

  const handleClassChange = (event, newValue) => {
    setSelectedClass(newValue);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleEnroll = async (courseId, isPremium) => {
    try {
      if (isPremium) {
        // Navigate to payment page for premium courses
        navigate(`/payment/${courseId}`);
      } else {
        // Show confirmation dialog for free courses
        const course = dummyCourses.find(c => c.id === courseId);
        setSelectedCourse(course);
        setOpenConfirmDialog(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleConfirmEnroll = async () => {
    try {
      await enrollCourse({
        variables: { courseId: selectedCourse.id },
        refetchQueries: [{ query: GET_COURSES }],
      });
      
      // Get existing enrolled courses from localStorage
      const existingEnrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      
      // Add the new course to enrolled courses if not already enrolled
      if (!existingEnrolledCourses.includes(selectedCourse.id)) {
        const updatedEnrolledCourses = [...existingEnrolledCourses, selectedCourse.id];
        localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses));
        
        // Also store course details for quick access
        const enrolledCourseDetails = JSON.parse(localStorage.getItem('enrolledCourseDetails') || '{}');
        enrolledCourseDetails[selectedCourse.id] = {
          ...selectedCourse,
          enrolledAt: new Date().toISOString(),
          progress: 0,
          completedLessons: [],
          teacher: selectedCourse.teacher || { name: 'Unknown Teacher' }
        };
        localStorage.setItem('enrolledCourseDetails', JSON.stringify(enrolledCourseDetails));
      }
      
      setOpenConfirmDialog(false);
      setSnackbarMessage('Successfully enrolled in the course!');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedCourse(null);
  };

  const handleShowDetails = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (coursesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (coursesError) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error: {coursesError.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component={motion.h3}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            gutterBottom
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Available Courses
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ 
              maxWidth: '600px', 
              mx: 'auto', 
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Explore our comprehensive collection of courses designed to enhance your learning journey
          </Typography>
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
            Select Class
          </Typography>
          <Tabs 
            value={selectedClass} 
            onChange={handleClassChange}
            variant="fullWidth"
            sx={{ 
              '& .MuiTab-root': {
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: 2,
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 600,
                  bgcolor: 'rgba(25, 118, 210, 0.08)'
                }
              }
            }}
          >
            <Tab 
              label="Class 8" 
              value="8" 
              icon={<SchoolIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Class 9" 
              value="9"
              icon={<SchoolIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Class 10" 
              value="10"
              icon={<SchoolIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        <Box sx={{ 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          width: '100%'
        }}>
          {subjects.map((subject) => {
            const course = dummyCourses.find(c => c.subject === subject.name && c.class === parseInt(selectedClass));
            const IconComponent = subject.icon;
            return (
              <Box
                key={subject.name}
                sx={{
                  flex: '1 1 300px',
                  maxWidth: '400px',
                  minWidth: '300px'
                }}
              >
                <Card 
                  sx={{ 
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                      transition: 'all 0.3s ease-in-out'
                    }
                  }}
                >
                  <CardContent sx={{ 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: 'column',
                    '& > *': { flex: '0 0 auto' },
                    '& > .description': { flex: '1 1 auto' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <IconComponent sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                        {subject.name}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      className="description"
                      sx={{
                        mb: 2,
                        fontSize: '1rem',
                        lineHeight: 1.5,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis',
                        minHeight: '4.5em'
                      }}
                    >
                      {course?.description || 'Course description coming soon...'}
                    </Typography>

                    {course ? (
                      <>
                        <Box sx={{ mb: 2 }}>
                          <Typography 
                            variant="subtitle2" 
                            gutterBottom 
                            sx={{ 
                              fontWeight: 600,
                              color: 'text.primary',
                              mb: 1
                            }}
                          >
                            Course Highlights
                          </Typography>
                          <Grid container spacing={1}>
                            {course.syllabus.slice(0, 3).map((item, index) => (
                              <Grid key={index} columns={{ xs: 12, sm: 4 }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: 'rgba(0, 0, 0, 0.02)'
                                }}>
                                  <FiberManualRecordIcon 
                                    sx={{ 
                                      fontSize: 8, 
                                      mr: 1, 
                                      color: 'primary.main' 
                                    }} 
                                  />
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: 'text.secondary',
                                      fontSize: '0.85rem'
                                    }}
                                  >
                                    {item.topic}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleShowDetails(course.id)}
                              sx={{ 
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 2,
                                py: 0.5
                              }}
                            >
                              Show Details
                            </Button>
                            <Button
                              variant="contained"
                              color={course.isPremium ? "warning" : "success"}
                              size="small"
                              onClick={() => handleEnroll(course.id, course.isPremium)}
                              sx={{ 
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 2,
                                py: 0.5
                              }}
                            >
                              {course.isPremium ? 'Buy Now' : 'Enroll Free'}
                            </Button>
                          </Box>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 600,
                              color: course.isPremium ? 'warning.main' : 'success.main'
                            }}
                          >
                            {course.isPremium ? `₹${course.price}` : 'Free'}
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            color: 'text.secondary',
                            fontStyle: 'italic'
                          }}
                        >
                          Course details coming soon
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Container>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-enrollment-dialog"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          pb: 1
        }}>
          Confirm Enrollment
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedCourse && `Are you sure you want to enroll in ${selectedCourse.title}? This course is free and you can start learning immediately after enrollment.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseConfirmDialog}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmEnroll}
            variant="contained"
            color="success"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Enroll Now
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="info" 
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

export default Courses; 