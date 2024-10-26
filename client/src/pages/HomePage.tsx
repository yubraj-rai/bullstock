import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import StockCard from '../components/StockCard';
import { GET_STOCKS } from '../graphql';
import { useQuery } from '@apollo/client';

const HomePage = () => {
    const { data } = useQuery(GET_STOCKS, { variables: { limit: 3, random: true } });

    useEffect(() => {
        document.title = 'Home | bullstock';
    }, []);

    return (
        <div className='dark:bg-darkBg flex flex-col min-h-screen items-center justify-center overflow-hidden'>
            <div className='flex justify-center min-h-screen items-center overflow-hidden p-10'>
                <section className='text-gray-600 body-font'>
                    <div className='container mx-auto flex md:px-16 py-24 lg:flex-row flex-col items-center'>
                        <div className='lg:flex-grow lg:w-1/2 pr-0 lg:pr-24 flex flex-col lg:items-start lg:text-left mb-16 lg:mb-0 items-center text-center'>
                            <h1 className='title-font sm:text-5xl text-3xl mb-4 font-medium text-gray-900 dark:text-white'>Bullstock</h1>
                            <p className='title-font sm:text-2xl text-xl mb-4 text-gray-700 dark:text-gray-300 whitespace-nowrap'>
                                A comprehensive stock trading platform
                            </p>
                            <p className='mb-8 sm:text-sm lg:text-lg leading-relaxed dark:text-gray-300'>
                            Bullstock is a dynamic stock trading platform that empowers users to trade stocks in real-time, manage investments, and monitor portfolio performance
                             with ease. Users can create secure accounts, access live stock prices, and buy or sell shares with a few clicks. The platform features detailed transaction
                              histories, personalized portfolio tracking, and up-to-the-minute market news, helping users make informed investment decisions. With secure balance
                               management and seamless trading tools, Bullstock provides a complete, user-friendly experience for anyone interested in stock trading and investment management.
                                <br />
                                <br />
                                <span className='font-bold'>No real money is involved.</span>
                            </p>
                            <div className='flex justify-center flex-nowrap'>
                                <Link
                                    to='/market'
                                    className='max-h-16 text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded whitespace-nowrap'>
                                    Browse Market
                                </Link>
                                <Link
                                    to='/auth'
                                    className='ml-4 max-h-16 text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded whitespace-nowrap'>
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <section className='text-gray-600 body-font w-full flex flex-col justify-center'>
                <h1 className='title-font text-center sm:text-2xl text-xl font-medium text-gray-900 dark:text-white'>Today's Featured Picks</h1>
                <div className='dark:bg-darkBg flex md:justify-center my-7 px-2 pb-4 overflow-x-scroll sm:overflow-hidden w-screen'>
                    {data?.searchStocks.map((stock: any) => {
                        return <StockCard key={stock.ticker} stock={stock} />;
                })}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
