import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { setAuth } from "../../redux/slices/appSlice.ts";
import { LOGIN_USER } from "../graphql/mutations";
import { useNavigate } from "react-router-dom";

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
        
        // Save to Redux & LocalStorage
        dispatch(setAuth({ token, user }));
        
        // Redirect to dashboard or home
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
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        
        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        {error && <p className="text-red-500 mt-3 text-center">{error.message}</p>}
      </div>
    </div>
  );
};

export default Login;
