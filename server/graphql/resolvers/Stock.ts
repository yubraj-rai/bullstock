import { Stock } from '../../models/Stock';

export const StockResolver = {
    Query: {
        searchStocks: async (_, { search = null, limit, random }) => {
            let searchQuery = {};

            // run if search is provided
            if (search) {
                searchQuery = {
                    $or: [
                        { ticker: { $regex: new RegExp(search, 'i') } },
                        { name: { $regex: new RegExp(search, 'i') } },
                        { ipo: { $regex: new RegExp(search, 'i') } },
                    ],
                };
            }
            

            if (random === false) {
                // run query to find users
                const stocks = await Stock.find(searchQuery)
                    .sort({ name: 1 })
                    .limit(limit);
            
                return stocks;
            }
            else {
                const stocks = await Stock.aggregate([{ $match: searchQuery }, { $sample: { size: limit } }]).sort({ ['name']: 1 });

                return stocks;
            }
        },
        stock: async (_, { ticker }) => {
            const stock = await Stock.findOne({ ticker });
            return stock;
        },
    },
};