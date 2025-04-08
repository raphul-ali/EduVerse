import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://eduverse-2nmh.onrender.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  
  // Special handling for demo token
  if (token === 'demo-token') {
    // For demo token, don't send it to the server
    return {
      headers: {
        ...headers,
        'x-demo-mode': 'true', // Add a custom header to indicate demo mode
      },
    };
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error handling link
const errorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    // Check for authentication errors
    if (response.errors) {
      response.errors.forEach((error) => {
        // Don't clear token for demo user
        const token = localStorage.getItem('token');
        if (token === 'demo-token') {
          return;
        }
        
        if (error.message.includes('Not authenticated') || error.message.includes('Invalid token')) {
          // Clear token on authentication errors
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      });
    }
    return response;
  });
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client; 