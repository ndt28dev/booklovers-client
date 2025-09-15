import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router>
      <StrictMode>
        <GoogleOAuthProvider clientId="350345075001-fbuaco9sep6b0paqavuonl1vo1bsq0lt.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </StrictMode>
    </Router>
  </Provider>
);
