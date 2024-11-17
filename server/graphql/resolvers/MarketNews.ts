import { fetchAndStoreNews } from '../../utils/fetchAndStoreNews';

export const marketNewsResolvers = {
    Query: {
        async getMarketNews() {
            try {
                const news = await fetchAndStoreNews();
                return news;
            } catch (error) {
                console.error('Error in getMarketNews resolver:', error);
                return [];
            }
        },
    },
};
