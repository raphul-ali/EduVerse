# EduVerse - Online Learning Platform

EduVerse is a modern online learning platform that combines video lectures, PDF materials, and progress tracking in a user-friendly interface. The platform supports role-based access (admin/teacher/student) and includes premium course features with payment integration.

## Features

- Role-based authentication (admin/teacher/student)
- Video lecture streaming (YouTube embed or AWS S3)
- PDF reading without download option
- Course progress tracking
- Premium course access with payment gateway
- Modern, responsive UI with Material-UI

## Tech Stack

- Frontend: React.js, Material-UI, Apollo Client
- Backend: Node.js, Express, GraphQL
- Database: MongoDB
- Authentication: JWT
- Payment Processing: Stripe
- File Storage: AWS S3

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- AWS Account (for S3 storage)
- Stripe Account (for payments)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/eduverse.git
cd eduverse
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eduverse
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
eduverse/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── apollo/        # Apollo Client configuration
│   │   └── ...
├── models/                 # MongoDB models
├── graphql/               # GraphQL schema and resolvers
├── middleware/            # Express middleware
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 