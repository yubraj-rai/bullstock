import ReactDOM from 'react-dom';
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
import { GoogleOAuthProvider } from '@react-oauth/google'; // Keep this line
import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { VERIFY_USER, GET_OWNEDSTOCKS } from './graphql';
import { AUTH, OWNED_STOCKS } from './redux/actions';

function App() {
    const [getOwnedStocks, { data: ownedStocksData, loading: ownedStockLoading }] = useLazyQuery(GET_OWNEDSTOCKS);
    const [verifyUser, { data: userData, loading: userLoading }] = useLazyQuery(VERIFY_USER);
    const dispatch = useDispatch();
    const location = useLocation();

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
                </Routes>
                <Footer />
            </ScrollToTop>
        </AnimatePresence>
    );
}

ReactDOM.render(
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <App />
    </GoogleOAuthProvider>,
    document.getElementById('root')
);
