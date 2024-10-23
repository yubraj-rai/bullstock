import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className='bg-gray-200 dark:bg-darkBg pt-6 pb-2 flex-shrink'>
            <div className='container px-8 sm:px-16 mx-auto'>
                <div className='flex justify-around'>
                    <div className='w-full -mx-6 lg:w-2/5'>
                        <div className='px-6'>
                            <div>
                                <Link to='/' className='text-xl font-bold text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'>
                                    BullStocks
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className='h-px my-6 bg-gray-300 border-none dark:bg-gray-700' />

                <div>
                    <p className='text-center text-gray-800 dark:text-white'>© bullstock {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    );
}
