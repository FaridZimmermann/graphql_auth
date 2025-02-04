import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../graphql/mutations.ts";
import { setAuth } from "../../redux/slices/authSlice.ts";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [register, { loading, error }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      if (data.register.token) {
        const { token, user } = data.register;

        dispatch(setAuth({ token, user }));

        navigate("/dashboard");
      }
    },
    onError: (error) => {
      console.log(error)
      setErrorMessage(error.message);
    },
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter an email and password.");
      return;
    }
    await register({ variables: { email, password } });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        
        <form onSubmit={handleSignup}>
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
            className="button signup-btn"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        
        
        <p>
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
