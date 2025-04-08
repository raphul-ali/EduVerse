import { gql } from '@apollo/client';

export const GET_COURSES = gql`
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