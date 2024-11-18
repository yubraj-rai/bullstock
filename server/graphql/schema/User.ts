export const UserTypeDef = `#graphql

    scalar Date
    type User {
        _id: String!
        username: String!
        password: String!
        createdAt: Date!
        updatedAt: Date!
        balance: Float!
        googleId: String
        otp: String
        otpExpiry: Date
        stripeAccountId: String
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
        changeUsername(newUsername: String!, confirmPassword: String!): usernameChangeResponse!
        googleLogin(googleToken: String!): UserResponse
        sendOtp(username: String!): String
        verifyOtp(username: String!, otp: String!): String
        resetPassword(username: String!, password: String!, confirmPassword: String!): String
}
`;