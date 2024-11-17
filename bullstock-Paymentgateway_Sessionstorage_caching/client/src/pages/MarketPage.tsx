import { useEffect, useState } from 'react';
import StockCard from '../components/StockCard';
import { GET_STOCKS } from '../graphql';
import { useQuery } from '@apollo/client';

export default function MarketPage() {
    const { data, refetch } = useQuery(GET_STOCKS);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const searchOnChange = (event: any) => {
        setSearchQuery(event?.target?.value);
    };

    useEffect(() => {
        document.title = 'Market | Bullstock';
    }, []);

    useEffect(() => {
        refetch({ search: searchQuery });
    }, [searchQuery, refetch]);

    return (
        <div className='dark:bg-darkBg pb-10 min-h-screen w-full flex flex-col items-center text-center'>
            <div className='mt-40 text-3xl font-medium dark:text-white'>Browse the Market</div>
            <div className='mt-5 text-md px-5 md:text-xl text-gray-600 dark:text-gray-400'>
                Explore our selection of the biggest names in the industry.
            </div>

            {/* Search Bar */}
            <div className='w-full px-8 sm:px-12 md:px-14 lg:px-20 xl:px-60 mt-20'>
                <input
                    type='text'
                    id='market-search-input'
                    spellCheck='false'
                    className='w-full text-sm sm:text-base h-16 rounded-lg px-6 bg-white dark:bg-darkField text-gray-700 dark:text-gray-200 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 dark:focus:ring-gray-700'
                    placeholder='Search by ticker, company, description'
                    value={searchQuery}
                    onChange={searchOnChange}
                />
            </div>

            {/* Stock Cards Container with Matching Width */}
            <div className='w-full px-8 sm:px-12 md:px-14 lg:px-20 xl:px-40 flex flex-wrap justify-center mt-10'>
                {data?.searchStocks.map((stock: any) => (
                    <StockCard key={stock.ticker} stock={stock} />
                ))}
            </div>
        </div>
    );
}
