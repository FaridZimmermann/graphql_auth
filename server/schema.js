const {gql} = require('apollo-server');

module.exports = gql`
    type User {
       id: ID!,
       email: String!,
       password: String!,
       token: String
    }

    type Query {
        me: User
    }

    type Mutation {
    register(email: String!, password: String!): User,
    login(email: String!, password: String!): User
    }
`