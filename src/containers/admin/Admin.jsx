import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Main from "./main/Main";
import { Outlet } from "react-router-dom";
import Header from "./main/header/Header";
import { Col, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

const Admin = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <div style={{ userSelect: "none" }}>
      <Header
        handleList={() => setShowSidebar(!showSidebar)}
        showSidebar={showSidebar}
      />
      <Row
        className="g-0"
        style={{ marginTop: "40px", backgroundColor: "#F3F7FD" }}
      >
        <Sidebar show={showSidebar} />

        <Col style={{ maxWidth: showSidebar ? "242px" : "64px" }}></Col>
        <Col>
          <Main>
            <Outlet />
          </Main>
        </Col>
      </Row>
    </div>
  );
};

export default Admin;
