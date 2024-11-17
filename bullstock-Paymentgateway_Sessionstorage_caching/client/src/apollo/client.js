// // src/apollo/client.js
// import { ApolloClient, InMemoryCache } from '@apollo/client';

// const client = new ApolloClient({
//   uri: process.env.REACT_APP_GRAPHQL_ENDPOINT, // Set this endpoint in your .env file
//   cache: new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           getTransactions: {
//             read(existing) {
//               return existing;
//             },
//             merge(existing = [], incoming) {
//               return [...incoming];
//             },
//           },
//         },
//       },
//     },
//   }),
// });

// export default client;

// src/apollo/client.js
import { ApolloClient, HttpLink } from '@apollo/client';
import { cache } from '../cache/cacheConfig';  // Import custom cache configuration

const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_ENDPOINT }),
  cache: cache,  // Use the custom cache
});

export default client;