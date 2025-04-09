require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const jwt = require('jsonwebtoken');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://eduverse-2nmh.onrender.com', 'https://edu-verse-sigma.vercel.app'],
  credentials: true
}));

// Add a simple route handler for the root path
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>EduVerse API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          h1 {
            color: #1976d2;
          }
          .endpoint {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
          }
          code {
            background-color: #e0e0e0;
            padding: 2px 5px;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to EduVerse API</h1>
        <p>This is the backend API for the EduVerse online learning platform.</p>
        <p>The GraphQL endpoint is available at:</p>
        <div class="endpoint">
          <code>https://eduverse-2nmh.onrender.com/graphql</code>
        </div>
        <p>You can use the GraphQL Playground to explore the API:</p>
        <div class="endpoint">
          <a href="/graphql" target="_blank">GraphQL Playground</a>
        </div>
        <p>For more information, please visit the <a href="https://github.com/raphul-ali/EduVerse" target="_blank">GitHub repository</a>.</p>
      </body>
    </html>
  `);
});

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set. Using default connection string.');
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eduverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Get the user token from the headers
    const token = req.headers.authorization || '';
    
    // Try to retrieve a user with the token
    try {
      if (token && process.env.JWT_SECRET) {
        const user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        return { user };
      }
    } catch (err) {
      console.error('Token verification error:', err);
    }
    
    return { user: null };
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
    };
  },
  playground: true,
  introspection: true,
  cors: {
    origin: ['http://localhost:3000', 'https://eduverse-2nmh.onrender.com', 'https://edu-verse-sigma.vercel.app'],
    credentials: true
  }
});

// Start Apollo Server
async function startServer() {
  await server.start();
  server.applyMiddleware({ 
    app,
    path: '/graphql',
    cors: {
      origin: ['http://localhost:3000', 'https://eduverse-2nmh.onrender.com'],
      credentials: true
    }
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Start the server
startServer().catch(err => {
  console.error('Error starting server:', err);
}); 