import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
    }
  }
`;

export const GOOGLE_OAUTH = gql`
  mutation GoogleOAuth($token: String!) {
    googleOAuth(token: $token) {
      token
    }
  }
`;
