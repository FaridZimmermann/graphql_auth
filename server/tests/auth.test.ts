import { ApolloServer } from "@apollo/server";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import typeDefs from "../src/schema";
import resolvers from "../src/resolvers";
import UserModel from "../models/User";
import jwt from "jsonwebtoken";

let server: ApolloServer;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  server = new ApolloServer({ typeDefs, resolvers });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("General Login tests")

describe("🔍 GraphQL Authentication Tests", () => {
  it("Should create a user with Google OAuth", async () => {
    const googleOAuthMutation = `
      mutation GoogleOAuth($token: String!) {
        googleOAuth(token: $token) {
          token
          user {
            email
            username
          }
        }
      }
    `;

    // Mock Google token
    const fakeGoogleUser = { id: "123", email: "test@example.com", name: "Test User" };
    const fakeToken = jwt.sign(fakeGoogleUser, "test-secret");

    const response = await server.executeOperation({
      query: googleOAuthMutation,
      variables: { token: fakeToken },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.googleOAuth.user.email).toBe("test@example.com");
  });

  it("Should not authenticate with an invalid token", async () => {
    const response = await server.executeOperation({
      query: `
        mutation GoogleOAuth($token: String!) {
          googleOAuth(token: $token) {
            token
          }
        }
      `,
      variables: { token: "invalid-token" },
    });

    expect(response.errors).toBeDefined();
  });

  it("Should signup a new user", async () => {
    const signupMutation = `
      mutation Signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
          token
          user {
            id
            email
            username
          }
        }
      }
    `;

    const response = await server.executeOperation({
      query: signupMutation,
      variables: {
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.signup.user.email).toBe("test@example.com");

    // Verify user exists in DB
    const userInDB = await User.findOne({ email: "test@example.com" });
    expect(userInDB).not.toBeNull();
  });

  it("Should login an existing user", async () => {
    // Create a test user manually
    const hashedPassword = await bcrypt.hash("testpassword", 10);
    await User.create({
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
    });

    const loginMutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            email
            username
          }
        }
      }
    `;

    const response = await server.executeOperation({
      query: loginMutation,
      variables: {
        email: "test@example.com",
        password: "testpassword",
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.login.user.email).toBe("test@example.com");
  });

  it("Should reject login with wrong password", async () => {
    const response = await server.executeOperation({
      query: `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
          }
        }
      `,
      variables: { email: "test@example.com", password: "wrongpassword" },
    });

    expect(response.errors).toBeDefined();
  });
});
