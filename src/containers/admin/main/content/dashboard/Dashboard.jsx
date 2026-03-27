import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "./Dashboard.scss";
import StatisticalSales from "./sales/StatisticalSales";
import StatisticalReviews from "./reviews/StatisticalReviews";
import StatisticalCustomers from "./customers/StatisticalCustomers";
import StatisticalProducts from "./products/StatisticalProducts";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("sales");

  return (
    <div className="dashboard-container">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
        id="dashboard-tabs"
      >
        <Tab eventKey="sales" title="Thống kê bán hàng">
          <StatisticalSales />
        </Tab>

        <Tab eventKey="customers" title="Thống kê khách hàng">
          <StatisticalCustomers />
        </Tab>

        <Tab eventKey="products" title="Thống kê sản phẩm / kho hàng">
          <StatisticalProducts />
        </Tab>

        <Tab eventKey="reviews" title="Thống kê phản hồi & đánh giá">
          <StatisticalReviews />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Dashboard;
