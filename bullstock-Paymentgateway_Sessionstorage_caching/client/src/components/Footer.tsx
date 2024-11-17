import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[#e0f7fa] to-[#f3f4f6] dark:bg-gradient-to-br dark:from-[#333c44] dark:to-[#22272e] py-12 text-gray-800 dark:text-gray-200">
            <div className="container mx-auto px-4 sm:px-6">

                {/* Brand, Quick Links, and Contact Information */}
                <div className="flex flex-col md:flex-row justify-around items-start md:items-center space-y-8 md:space-y-0 md:space-x-8">
                    
                    {/* Brand and Description */}
                    <div className="flex flex-col items-center md:items-start md:w-1/3">
                        <Link to="/" className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2596be] to-[#56bbdb] dark:from-[#56bbdb] dark:to-[#2596be] hover:opacity-90 transition-opacity">
                            BullStocks
                        </Link>
                        <p className="mt-4 text-gray-700 dark:text-gray-400 max-w-sm text-center md:text-left leading-relaxed">
                            Take control of your financial future with BullStocks, your comprehensive platform for real-time trading, portfolio management, and market insights.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center md:items-center md:w-1/3">
                        <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#2596be] to-[#56bbdb] dark:from-[#56bbdb] dark:to-[#2596be]">
                            Quick Links
                        </h3>
                        <div className="flex flex-col space-y-2 text-gray-600 dark:text-gray-400">
                            <Link to="/" className="hover:text-[#2596be] dark:hover:text-[#74c1d7]">Home</Link>
                            <Link to="/market" className="hover:text-[#2596be] dark:hover:text-[#74c1d7]">Market</Link>
                            <Link to="/news" className="hover:text-[#2596be] dark:hover:text-[#74c1d7]">News</Link>
                            <Link to="/account" className="hover:text-[#2596be] dark:hover:text-[#74c1d7]">Account</Link>
                        </div>
                    </div>

                    {/* Contact Information and GitHub */}
                    <div className="flex flex-col items-center md:items-end md:w-1/3">
                        <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#2596be] to-[#56bbdb] dark:from-[#56bbdb] dark:to-[#2596be]">
                            Connect Us
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">Email: <a href="mailto:support@bullstocks.com" className="hover:text-[#2596be] dark:hover:text-[#74c1d7]">support@bullstocks.com</a></p>
                        <p className="text-gray-600 dark:text-gray-400">Phone: <a href="tel:+1234567890" className="hover:text-[#2596be] dark:hover:text-[#74c1d7]">+1 (234) 567-890</a></p>
                        <a href="https://github.com/yubraj-rai/bullstock" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#2596be] dark:hover:text-[#74c1d7] transition-colors">
                            <FaGithub size={20} />
                            <span className="text-sm font-medium">GitHub Repository</span>
                        </a>
                    </div>
                </div>

                <hr className="my-8 border-t border-gray-300 dark:border-gray-600" />

                {/* Social Media Links */}
                <div className="flex justify-center space-x-8 mb-8">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-[#2596be] dark:hover:text-[#74c1d7] transition-transform transform hover:scale-110">
                        <FaTwitter size={28} />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-[#2596be] dark:hover:text-[#74c1d7] transition-transform transform hover:scale-110">
                        <FaFacebook size={28} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-[#2596be] dark:hover:text-[#74c1d7] transition-transform transform hover:scale-110">
                        <FaLinkedin size={28} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-[#2596be] dark:hover:text-[#74c1d7] transition-transform transform hover:scale-110">
                        <FaInstagram size={28} />
                    </a>
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-500 dark:text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} BullStocks. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
