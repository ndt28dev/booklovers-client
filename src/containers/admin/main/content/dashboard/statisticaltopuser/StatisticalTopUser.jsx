import React, { useState, useEffect } from "react";
import { Card, Col, Image, Form, Row } from "react-bootstrap";
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
import {
  fetchTopBuyers,
  fetchOrderStatusByMonth,
} from "../../../../../../redux/slices/admin/statisticSlice";
import API_URL from "../../../../../../config/api";

const StatisticalTopUser = () => {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector(
    (state) => state.statistics.topBuyer
  );
  const { orderStatusByMonth } = useSelector(
    (state) => state.statistics.statusByMonth
  );

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [selectedYear1, setSelectedYear1] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const startYear = 2023;

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      dispatch(fetchTopBuyers({ month: selectedMonth, year: selectedYear }));
    }
  }, [dispatch, selectedMonth, selectedYear]);

  useEffect(() => {
    dispatch(fetchOrderStatusByMonth({ year: selectedYear1 }));
  }, [dispatch, selectedYear1]);

  const COLORS = {
    pending: "#FFBB28",
    confirmed: "#8884d8",
    shipping: "#82ca9d",
    delivered: "#0088FE",
    cancelled: "#FF4D4F",
    returned: "#AA00FF",
  };

  const allStatusKeys = Object.keys(COLORS);

  const activeStatusKeys = allStatusKeys.filter((key) =>
    orderStatusByMonth.some((item) => item[key] > 0)
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
    data && (
      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card
            className="h-100  border-0"
            style={{
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
            }}
          >
            <Card.Body style={{ maxHeight: "370px" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 style={{ color: "#E35765", margin: 0 }}>
                  Thống kê trạng thái đơn hàng theo năm
                </h5>
                <Form.Select
                  value={selectedYear1}
                  onChange={(e) => setSelectedYear1(Number(e.target.value))}
                  style={{ width: "auto", minWidth: 120 }}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      Năm {y}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div style={{ height: 300 }}>
                {activeStatusKeys.length === 0 ? (
                  <div className="text-center text-muted mt-3">
                    Không có dữ liệu cho năm này.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={orderStatusByMonth}
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

        <Col md={4}>
          <Card
            className="h-100  border-0"
            style={{
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
            }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="me-4" style={{ color: "#E35765" }}>
                  Khách hàng nổi bật
                </h5>
                <div className="d-flex gap-2">
                  <Form.Select
                    size="sm"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    style={{ width: "100px" }}
                  >
                    {[...Array(12)].map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        Tháng {idx + 1}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select
                    size="sm"
                    value={selectedYear}
                    style={{ width: "110px" }}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        Năm {y}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>

              <div style={{ minHeight: "290px", overflowY: "auto" }}>
                {!loading && !error && data.length === 0 && (
                  <p>
                    Không có dữ liệu cho tháng {selectedMonth}/{selectedYear}
                  </p>
                )}
                {!loading && (
                  <div style={{ maxHeight: "290px", overflowY: "auto" }}>
                    {data.map((user, idx, arr) => (
                      <div
                        key={idx}
                        className={`d-flex justify-content-between align-items-center ${
                          idx < arr.length - 1 ? "mb-3" : ""
                        }`}
                      >
                        <div className="d-flex align-items-center">
                          <Image
                            src={
                              user?.avatar?.startsWith("https://")
                                ? user.avatar
                                : `${API_URL}/avatar/${user?.avatar}`
                            }
                            roundedCircle
                            width={40}
                            height={40}
                            className="me-2"
                          />
                          <div>
                            <div className="fw-bold">{user.fullname}</div>
                            <div className="text-muted small">{user.email}</div>
                          </div>
                        </div>
                        <span>
                          {Number(user.totalSpent).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )
  );
};

export default StatisticalTopUser;
