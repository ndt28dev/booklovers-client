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
    pending: "#FFBB28",
    confirmed: "#8884d8",
    shipping: "#0088FE",
    delivered: "#82ca9d",
    cancelled: "#FF4D4F",
    returned: "gray",
  };

  const allStatusKeys = Object.keys(COLORS);

  const activeStatusKeys = allStatusKeys.filter(
    (key) => data && data.some((item) => item[key] > 0)
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
    <Row className="g-4 mb-4">
      <Col md={8}>
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body style={{ maxHeight: "370px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ color: "#E35765", margin: 0 }}>
                Thống kê trạng thái đơn hàng theo năm
              </h5>

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
                    data={data} // ✅ fix
                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
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
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OrderStatusOverview;
