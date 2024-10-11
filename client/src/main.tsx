import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketProvider';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';

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

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
                <SocketProvider>
                    <Router>
                        <App />
                    </Router>
                </SocketProvider>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
