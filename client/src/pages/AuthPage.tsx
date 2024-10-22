import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AUTH, OWNED_STOCKS } from '../redux/actions';
import { LOGIN_USER, REGISTER_USER, GET_OWNEDSTOCKS } from '../graphql';
import { AuthState } from '../types';
import { useMutation, useLazyQuery } from '@apollo/client';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Added GoogleOAuthProvider and GoogleLogin
import CheckedIcon from '../assets/icons/checked.png';

const initialState = { username: '', password: '', confirmPassword: '' };

const Auth = () => {
    const [getOwnedStocks, { data: ownedStocksData }] = useLazyQuery(GET_OWNEDSTOCKS);
    const auth = useSelector((state: AuthState) => state.authReducer.authData);
    const [loginMutation] = useMutation(LOGIN_USER);
    const [registerMutation] = useMutation(REGISTER_USER);
    const [errors, setErrors] = useState('');
    const [form, setForm] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = 'Authorization | Bullstock';
    }, []);

    const switchMode = () => {
        setIsLoading(false);
        setIsSignup((prevIsSignup) => !prevIsSignup);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        if (isSignup) {
            registerMutation({ variables: { username: form.username, password: form.password, confirmPassword: form.confirmPassword } })
                .then(({ data }) => {
                    setErrors('');
                    dispatch({ type: AUTH, payload: data?.registerUser });
                    dispatch({ type: OWNED_STOCKS, payload: {} });
                    navigate(location?.state?.redirect || '/market');
                })
                .catch((err) => {
                    setErrors(err?.message);
                    setIsLoading(false);
                });
        } else {
            loginMutation({ variables: { username: form.username, password: form.password } })
                .then(({ data }) => {
                    setErrors('');
                    dispatch({ type: AUTH, payload: data?.loginUser });

                    getOwnedStocks();

                    if (ownedStocksData) {
                        dispatch({ type: OWNED_STOCKS, payload: ownedStocksData?.ownedStocks });
                    }

                    navigate(location?.state?.redirect || '/account');
                })
                .catch((err) => {
                    setErrors(err?.message);
                    setIsLoading(false);
                });
        }
    };

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGoogleSuccess = (response: any) => {
        const token = response.credential; // You will get the ID token here
        // Send token to backend for verification or log the user in
        console.log("Google login successful!", token);
        // dispatch login and navigate here
    };

    const handleGoogleError = () => {
        console.log("Google login failed.");
    };

    return (
        <GoogleOAuthProvider clientId="862657557573-uhnm5lc6otqjuvcfc2e6ctch86dg9p9f.apps.googleusercontent.com"> {/* Add your Google client ID here */}
            <div className='dark:bg-darkBg h-screen w-full flex flex-auto items-center text-center'>
                <div className='w-full max-w-sm mx-auto overflow-hidden bg-white dark:bg-darkField text-gray-700 dark:text-gray-200 rounded-2xl shadow-xl'>
                    {!auth?.user ? (
                        <>
                        <div className='p-8 relative'>
                            <h2 className='text-3xl font-bold text-center text-gray-700 dark:text-white'>Bullstock</h2>

                            <h3 className='mt-1 text-xl font-medium text-center text-gray-600 dark:text-gray-200'></h3>

                            <p className='mt-1 text-center text-gray-500 dark:text-gray-400'>{isSignup ? 'Create an account.' : 'Login to your account.'}</p>

                            <form onSubmit={handleSubmit} name='auth_form'>
                                <div className='w-full mt-4'>
                                    <input
                                        className='block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:placeholder-gray-400 focus:border-pink-600 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent'
                                        type='text'
                                        required
                                        placeholder='Username'
                                        aria-label='Username'
                                        name='username'
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='w-full mt-4'>
                                    <input
                                        className='block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:placeholder-gray-400 focus:border-pink-600 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent'
                                        type='password'
                                        required
                                        placeholder='Password'
                                        aria-label='Password'
                                        name='password'
                                        onChange={handleChange}
                                    />
                                </div>

                                {isSignup && (
                                    <div className='w-full mt-4'>
                                        <input
                                            className='block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:placeholder-gray-400 focus:border-pink-600 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent'
                                            type='password'
                                            required
                                            placeholder='Confirm Password'
                                            aria-label='Confirm Password'
                                            name='confirmPassword'
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}

                                {errors && (
                                    <div className='mt-4 flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800'>
                                        <div className='flex items-center justify-center w-12 bg-red-700 dark:bg-red-700'>
                                            <svg className='w-6 h-6 text-white fill-current' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'>
                                                <path d='M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z' />
                                            </svg>
                                        </div>

                                        <div className='px-4 py-2 -mx-3'>
                                            <div className='mx-3'>
                                                <span className='font-semibold text-red-700 dark:text-red-700'>
                                                    Error: <span className='text-sm text-red-700 dark:text-red-700'>{errors}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className='flex items-center justify-center mt-5'>
                                    <button
                                        className='flex items-center justify-center w-full px-6 py-2 font-medium text-white transition-colors duration-200 transform bg-pink-600 rounded-md hover:bg-pink-700 focus:bg-pink-700 focus:outline-none'
                                        type='submit'>
                                        {isLoading && (
                                            <svg
                                                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                <path
                                                    className='opacity-75'
                                                    fill='currentColor'
                                                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                                </svg>
                                        )}
                                        {isSignup ? 'Sign Up' : 'Login'}
                                    </button>
                                </div>
                            </form>

                            <div className='flex items-center justify-center py-4 text-center'>
                                <p className='text-sm text-gray-600 dark:text-gray-200'>
                                    {isSignup ? 'Already have an account?' : 'Don’t have an account?'}&nbsp;
                                    <button onClick={switchMode} className='text-pink-600 focus:outline-none'>
                                        {isSignup ? 'Login' : 'Sign Up'}
                                    </button>
                                </p>
                            </div>

                            <div className='flex items-center justify-center py-4 text-center'>
                                <p className='text-sm text-gray-600 dark:text-gray-200'>OR</p>
                            </div>

                            <div className='flex items-center justify-center'>
                                <div style={{ width: '100%' }}> {/* Wrap the GoogleLogin component in a div for styling */}
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                    ) : (
                        <div className='flex flex-col items-center justify-center w-full h-full'>
                            <h3 className='text-3xl font-bold'>Welcome back, {auth?.user?.username}</h3>
                            <img src={CheckedIcon} alt="Checked Icon" className='w-24 h-24 mt-4' />
                            <p className='text-xl'>You are successfully logged in!</p>
                        </div>
                    )}
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Auth;
