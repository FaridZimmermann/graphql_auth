import request from "supertest";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import startServer, { startTestServer, stopTestServer  } from "../src/index"; 

let server: any;

beforeEach(async () => {
  server = await startServer();
});

afterEach(async () => {
  await stopTestServer();
});

describe("Authentication Tests", () => {
  const signupMutation = `
    mutation Signup($email: String!, $password: String!) {
      signup(email: $email, password: $password) {
        token
        user {
          id
          email
        }
      }
    }
  `;

  const loginMutation = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
          email
        }
      }
    }
  `;

  it("should signup a new user", async () => {
    const response = await request(server)
      .post("/graphql")
      .send({
        query: signupMutation,
        variables: {
          email: "test@example.com",
          password: "password123",
        },
      });
      console.error(response.body);

    expect(response.body.data.signup.user.email).toBe("test@example.com");
    expect(response.body.data.signup.token).toBeDefined();
  });

  it("should login an existing user", async () => {
    // Ensure user exists before logging in
    await request(server)
      .post("/graphql")
      .send({
        query: signupMutation,
        variables: {
          email: "test@example.com",
          password: "password123",
        },
      });

    const response = await request(server)
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
    const response = await request(server)
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
