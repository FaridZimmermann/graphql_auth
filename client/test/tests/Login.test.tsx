import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Login from "../../src/components/auth/Login";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../src/redux/store.ts";
import { ApolloProvider } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import client from "../../src/graphql/client.ts"; 
import { LOGIN_USER } from "../../src/graphql/mutations.ts";


const WrappedLogin = ({children}) => {
  return <ApolloProvider client={client}>
            <Provider store={store}>
                  <BrowserRouter>
                    <Login>
                    {children}
                    </Login>
                  </BrowserRouter>
            </Provider>
  </ApolloProvider>
}


describe("Login Component Rendering", () => {
  it("renders the login form", () => {
    render(<WrappedLogin />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it("allows users to type in email and password", () => {
    render(<WrappedLogin />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("renders the login button", () => {
    render(<WrappedLogin />);

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});



//Error testing

// Mock GraphQL responses for different error cases
const mocks = [
  {
    request: {
      query: LOGIN_USER,
      variables: {
        email: "test@example.com",
        password: "wrongpassword"
      }
    },
    result: {
      errors: [
        {
          message: "Incorrect password"
        }
      ]
    }
  },
  {
    request: {
      query: LOGIN_USER,
      variables: {
        email: "nonexistent@example.com",  // Email that does not exist
        password: "password123"
      }
    },
    result: {
      errors: [
        {
          message: "User with this email does not exist"
        }
      ]
    }

    
  },
    {
      request: {
        query: LOGIN_USER,
        variables: {
          email: "",  // Email and password fields empty
          password: ""
        }
      },
      result: {
        errors: [
          {
            message: "Please enter both email and password."
          }
        ]
      }
  }

];



describe("Login Component Error Handling", () => {
  it("displays error when incorrect password is provided", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WrappedLogin />
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" }
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => screen.getByText("Invalid password"));
    expect(screen.getByText("Invalid password")).toBeInTheDocument();
  });


  it("displays error when email does not exist", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WrappedLogin />
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "nonexistent@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" }
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => screen.getByText("User does not exist"));
    expect(screen.getByText("User does not exist")).toBeInTheDocument();
  });



  it("displays error when email and/or password is missing", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WrappedLogin />
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "" }
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "" }
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => screen.getByText("Please enter both email and password."));
    expect(screen.getByText("Please enter both email and password.")).toBeInTheDocument();
  });

})