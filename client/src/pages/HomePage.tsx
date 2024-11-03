import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    useEffect(() => {
        document.title = 'Home | Bullstock';
    }, []);

    return (
        <div className="dark:bg-darkBg flex flex-col min-h-screen items-center justify-center overflow-hidden px-10 sm:px-20 md:px-36 lg:px-56 xl:px-72">
            {/* Fullscreen Hero Section */}
            <div className="w-full h-screen flex flex-col lg:flex-row items-center justify-center space-y-16 lg:space-y-0 lg:space-x-20">

                {/* Left Column - Text and Button */}
                <div className="lg:w-1/2 w-full flex flex-col items-center lg:items-start text-center lg:text-left space-y-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-[#219cd7]">
                        Bullstock
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 dark:text-gray-300">
                        Redefine Your Trading Experience
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed mt-4">
                        Dive into a world of seamless, real-time stock trading. Bullstock empowers you to take control of your investments, monitor your portfolio, and make decisions with confidence—all on one intuitive platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 mt-8">
                        <Link
                            to="/market"
                            className="text-white bg-gradient-to-r from-[#219cd7] to-[#6dbfdd] py-3 px-10 rounded-full hover:shadow-xl transition-shadow text-lg font-semibold">
                            Browse Market
                        </Link>
                        <Link
                            to="/auth"
                            className="text-[#219cd7] bg-gray-100 py-3 px-10 rounded-full hover:bg-gray-200 transition-shadow text-lg font-semibold">
                            Get Started
                        </Link>
                    </div>
                </div>

                {/* Right Column - Styled Image */}
                <div className="lg:w-1/2 w-full flex justify-center lg:justify-end relative">
                    <div className="relative w-full h-full overflow-hidden rounded-lg shadow-2xl lg:max-h-[90vh]">
                        <img 
                            src="./stock-bg.jpg" 
                            alt="Stock Trading Illustration" 
                            className="object-cover w-full h-full transition-transform duration-500 ease-in-out transform hover:scale-105 rounded-lg"
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
