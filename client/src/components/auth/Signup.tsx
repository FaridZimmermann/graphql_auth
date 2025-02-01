import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../graphql/mutations";
import { setAuth } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

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
    <div className="">
      <div className="">
        <h2 className="">Sign Up</h2>
        
        {errorMessage && <p className="">{errorMessage}</p>}
        
        <form onSubmit={handleSignup} className="">
          <input
            type="email"
            placeholder="Email"
            className=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className=""
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        
        {error && <p className="">{error.message}</p>}
        
        <p className="">
          Already have an account?{" "}
          <a href="/login" className="">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
