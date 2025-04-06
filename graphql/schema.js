const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    isEmailVerified: Boolean!
    profileCompleted: Boolean!
    status: String!
    createdAt: String!
    courses: [Course!]
  }

  type Profile {
    bio: String
    avatar: String
    phone: String
    address: String
    education: [Education!]
    experience: [Experience!]
  }

  type Education {
    institution: String!
    degree: String!
    field: String!
    startDate: String!
    endDate: String
  }

  type Experience {
    company: String!
    position: String!
    startDate: String!
    endDate: String
    description: String
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    class: Int!
    subject: String!
    isPremium: Boolean!
    teacher: User!
    students: [User!]
    lectures: [Lecture!]
    syllabus: [SyllabusItem!]
    createdAt: String!
    updatedAt: String!
  }

  type Lecture {
    id: ID!
    title: String!
    content: String!
    duration: String!
    course: Course!
    createdAt: String!
  }

  type SyllabusItem {
    topic: String!
    description: String!
    duration: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type VerificationResponse {
    success: Boolean!
    message: String!
  }

  type ResetPasswordResponse {
    success: Boolean!
    message: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
    role: String!
  }

  input ProfileInput {
    name: String
    bio: String
    avatar: String
  }

  input CourseInput {
    title: String!
    description: String!
    class: Int!
    subject: String!
    isPremium: Boolean!
    syllabus: [SyllabusItemInput!]!
  }

  input SyllabusItemInput {
    topic: String!
    description: String!
    duration: String!
  }

  type PaymentOrder {
    id: ID!
    amount: Int!
    currency: String!
    status: String!
  }

  type PaymentVerification {
    success: Boolean!
    message: String!
  }

  type Progress {
    id: ID!
    userId: ID!
    courseId: ID!
    completedLectures: [ID!]!
    progressPercentage: Float!
    lastAccessed: String!
  }

  type Query {
    me: User
    users: [User!]!
    user(id: ID!): User
    courses: [Course!]!
    course(id: ID!): Course
    lectures(courseId: ID!): [Lecture!]!
    progress(userId: ID!, courseId: ID!): Progress!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    verifyEmail(token: String!): AuthPayload!
    requestPasswordReset(email: String!): Boolean!
    resetPassword(token: String!, newPassword: String!): AuthPayload!
    updateProfile(input: ProfileInput!): User!
    createCourse(input: CourseInput!): Course!
    enrollCourse(courseId: ID!): Course!
    addLecture(courseId: ID!, title: String!, videoUrl: String, pdfUrl: String): Lecture!
    updateProgress(lectureId: ID!): Progress!
    createPaymentOrder(amount: Float!, courseId: ID!): PaymentOrder!
    verifyPayment(orderId: String!, paymentId: String!, signature: String!): PaymentVerification!
  }
`;

module.exports = typeDefs; 