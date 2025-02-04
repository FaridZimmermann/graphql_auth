import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { setAuth } from "../../redux/slices/authSlice.ts";
import { LOGIN_USER } from "../../graphql/mutations.ts";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [login, { loading, error }] = useMutation(LOGIN_USER, {
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
        
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        
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
