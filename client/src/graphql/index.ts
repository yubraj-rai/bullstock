import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      user {
        _id
        username
        createdAt
        updatedAt
        balance
        stripeAccountId
        isKycVerified
      }
      token
    }
  }
`;

export const GET_TRANSACTIONS = gql(`
  query GetTransactions {
      transactions {
          userId
          type
          ticker
          shares
          totalAmount
          stockPrice
          date
      }
  }
`);

export const GET_USER = gql`
    query GetUser {
        getUser {
            user {
                _id
                username
                balance
                stripeAccountId
                isKycVerified
            }
            token
        }
    }
`;


export const CREATE_STRIPE_SESSION = gql`
  mutation CreateStripeSession($amount: Float!) {
    createStripeSession(amount: $amount) {
      sessionId
      url
    }
  }
`;

export const DEPOSIT = gql`
  mutation Deposit($amount: Float!) {
    deposit(amount: $amount) {
      success
      message
      newBalance
    }
  }
`;

export const WITHDRAW = gql`
  mutation Withdraw($amount: Float!) {
    withdraw(amount: $amount) {
      success
      message
      newBalance
    }
  }
`;

export const CREATE_STRIPE_ACCOUNT_LINK = gql`
  mutation CreateStripeAccountLink($userId: String!) {
    createStripeAccountLink(userId: $userId) {
      success
      url
      stripeAccountId
    }
  }
`;


export const VERIFY_PAYMENT = gql`
  mutation VerifyPayment($userId: String!, $sessionId: String!) {
    verifyPayment(userId: $userId, sessionId: $sessionId) {
      success
      message
      amount
      newBalance
    }
  }
`;


export const REGISTER_USER = gql(`
    mutation RegisterUser($username: String!, $password: String!, $confirmPassword: String!) {
        registerUser(username: $username, password: $password, confirmPassword: $confirmPassword) {
            user {
                _id
                balance
                username
            }
            token
        }
    }
`);


export const SEND_OTP = gql(`
  mutation SendOtp($username: String!) {
    sendOtp(username: $username)
  }
`);

export const VERIFY_OTP = gql(`
  mutation VerifyOtp($username: String!, $otp: String!) {
    verifyOtp(username: $username, otp: $otp)
  }
`);

export const GOOGLE_LOGIN = gql(`
  mutation GoogleLogin($googleToken: String!) {
    googleLogin(googleToken: $googleToken) {
      user {
        _id
        username
        balance
      }
      token
    }
  }
`);

export const GET_STOCKS = gql(`
  query SearchStocks($search: String, $limit: Int, $random: Boolean) {
      searchStocks(search: $search, limit: $limit, random: $random) {
          ticker
          name
          exchange
          price
          logo
          ipo
          industry
          country
          currency
          weburl
      }
  }
`);

export const GET_OWNEDSTOCKS = gql(`
  query GetOwnedStocks {
      ownedStocks {
          _id
          userId
          ticker
          shares
          initialInvestment
          name
          exchange
          price
          logo
          ipo
          industry
          country
          currency
          weburl
      }
  }
`);

export const BUY_STOCK = gql(`
  mutation BuyStock($ticker: String!, $shares: Int!) {
      buyStock(ticker: $ticker, shares: $shares) {
          ownedStock {
              _id
              userId
              ticker
              shares
              initialInvestment
              logo
              price
          }
          newBalance
      }
  }
`);

export const SELL_STOCK = gql(`
  mutation SellStock($ticker: String!, $shares: Int!) {
      sellStock(ticker: $ticker, shares: $shares) {
          ownedStock {
              _id
              userId
              ticker
              shares
              initialInvestment
          }
          newBalance
      }
  }
`);

export const GET_STOCK = gql(`
  query GETSTOCK($ticker: String) {
      stock(ticker: $ticker) {
          ticker
          name
          exchange
          price
          logo
          ipo
          industry
          country
          currency
          weburl
      }
  }
`);

export const GET_MARKET_NEWS = gql`
    query GetMarketNews($limit: Int!, $offset: Int!) {
        getMarketNews(limit: $limit, offset: $offset) {
            title
            description
            url
            imageUrl
            publishedAt
        }
    }
`;
