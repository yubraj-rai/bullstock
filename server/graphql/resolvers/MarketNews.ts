// import { fetchAndStoreNews } from '../../utils/fetchAndStoreNews';

// export const marketNewsResolvers = {
//     Query: {
//         async getMarketNews() {
//             try {
//                 const news = await fetchAndStoreNews();
//                 return news;
//             } catch (error) {
//                 console.error('Error in getMarketNews resolver:', error);
//                 return [];
//             }
//         },
//     },
// };

import { fetchAndStoreNews } from '../../utils/fetchAndStoreNews';

export const marketNewsResolvers = {
    Query: {
        async getMarketNews(_: any, { limit, offset }: { limit: number; offset: number }) {
            try {
                // Fetch news items with pagination
                const news = await fetchAndStoreNews(limit, offset);                
                return news;
            } catch (error) {
                console.error('Error in getMarketNews resolver:', error);
                return [];
            }
        },
    },
};
