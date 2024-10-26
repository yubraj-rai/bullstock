import { merge } from 'lodash';
import { StockResolver } from './Stock';
import { UserResolver } from './User';
import { OwnedStockResolver } from './OwnedStock';
import { TransactionResolver } from './Transactions';
import { marketNewsResolvers } from './MarketNews';
import { GraphQLScalarType, Kind } from 'graphql';
import { GraphQLJSON } from 'graphql-compose';
import { OtpResolver } from './Otp';

// Define the custom Date scalar type
const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value: Date) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
    },
    parseValue(value: string | number | Date) {
        return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast: any) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
        }
        return null; // Invalid hard-coded value (not an integer)
    },
});

// Merge all resolvers into a single object using lodash's merge function
export const resolvers = merge(
    StockResolver,
    UserResolver,
    OwnedStockResolver,
    TransactionResolver,
    marketNewsResolvers,
    OtpResolver,
    { Date: dateScalar },
    { JSON: GraphQLJSON }
);
