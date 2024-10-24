export const UserTypeDef = `#graphql

    scalar Date
    type User {
        _id: String!
        username: String!
        email: String!
        password: String!
        authProvider: String!
        createdAt: Date!
        updatedAt: Date!
        balance: Float!
        isVerified: Boolean!
        verificationToken: String!
    }

        type UserResponse {
        user: User
        token: String
    }

    type Query {
        getUser: UserResponse!
    }

    type balanceResponse {
        newBalance: Float!
    }

    type usernameChangeResponse {
        newUsername: String!
    }

    type Mutation {
        registerUser(username: String!, password: String!, confirmPassword: String!): UserResponse!
        loginUser(username: String!, password: String!): UserResponse!
        deposit(amount: Float!): balanceResponse!
        withdraw(amount: Float!): balanceResponse!
        changeUsername(newUsername: String!, confirmPassword: String!): usernameChangeResponse!
    }
`;