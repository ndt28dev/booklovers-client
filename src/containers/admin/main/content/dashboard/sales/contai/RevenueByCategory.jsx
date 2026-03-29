import { Card, Row, Col, ListGroup, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { fetchRevenueByCategory } from "../../../../../../../redux/slices/admin/SalesSlice";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Select from "react-select";

const RevenueByCategory = () => {
  const dispatch = useDispatch();

  const { data = [] } = useSelector(
    (state) => state.adminSales.revenueByCategory || {}
  );

  const [selected, setSelected] = useState(null);

  const startYear = 2023;
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState({
    value: currentYear,
    label: currentYear.toString(),
  });

  const yearOptions = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => {
      const year = currentYear - i;
      return { value: year, label: year.toString() };
    }
  );

  useEffect(() => {
    dispatch(fetchRevenueByCategory(year.value));
  }, [dispatch, year]);

  useEffect(() => {
    if (data.length > 0) {
      setSelected(data[0]);
    }
  }, [data]);

  const chartData = useMemo(() => {
    if (!selected) return [];

    return (selected.months || []).map((m) => ({
      month: `T${m.month}`,
      revenue: Number(m.revenue || 0),
      orders: Number(m.total_orders || 0),
      sold: Number(m.total_sold || 0),
    }));
  }, [selected]);

  return (
    <Card
      className="mb-3"
      style={{
        border: "none",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
      <Card.Body>
        <Row>
          <Col md={4} style={{ borderRight: "1px solid #eee" }}>
            <h6 className="fw-bold mb-3" style={{ color: "#E35765" }}>
              Danh mục
            </h6>

            <div
              style={{
                maxHeight: "420px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              <ListGroup variant="flush">
                {data.map((item) => (
                  <ListGroup.Item
                    key={item.category_id}
                    action
                    onClick={() => setSelected(item)}
                    style={{
                      cursor: "pointer",
                      padding: "10px",
                      borderRadius: "10px",
                      marginBottom: "6px",
                      backgroundColor:
                        selected?.category_id === item.category_id
                          ? "#e7f1ff"
                          : "",
                    }}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center justify-content-between flex-grow-1">
                      <div style={{ fontSize: "16px", fontWeight: 600 }}>
                        {item.category_name}
                      </div>

                      <small
                        style={{
                          fontWeight:
                            selected?.category_id === item.category_id
                              ? "600"
                              : "",
                        }}
                      >
                        {Number(item.total_revenue || 0).toLocaleString()}₫
                      </small>
                    </div>

                    <div style={{ width: "30px" }} className="text-end">
                      {selected?.category_id === item.category_id && (
                        <Badge bg="info">●</Badge>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>

          <Col md={8}>
            <div className="mb-2 d-flex align-items-center justify-content-between">
              <h6 className="fw-bold mb-0" style={{ color: "#E35765" }}>
                Doanh thu theo tháng
                <span className="ms-2">({selected?.category_name})</span>
              </h6>

              <Select
                options={yearOptions}
                value={year}
                onChange={(e) => {
                  setYear(e);
                  setSelected(null);
                }}
                placeholder="Chọn năm"
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
            <Row className="g-3">
              <Col md={4}>
                <div
                  className="p-3 rounded d-flex align-items-center"
                  style={{
                    background: "linear-gradient(135deg, #198754, #20c997)",
                    color: "#fff",
                  }}
                >
                  <i
                    className="bi bi-currency-dollar rounded-circle me-3 fs-5"
                    style={{
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.2)",
                    }}
                  ></i>

                  <div>
                    <div style={{ fontSize: "16px" }}>Doanh thu</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {Number(selected?.total_revenue || 0).toLocaleString()}₫
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={4}>
                <div
                  className="p-3 rounded d-flex align-items-center"
                  style={{
                    background: "linear-gradient(135deg, #ffc107, #ffcd39)",
                    color: "#fff",
                  }}
                >
                  <i
                    className="bi bi-cart rounded-circle me-3 fs-5"
                    style={{
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.2)",
                    }}
                  ></i>
                  <div>
                    <div style={{ fontSize: "16px" }}>Đơn hàng</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {selected?.total_orders || 0}
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={4}>
                <div
                  className="p-3 rounded d-flex align-items-center"
                  style={{
                    background: "linear-gradient(135deg, #0dcaf0, #6edff6)",
                    color: "#fff",
                  }}
                >
                  <i
                    className="bi bi-box-seam rounded-circle me-3 fs-5"
                    style={{
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.2)",
                    }}
                  ></i>
                  <div>
                    <div style={{ fontSize: "16px" }}>Số lượng đã bán</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {selected?.total_sold || 0}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <ResponsiveContainer width="100%" height={320} className={"mt-3"}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RevenueByCategory;
