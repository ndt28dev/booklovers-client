import React from "react";
import "./Main.scss";

const Main = ({ children }) => {
  return (
    <div className="px-3 py-3" style={{ width: "100%", minHeight: "94vh" }}>
      {children}
    </div>
  );
};

export default Main;
