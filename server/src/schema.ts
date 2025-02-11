import { gql } from "apollo-server";


const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        password: String
        token: String
    }

    type Query {
        me: User
    }

    type Mutation {
        googleOAuth(token: String!): User,
        register(email: String!, password: String!): User,
        login(email: String!, password: String!): User
    }

`

export default typeDefs;