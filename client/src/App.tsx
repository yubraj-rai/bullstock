// React and Router
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Apollo Client
import { useLazyQuery, useQuery } from '@apollo/client';

// Redux
import { useDispatch } from 'react-redux';
import { AUTH, OWNED_STOCKS } from './redux/actions';

// GraphQL Queries
import { GET_OWNEDSTOCKS, GET_USER } from './graphql';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import AuthPage from './pages/AuthPage';
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import StockPage from './pages/StockPage';
import NewsPage from './pages/NewsPage';
import AccountPage from './pages/AccountPage';
import PortfolioPage from './pages/PortfolioPage';

// Other
import { AnimatePresence } from 'framer-motion';
import socket from './socket';
import './index.css';

function App() {
    const [getOwnedStocks, { data: ownedStocksData, loading: ownedStockLoading }] = useLazyQuery(GET_OWNEDSTOCKS);
    const { data: userData, loading: userLoading, refetch: refetchUser } = useQuery(GET_USER);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if (userData && !userLoading) {
            dispatch({ type: AUTH, payload: userData?.getUser });
        }
    }, [userData, userLoading, dispatch]);

    useEffect(() => {
        getOwnedStocks();
    }, [getOwnedStocks]);

    useEffect(() => {
        if (ownedStocksData && !ownedStockLoading) {
            dispatch({ type: OWNED_STOCKS, payload: ownedStocksData.ownedStocks });
        }
    }, [ownedStocksData, ownedStockLoading, dispatch]);

    // WebSocket connection setup
    useEffect(() => {
        // Listen for WebSocket events, e.g., "someEvent"
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('someEvent', (data) => {
            console.log('Received data:', data);
        });

        // Cleanup WebSocket listeners on component unmount
        return () => {
            socket.off('connect');
            socket.off('someEvent');
        };
    }, []);

    return (
        <AnimatePresence>
            <ScrollToTop>
                <Navbar />
                <Routes location={location} key={location.pathname}>
                    <Route index element={<HomePage />} />
                    <Route path='/market' element={<MarketPage />} />
                    <Route path='/auth' element={<AuthPage />} />
                    <Route path='/forget' element={<ForgetPasswordPage />} />
                    <Route path='/verify' element={<VerifyOtpPage />} />
                    <Route path='/reset' element={<ResetPasswordPage />} />
                    <Route path='/stock/:ticker' element={<StockPage ticker={useLocation().pathname.replace('/stock/', '')} />} />
                    <Route path='/news' element={<NewsPage />} />

                    <Route
                        path='/portfolio'
                        element={
                            <ProtectedRoute>
                                <PortfolioPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/account'
                        element={
                            <ProtectedRoute>
                                <AccountPage refetchUser={refetchUser} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>

                {location.pathname !== '/news' && <Footer />}
            </ScrollToTop>
        </AnimatePresence>
    );
}

export default App;
