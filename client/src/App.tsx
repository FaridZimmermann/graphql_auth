import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/client"; 
import store from "./redux/store";
import Login from "./components/auth/Login";
import Dashboard from "./components/Dashboard";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector((state: any) => state.app.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
