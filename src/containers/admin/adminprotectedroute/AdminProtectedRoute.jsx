import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const tokenAdmin = localStorage.getItem("tokenAdmin");

  if (!tokenAdmin) {
    return <Navigate to="/admin/dang-nhap" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
