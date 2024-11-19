export const UserTypeDef = `#graphql

    scalar Date
    type User {
        _id: String!
        username: String!
        password: String!
        createdAt: Date!
        updatedAt: Date!
        balance: Float!
        isVerified: Boolean!
        stripeAccountId: String
    }

    type UserResponse {
        user: User
        token: String
    }

    type Query {
        getUser: UserResponse!
    }

    type Mutation {
        registerUser(username: String!, password: String!, confirmPassword: String!): UserResponse!
        loginUser(username: String!, password: String!): UserResponse!
        googleLogin(googleToken: String!): UserResponse
        sendOtp(username: String!): String
        verifyOtp(username: String!, otp: String!): String
        resetPassword(username: String!, password: String!, confirmPassword: String!): String
}
`;