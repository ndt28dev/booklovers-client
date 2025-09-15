import React from "react";
import { Row, Form, Spinner, Button } from "react-bootstrap";
import "./Dashboard.scss";
import StatisticalHeader from "./statisticalheader/StatisticalHeader";
import StatisticalOverview from "./statisticaloverview/StatisticalOverview";
import StatisticalTopUser from "./statisticaltopuser/StatisticalTopUser";
import StatisticalTopOrder from "./statisticaltoporder/StatisticalTopOrder";

const Dashboard = () => {
  return (
    <div>
      <h4 className="fw-bold mb-3" style={{ color: "#E35765" }}>
        Trang chủ
      </h4>

      <StatisticalHeader />
      <StatisticalOverview />
      <StatisticalTopUser />
      <StatisticalTopOrder />
    </div>
  );
};

export default Dashboard;
