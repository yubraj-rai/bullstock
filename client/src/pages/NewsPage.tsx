// import { useEffect } from 'react';
// import { useQuery } from '@apollo/client';
// import { GET_MARKET_NEWS } from '../graphql';

// export default function NewsPage() {
//     const { data, loading, error } = useQuery(GET_MARKET_NEWS);

//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     }, []);

//     if (loading) {
//         console.log("Loading news...");
//     }
//     if (error) {
//         console.error("Error loading news:", error.message);
//     }

//     const extractDomain = (url) => {
//         try {
//             const hostname = new URL(url).hostname;
//             return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
//         } catch (error) {
//             return 'Unknown Source';
//         }
//     };

    
//     const timeAgo = (date) => {
//         const now = new Date().getTime();
//         const publishedDate = new Date(date).getTime();
//         const differenceInMilliseconds = now - publishedDate;

//         const hours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
//         const days = Math.floor(hours / 24);

//         if (days > 0) {
//             return `${days} day${days > 1 ? 's' : ''} ago`;
//         } else if (hours > 0) {
//             return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//         } else {
//             const minutes = Math.floor(differenceInMilliseconds / (1000 * 60));
//             return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
//         }
//     };

//     return (
//         <div className="dark:bg-darkBg pb-10 min-h-screen w-full flex flex-col items-center">
//             <h1 className="mt-32 text-3xl font-semibold text-[#2596be] dark:text-[#56bbdb]">Stock Market News</h1>
//             <div className="w-full max-w-7xl mt-10 px-4 md:px-6 lg:px-8 space-y-6">
//                 {data?.getMarketNews.map((news, index) => (
//                     <div 
//                         key={index} 
//                         className="flex flex-col lg:flex-row items-start bg-[#fafbfd] dark:bg-[#333c44] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform duration-150"
//                     >
//                         {news.imageUrl && (
//                             <img src={news.imageUrl} alt="news" className="w-full lg:w-1/4 h-48 lg:h-auto object-cover" />
//                         )}
//                         <div className="p-5 flex-1">
//                             <div className="text-sm text-[#2596be] dark:text-[#56bbdb] flex items-center space-x-2 font-medium">
//                                 <span>{extractDomain(news.url)}</span>
//                                 <span>•</span>
//                                 <span>{timeAgo(news.publishedAt)}</span>
//                             </div>
//                             <h2 className="mt-2 text-xl font-bold text-gray-800 dark:text-white">{news.title}</h2>
//                             <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
//                                 {news.description}
//                             </p>
//                             <a
//                                 href={news.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="mt-3 text-[#2596be] dark:text-[#56bbdb] hover:text-[#219cd7] dark:hover:text-[#74c1d7] block text-right font-semibold transition-colors">
//                                 Read more
//                             </a>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { GET_MARKET_NEWS } from '../graphql';

const LIMIT = 10; // Number of news items to fetch per request

export default function NewsPage() {
    const [allNews, setAllNews] = useState<any[]>([]);
    const [offset, setOffset] = useState<number>(0);

    const { data, loading, error, fetchMore } = useQuery(GET_MARKET_NEWS, {
        variables: { limit: LIMIT, offset: 0 },
        fetchPolicy: "cache-and-network",
        onCompleted: (initialData) => {
            // Initialize with the first set of news
            setAllNews(initialData.getMarketNews);
        },
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (loading && offset === 0) return <p>Loading news...</p>;
    if (error) return <p>Error loading news: {error.message}</p>;

    const loadMoreNews = () => {
        const newOffset = offset + LIMIT;
        fetchMore({
            variables: { limit: LIMIT, offset: newOffset },
        }).then(({ data }) => {
            // Append new data to allNews to avoid duplicates
            setAllNews((prevNews) => [...prevNews, ...data.getMarketNews]);
            setOffset(newOffset); // Update offset for the next load
        });
    };

    const extractDomain = (url) => {
        try {
            const hostname = new URL(url).hostname;
            return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
        } catch (error) {
            return 'Unknown Source';
        }
    };
    
    const timeAgo = (date) => {
        const now = new Date().getTime();
        const publishedDate = new Date(date).getTime();
        const differenceInMilliseconds = now - publishedDate;

        const hours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const minutes = Math.floor(differenceInMilliseconds / (1000 * 60));
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div className="dark:bg-darkBg pb-10 min-h-screen w-full flex flex-col items-center">
            <h1 className="mt-32 text-3xl font-semibold text-[#2596be] dark:text-[#56bbdb]">Stock Market News</h1>
            <div className="w-full max-w-7xl mt-10 px-4 md:px-6 lg:px-8 space-y-6">
                {allNews.map((news, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col lg:flex-row items-start bg-[#fafbfd] dark:bg-[#333c44] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform duration-150"
                    >
                        {news.imageUrl && (
                            <img src={news.imageUrl} alt="news" className="w-full lg:w-1/4 h-48 lg:h-auto object-cover" />
                        )}
                        <div className="p-5 flex-1">
                            <div className="text-sm text-[#2596be] dark:text-[#56bbdb] flex items-center space-x-2 font-medium">
                            <span>{extractDomain(news.url)}</span>
                            <span>•</span>
                                <span>{timeAgo(news.publishedAt)}</span>
                            </div>
                            <h2 className="mt-2 text-xl font-bold text-gray-800 dark:text-white">{news.title}</h2>
                            <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                                {news.description}
                            </p>
                            <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 text-[#2596be] dark:text-[#56bbdb] hover:text-[#219cd7] dark:hover:text-[#74c1d7] block text-right font-semibold transition-colors">
                                Read more
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                onClick={loadMoreNews}
                className="mt-6 px-4 py-2 bg-[#2596be] text-white font-semibold rounded-md hover:bg-[#207cab] transition duration-150">
                Load More
            </button>
        </div>
    );
}
