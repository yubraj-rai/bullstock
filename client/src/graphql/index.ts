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
