import { Card, Row, Col } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const RevenueOfTheDay = ({ data }) => {
  const overview = data?.overview || {
    revenue: 12500000,
    orders: 120,
    products: 340,
    aov: 104000,
  };

  const statusData = data?.status || [
    { name: "Đang chờ xử lý", value: 20 },
    { name: "Đã xác nhận", value: 30 },
    { name: "Đang giao hàng", value: 25 },
    { name: "Đã giao hàng", value: 35 },
    { name: "Đã huỷ", value: 10 },
    { name: "Đã trả hàng", value: 30 },
  ];

  const COLORS = [
    "#FFC106",
    "#0ECAF0",
    "#0C6EFD",
    "#198754",
    "#DC3645",
    "#6C757D",
  ];

  const formatMoney = (num) => num?.toLocaleString("vi-VN") + " đ";

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
        <h6
          className="mb-3"
          style={{ color: "#E35765", margin: 0, fontWeight: "bold" }}
        >
          Thống kê doanh thu & đơn hàng trong ngày
        </h6>
        <Row className="align-items-center d-flex">
          <Col md={6}>
            <Row>
              <Col xs={6} className="mb-3">
                <div
                  className="p-3 rounded d-flex align-items-center"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #818cf8)",
                    color: "#fff",
                  }}
                >
                  <i
                    className="bi bi-currency-dollar me-3  fs-5"
                    style={{
                      padding: "10px 14px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: 18,
                    }}
                  ></i>

                  <div>
                    <div style={{ fontSize: "16px" }}>Doanh thu</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {overview.revenue.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={6} className="mb-3">
                <div
                  className="p-3 rounded d-flex align-items-center"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                    color: "#fff",
                  }}
                >
                  <i
                    className="bi bi-cart  me-3 fs-5"
                    style={{
                      padding: "10px 14px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: 18,
                    }}
                  ></i>

                  <div>
                    <div style={{ fontSize: "16px" }}>Đơn hàng</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {overview.orders}
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={6}>
                <div
                  className="p-3 rounded d-flex align-items-center"
                  style={{
                    background: "linear-gradient(135deg, #198754, #20c997)",
                    color: "#fff",
                  }}
                >
                  <i
                    className="bi bi-box-seam  me-3 fs-5"
                    style={{
                      padding: "10px 14px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: 18,
                    }}
                  ></i>

                  <div>
                    <div style={{ fontSize: "16px" }}>Sản phẩm</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {overview.products}
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={6}>
                <div
                  className="p-3 rounded d-flex align-items-center"
                  style={{
                    background: "linear-gradient(135deg, #ec4899, #f472b6)",
                    color: "#fff",
                  }}
                >
                  <i
                    className="bi bi-graph-up-arrow me-3 fs-5"
                    style={{
                      padding: "10px 14px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: 18,
                    }}
                  ></i>

                  <div>
                    <div style={{ fontSize: "16px" }}>AOV</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {overview.aov.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={6}>
            <Row>
              <Col xs={7}>
                <ResponsiveContainer width="100%" height={205}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      outerRadius={70}
                      label={({ value }) => value}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Col>

              <Col xs={5}>
                {statusData.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between mb-2"
                  >
                    <div>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          background: COLORS[index],
                          display: "inline-block",
                          borderRadius: "50%",
                          marginRight: 6,
                        }}
                      />
                      {item.name}
                    </div>
                    <span>{item.value}</span>
                  </div>
                ))}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RevenueOfTheDay;
