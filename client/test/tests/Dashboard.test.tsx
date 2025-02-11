import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../../src/components/Dashboard";
import { Provider } from 'react-redux';
import store from "../../src/redux/store.ts";
import { ApolloProvider } from "@apollo/client";
import client from "../../src/graphql/client.ts"; 


const WrappedDashboard = ({children}) => {
    return <ApolloProvider client={client}>
              <Provider store={store}>
                    <BrowserRouter>
                      <Dashboard>
                      {children}
                      </Dashboard>
                    </BrowserRouter>
              </Provider>
    </ApolloProvider>
  }

describe("Dashboard Component", () => {
  it("renders the dashboard page", () => {
    render(<WrappedDashboard />);
    
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });

  it("renders the logout button", () => {
    render(<WrappedDashboard />);

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });
});
