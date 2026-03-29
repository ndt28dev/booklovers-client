import React, { useState, useEffect } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Select from "react-select";
import { fetchOrderStatusOverview } from "../../../../../../../redux/slices/admin/SalesSlice";

const StatusCard = ({ title, value, color, icon, bg }) => {
  return (
    <Card
      className="p-3 border-0 rounded"
      style={{
        background: bg,
        boxShadow: "rgba(0, 0, 0, 0.05) 0px 2px 8px",
        transition: "0.2s",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6
            className="mb-1"
            style={{
              color: color,
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {title}
          </h6>

          <h4
            className="mb-0"
            style={{
              color: color,
              fontWeight: "bold",
            }}
          >
            {value}
          </h4>
        </div>

        <div
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            background: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className={`bi ${icon}`}
            style={{
              fontSize: "20px",
              color: color,
            }}
          ></i>
        </div>
      </div>
    </Card>
  );
};

const OrderStatusOverview = () => {
  const dispatch = useDispatch();

  const { data, loading } = useSelector(
    (state) => state.adminSales.orderStatusOverview
  );

  const [year, setYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const startYear = 2023;

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  const options = years.map((y) => ({
    value: y,
    label: `${y}`,
  }));

  useEffect(() => {
    dispatch(fetchOrderStatusOverview(year));
  }, [dispatch, year]);

  const COLORS = {
    pending: "#FFC106",
    confirmed: "#0ECAF0",
    shipping: "#0C6EFD",
    delivered: "#198754",
    cancelled: "#DC3645",
    returned: "#6C757D",
  };

  const allStatusKeys = Object.keys(COLORS);

  const activeStatusKeys = allStatusKeys.filter((key) =>
    data?.monthly?.some((item) => item[key] > 0)
  );

  const getLabel = (key) => {
    switch (key) {
      case "pending":
        return "Đang chờ xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "shipping":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã huỷ";
      case "returned":
        return "Đã trả hàng";
      default:
        return key;
    }
  };

  return (
    <Card
      className=" mb-3"
      style={{
        border: "none",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
      <Card.Body>
        <Row>
          <div className="d-flex  gap-2 align-items-center mb-3">
            <h6 style={{ color: "#E35765", margin: 0, fontWeight: "bold" }}>
              Thống kê trạng thái đơn hàng theo năm
            </h6>
            <Select
              options={options}
              value={options.find((opt) => opt.value === year)}
              onChange={(selected) => setYear(selected.value)}
              isSearchable={false}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "34px",
                  fontSize: "16px",
                  cursor: "pointer",
                  width: "100px",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: "4px",
                }),
              }}
            />
          </div>
          <Col md={4}>
            <Row className="g-3">
              <Col md={6}>
                <StatusCard
                  title="Đang chờ xử lý"
                  value={data?.total?.pending || 0}
                  color="#FFC106"
                  bg="#FFF9E6"
                  icon="bi-hourglass-split"
                />
              </Col>
              <Col md={6}>
                <StatusCard
                  title="Đã xác nhận"
                  value={data?.total?.confirmed || 0}
                  color="#0ECAF0"
                  bg="#F3F2FF"
                  icon="bi-check-circle"
                />
              </Col>
              <Col md={6}>
                <StatusCard
                  title="Đang giao hàng"
                  value={data?.total?.shipping || 0}
                  color="#0C6EFD"
                  bg="#EAF2FF"
                  icon="bi-truck"
                />
              </Col>
              <Col md={6}>
                <StatusCard
                  title="Đã giao hàng"
                  value={data?.total?.delivered || 0}
                  color="#198754"
                  bg="#E9F7EF"
                  icon="bi-box-seam"
                />
              </Col>
              <Col md={6}>
                <StatusCard
                  title="Đã huỷ"
                  value={data?.total?.cancelled || 0}
                  color="#DC3545"
                  bg="#FDEBEC"
                  icon="bi-x-circle"
                />
              </Col>
              <Col md={6}>
                <StatusCard
                  title="Đã trả hàng"
                  value={data?.total?.returned || 0}
                  color="#6C757D"
                  bg="#F1F3F5"
                  icon="bi-arrow-counterclockwise"
                />
              </Col>
            </Row>
          </Col>
          <Col md={8}>
            <div style={{ height: 300 }}>
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : !data || data.length === 0 ? (
                <div className="text-center text-muted mt-3">
                  Không có dữ liệu cho năm này.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.monthly}
                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(value) => `T${parseInt(value)}`}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {activeStatusKeys.map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        name={getLabel(key)}
                        fill={COLORS[key]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default OrderStatusOverview;
