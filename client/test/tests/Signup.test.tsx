import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Signup from "../../src/components/auth/Signup";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from "../../src/redux/store.ts";
import { ApolloProvider } from "@apollo/client";
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
  
describe("Signup Component", () => {
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
