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
const store = createStore(reducers, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

const httpLink = createHttpLink({
    uri: `${import.meta.env.VITE_API_URI || ''}/graphql`,
});

const authLink = setContext((_, { headers }) => {
    const { token }: { token: string } = JSON.parse(localStorage.getItem('profile') || '{}');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

// Ensure to use ReactDOM.createRoot for React 18+
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <SocketProvider>
                        <Router>
                            {/* Use Vite environment variable for Google Client ID */}
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
