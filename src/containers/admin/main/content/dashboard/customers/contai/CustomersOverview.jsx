import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const CustomersOverview = () => {
  const [data, setData] = useState({
    totalCustomers: 1200,
    newCustomers: 120,
    returningCustomers: 340,
    aov: 250000,

    avgCLV: 1200000,
    maxCLV: 15000000,
    topCustomerName: "Nguyễn Văn A",

    topCustomers: [
      { id: 1, name: "Nguyễn Văn A", total_orders: 12, total_spent: 15000000 },
      { id: 2, name: "Trần Thị B", total_orders: 10, total_spent: 12000000 },
      { id: 3, name: "Lê Văn C", total_orders: 8, total_spent: 9000000 },
    ],

    topOrders: [
      { name: "Nguyễn Văn A", total: 5000000 },
      { name: "Trần Thị B", total: 4200000 },
    ],

    hourData: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      orders: Math.floor(Math.random() * 20),
    })),

    topBooks: [
      { title: "Đắc Nhân Tâm", sold: 120 },
      { title: "Nhà Giả Kim", sold: 100 },
      { title: "Dám Nghĩ Lớn", sold: 80 },
    ],

    vipCustomers: [
      { id: 1, name: "Nguyễn Văn A", orders: 12, spent: 15000000 },
      { id: 2, name: "Trần Thị B", orders: 10, spent: 12000000 },
    ],
  });

  return (
    <div className="container mt-4">
      <Row className="mb-4">
        <Col md={3}>
          <Card className="p-3 shadow-sm">
            👥 Tổng khách
            <h4>{data.totalCustomers}</h4>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm">
            🆕 Khách mới
            <h4>{data.newCustomers}</h4>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm">
            🔁 Khách quay lại
            <h4>{data.returningCustomers}</h4>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm">
            💸 AOV
            <h4>{data.aov.toLocaleString()} đ</h4>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomersOverview;
