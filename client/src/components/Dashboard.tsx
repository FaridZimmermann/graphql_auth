import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice.ts";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";


const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state: any) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Welcome, {user?.email}!</h2>
        <p>You are logged in.</p>
        <button
          onClick={handleLogout}
          className="button logout-btn"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
