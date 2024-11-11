// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './pages/App';
import client from './apollo/client';
import { store, persistor } from './redux/store';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// Register the service worker for caching
serviceWorkerRegistration.register();