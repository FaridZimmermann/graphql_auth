import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state: any) => state.app.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="">
      <div className="">
        <h2 className="">Welcome, {user?.email}!</h2>
        <p className="">You are logged in.</p>
        <button
          onClick={handleLogout}
          className=""
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
