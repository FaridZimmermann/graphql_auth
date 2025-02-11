import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Login from "../../src/components/auth/Login";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from "../../src/redux/store.ts";
import { ApolloProvider } from "@apollo/client";
import client from "../../src/graphql/client.ts"; 

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


describe("Login Component", () => {
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
