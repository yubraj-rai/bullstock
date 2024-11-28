import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SocketProvider } from './contexts/SocketProvider';
import { createStore } from 'redux';
import reducers from './redux/reducers';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Create Redux store
const store = createStore(reducers);

const httpLink = createHttpLink({
    uri: `${import.meta.env.VITE_API_URI || ''}/graphql`,
});

// const authLink = setContext((_, { headers }) => {
//     const profile = localStorage.getItem('profile');
//     const token = profile ? JSON.parse(profile).token : '';

//     // Debug log for the token
//     console.log('Token being set in headers:', token);

//     return {
//         headers: {
//             ...headers,
//             authorization: token ? `Bearer ${token}` : '',
//         },
//     };
// });

const authLink = setContext((_, { headers }) => {
    const profile = localStorage.getItem('profile');
    const token = profile ? JSON.parse(profile).token : '';

    // Avoid double "Bearer" prefix
    const authorizationHeader = token.startsWith('Bearer') ? token : `Bearer ${token}`;

    return {
        headers: {
            ...headers,
            authorization: token ? authorizationHeader : '',
        },
    };
});


const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <SocketProvider>
                        <Router>
                            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
                                <App />
                            </GoogleOAuthProvider>
                        </Router>
                    </SocketProvider>
                </Provider>
            </ApolloProvider>
        </React.StrictMode>
    );
}