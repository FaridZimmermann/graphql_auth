// Login.tsx
// This component provides the user login functionality. It includes a form where users can 
// enter their email and password to authenticate themselves and receive a JWT token on successful login.

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { setAuth } from "../../redux/slices/authSlice.ts";
import { LOGIN_USER, GOOGLE_OAUTH } from "../../graphql/mutations.ts";
import { Link, useNavigate } from "react-router-dom";
import Error from "../Error.tsx";
import "./Login.css";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      if (data.login.token) {
        const { token, user } = data.login;
        
        dispatch(setAuth({ token, user }));
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
  let googleOAuth;
  [googleOAuth, {loading, error}] = useMutation(GOOGLE_OAUTH, {
    onCompleted: (data) => {
      if (data?.googleOAuth?.token) {
        const { token, user } = data.googleOAuth;
        
        dispatch(setAuth({ token, user }));
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleGoogleLogin = async () => {
    const googleUser = await window.gapi.auth2.getAuthInstance().signIn();
    const token = googleUser.getAuthResponse().id_token;

     await googleOAuth({ variables: { token } });

  };




  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    await login({ variables: { email, password } });
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        
        {errorMessage && <Error error={errorMessage}/>}
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="button login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      <div>
      <p>Not registered yet? </p>
      <Link to="/signup">Sign Up</Link>
      </div>
        
      </div>
    </div>
  );
};

export default Login;
