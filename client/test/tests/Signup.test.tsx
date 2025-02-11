import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Signup from "../../src/components/auth/Signup";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../src/redux/store.ts";
import { vi } from "vitest";
import { ApolloProvider } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { REGISTER_USER } from "../../src/graphql/mutations";
import client from "../../src/graphql/client.ts"; 


const WrappedSignup = ({children}) => {
    return <ApolloProvider client={client}>
              <Provider store={store}>
                    <BrowserRouter>
                      <Signup>
                      {children}
                      </Signup>
                    </BrowserRouter>
              </Provider>
    </ApolloProvider>
  }
  
describe("Signup Component Rendering", () => {
  it("renders the signup form", () => {
    render(<WrappedSignup />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it("allows users to type in fields", () => {
    render(<WrappedSignup />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("renders the signup button", () => {
    render(<WrappedSignup />);

    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });
});



//Error Testing


const mocks = [
    {
      request: {
        query: REGISTER_USER,
        variables: {
          email: "taken@example.com", // Email that already exists
          password: "password123",
        }
      },
      result: {
        errors: [
          {
            message: "User already exists"
          }
        ]
      }
    },
    {
      request: {
        query: REGISTER_USER,
        variables: {
          email: "newuser@example.com", // New email
          password: "password123",
        }
      },
      result: {
        data: {
          signup: {
            user: {
              email: "newuser@example.com"
            }
          }
        }
      }
    },

    {
          request: {
            query: REGISTER_USER,
            variables: {
              email: "",  // Email and password fields empty
              password: ""
            }
          },
          result: {
            errors: [
              {
                message: "Please enter an email and password."
              }
            ]
          }
      }
  ];


  describe("Signup Component Error Handling", () => {
    it("displays error when email already exists", async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <WrappedSignup />
        </MockedProvider>
      );
  
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "taken@example.com" }
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" }
      });
      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
  
      await waitFor(() => screen.getByText("User already exists"));
      expect(screen.getByText("User already exists")).toBeInTheDocument();
    });


     it("displays error when email and/or password is missing", async () => {
        render(
          <MockedProvider mocks={mocks} addTypename={false}>
            <WrappedSignup />
          </MockedProvider>
        );
    
        fireEvent.change(screen.getByPlaceholderText("Email"), {
          target: { value: "" }
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
          target: { value: "" }
        });
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    
        await waitFor(() => screen.getByText("Please enter an email and password."));
        expect(screen.getByText("Please enter an email and password.")).toBeInTheDocument();
      });
    
  });
  