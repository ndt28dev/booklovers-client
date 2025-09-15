import React from "react";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/scrolltotop/ScrollToTop";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <>
      <ToastContainer autoClose={1000} position="top-right" />
      <ScrollToTop />
      <div style={{ userSelect: "none" }}>
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
