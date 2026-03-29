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

const CustomersTopBuy = () => {
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
    <Row className="mb-4">
      <Col md={6}>
        <Card className="p-3 shadow-sm">
          <h6>💰 CLV trung bình</h6>
          <h4>{data.avgCLV.toLocaleString()} đ</h4>
        </Card>
      </Col>

      <Col md={6}>
        <Card className="p-3 shadow-sm">
          <h6>🏆 CLV cao nhất</h6>
          <h4>{data.maxCLV.toLocaleString()} đ</h4>
          <small>{data.topCustomerName}</small>
        </Card>
      </Col>
    </Row>
  );

  {
    /* 🏆 3. TOP KHÁCH */
  }
  <Card className="p-3 shadow-sm mb-4">
    <h5>🏆 Top khách hàng</h5>

    <table className="table mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Tên</th>
          <th>Số đơn</th>
          <th>Tổng chi tiêu</th>
        </tr>
      </thead>
      <tbody>
        {data.topCustomers.map((c, index) => (
          <tr key={c.id}>
            <td>{index + 1}</td>
            <td>{c.name}</td>
            <td>{c.total_orders}</td>
            <td>{c.total_spent.toLocaleString()} đ</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>;

  {
    /* 🔥 ĐƠN LỚN NHẤT */
  }
  <Card className="p-3 shadow-sm mb-4">
    <h5>🔥 Đơn hàng lớn nhất</h5>

    <table className="table mt-3">
      <thead>
        <tr>
          <th>Tên</th>
          <th>Giá trị</th>
        </tr>
      </thead>
      <tbody>
        {data.topOrders.map((o, index) => (
          <tr key={index}>
            <td>{o.name}</td>
            <td>{o.total.toLocaleString()} đ</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>;

  {
    /* 📊 4. HÀNH VI */
  }
  <Row className="mb-4">
    <Col md={6}>
      <Card className="p-3 shadow-sm">
        <h5>⏰ Giờ mua hàng</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.hourData}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Col>

    <Col md={6}>
      <Card className="p-3 shadow-sm">
        <h5>📚 Top sách</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.topBooks}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sold" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Col>
  </Row>;
};
export default CustomersTopBuy;
