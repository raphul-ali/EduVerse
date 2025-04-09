# EduVerse - Modern Educational Platform

EduVerse is a comprehensive educational platform that connects students and teachers in a virtual learning environment. The platform facilitates course creation, enrollment, and interactive learning experiences.

## Live Demo
[EduVerse Live Website](https://edu-verse-sigma.vercel.app)

## Key Features

- **Role-Based Access Control**
  - Separate interfaces for students and teachers
  - Secure authentication and authorization
  - Personalized dashboards

- **Course Management**
  - Create and manage courses with detailed syllabi
  - Course categorization by class and subject
  - Premium and free course options
  - Interactive course enrollment system

- **User Experience**
  - Modern, responsive UI built with Material-UI
  - Real-time updates and notifications
  - Intuitive navigation and course discovery
  - Mobile-friendly design

## Technical Stack

- **Frontend**
  - React.js with functional components
  - Material-UI for modern UI components
  - Apollo Client for GraphQL integration
  - React Router for navigation
  - Context API for state management

- **Backend**
  - Node.js with Express
  - GraphQL API with Apollo Server
  - MongoDB with Mongoose ODM
  - JWT for authentication
  - Secure password hashing with bcrypt

- **Deployment**
  - Vercel for frontend deployment
  - Render for backend services
  - MongoDB Atlas for database hosting

## Project Highlights

- Implemented secure authentication system with JWT
- Developed real-time course management features
- Created responsive UI with Material-UI components
- Integrated GraphQL for efficient data fetching
- Implemented role-based access control
- Optimized for performance and scalability

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Set up environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## License

This project is licensed under the MIT License. 