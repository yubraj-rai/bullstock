import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import { AnimatePresence } from 'framer-motion';
import AuthPage from './pages/AuthPage';
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
// import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { VERIFY_USER, GET_OWNEDSTOCKS } from './graphql';
import { AUTH, OWNED_STOCKS } from './redux/actions';
import StockPage from './pages/StockPage';
import socket from './socket';
import axios from 'axios';
import Stripe from 'react-stripe-checkout';
import NewsPage from './pages/NewsPage';
import AccountPage from './pages/AccountPage';


function App() {
    const [getOwnedStocks, { data: ownedStocksData, loading: ownedStockLoading }] = useLazyQuery(GET_OWNEDSTOCKS);
    const [verifyUser, { data: userData, loading: userLoading }] = useLazyQuery(VERIFY_USER);
    const dispatch = useDispatch();
    const location = useLocation();

    const handleToken = (totalAmount, token) => {
        try {
            axios.post("http://localhost:5000/api/stripe/pay", {
                token: token.id,
                amount: totalAmount
            });
        } catch (error) {
            console.log(error);
        }
    };

    const tokenHandler = (token) => {
        handleToken(1000, token); 
    };

    useEffect(() => {
        verifyUser();
    }, [verifyUser]);

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
                        path='/account'
                        element={
                                <AccountPage />
                        }
                    />
                </Routes>

                <div>
                    <Stripe
                        stripeKey="pk_test_51QFejRD5fVcCMFTPPfY3M1VyzywDA0fTQfKOgPsaNcAx5L9m7lpxFZs3uAewxthsSs28vDPn2lpXEcb7EFwFqBLb00sKLbu0LO"
                        token={tokenHandler}
                    />
                </div>

                {location.pathname !== '/news' && <Footer />}
            </ScrollToTop>
        </AnimatePresence>
    );
}

export default App;
