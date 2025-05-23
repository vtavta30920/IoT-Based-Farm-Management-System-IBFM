import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(UserContext);
  const storedRole = localStorage.getItem("role");

  if (!user || !storedRole) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(storedRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
