import { gql } from '@apollo/client';

export const LOGIN_USER = gql(`
    mutation LoginUser($username: String!, $password: String!) {
        loginUser(username: $username, password: $password) {
            user {
                _id
                balance
                username
            }
            token
        }
    }
`);

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

export const VERIFY_USER = gql(`
    query GetUser {
        getUser {
            user {
                _id
                username
                balance
            }
            token
        }
    }
`);


export const CHANGE_USERNAME = gql(`
    mutation ChangeUsername($newUsername: String!, $confirmPassword: String!) {
        changeUsername(newUsername: $newUsername, confirmPassword: $confirmPassword) {
            newUsername
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

export const RESET_PASSWORD = gql(`
  mutation ResetPassword($username: String!, $password: String!) {
    resetPassword(username: $username, password: $password)
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
    query {
        getMarketNews {
            title
            description
            url
            imageUrl
            publishedAt
        }
    }
`;
