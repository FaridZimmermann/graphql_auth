import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/client.ts"; 
import store from "./redux/store.ts";
import Login from "./components/auth/Login.tsx";
import Signup from "./components/auth/Signup.tsx";
import Dashboard from "./components/Dashboard.tsx";
import "./App.css";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
