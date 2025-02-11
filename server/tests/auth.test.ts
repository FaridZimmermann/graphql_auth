import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import  typeDefs from '../src/schema';
import  resolvers from '../src/resolvers';

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create an HTTP server instance to listen to requests
const httpServer = http.createServer(app);

beforeAll(async () => {
  // Start Apollo Server before the tests begin
  await server.start();
  server.applyMiddleware({ app });

  // Start the HTTP server for testing
  httpServer.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
});

afterAll(async () => {
  // Ensure the server stops after all tests are complete
  await server.stop();
  httpServer.close();
});


//Tests

describe("Authentication Tests", () => {
  const signupMutation = `
    mutation Signup($email: String!, $password: String!) {
      register(email: $email, password: $password) {
        token
        id
        email
      }
    }
  `;

  const loginMutation = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        id
        email
        
      }
    }
  `;

  it("should signup a new user", async () => {
    const response = await request(httpServer)
      .post("/graphql")
      .send({
        query: signupMutation,
        variables: {
          email: "test@example.com",
          password: "password123",
        },
      });
      console.error("HERE", response.body);

    expect(response.body.data.signup.user.email).toBe("test@example.com");
    expect(response.body.data.signup.token).toBeDefined();
  });

  it("should login an existing user", async () => {
    // Ensure user exists before logging in
    await request(httpServer)
      .post("/graphql")
      .send({
        query: signupMutation,
        variables: {
          email: "test@example.com",
          password: "password123",
        },
      });

    const response = await request(httpServer)
      .post("/graphql")
      .send({
        query: loginMutation,
        variables: {
          email: "test@example.com",
          password: "password123",
        },
      });

    expect(response.body.data.login.user.email).toBe("test@example.com");
    expect(response.body.data.login.token).toBeDefined();
  });

  it("should fail login with wrong credentials", async () => {
    const response = await request(httpServer)
      .post("/graphql")
      .send({
        query: loginMutation,
        variables: {
          email: "wrong@example.com",
          password: "wrongpassword",
        },
      });

    expect(response.body.errors).toBeDefined();
  });
});
