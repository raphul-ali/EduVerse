import { gql } from '@apollo/client';

export const ENROLL_COURSE = gql`
  mutation EnrollCourse($courseId: ID!) {
    enrollCourse(courseId: $courseId) {
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

export const INITIALIZE_COURSES = gql`
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