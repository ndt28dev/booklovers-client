import { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchRevenueStats } from "../../../../../../../redux/slices/admin/SalesSlice";

const RevenueOverview = () => {
  const dispatch = useDispatch();

  const { loading, data, error } = useSelector(
    (state) => state.adminSales.revenue
  );

  useEffect(() => {
    dispatch(fetchRevenueStats());
  }, []);

  return (
    <>
      {data && (
        <Row>
          <Col md={3}>
            <Card
              className=" mb-3 "
              style={{
                border: "none",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
              }}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="me-1 fw-bold" style={{ color: "#E35765" }}>
                    Doanh thu tuần {data.week.label}
                  </span>
                </div>
                <div className="d-flex justify-content-start align-items-center">
                  <i
                    className="bi bi-currency-dollar rounded-circle me-3 fs-5"
                    style={{
                      backgroundColor: "#fff1f3",
                      color: "#E35765",
                      padding: "10px 14px",
                    }}
                  ></i>
                  <div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {Number(data.week.current).toLocaleString("vi-VN")}đ
                    </div>
                    <div
                      className={`${
                        Number(data.week.growth) > 0
                          ? "text-success"
                          : Number(data.week.growth) < 0
                          ? "text-warning"
                          : "text-muted"
                      }`}
                    >
                      {Number(data.week.growth) > 0 && (
                        <>
                          <i className="bi bi-graph-up-arrow me-1"></i>
                          {Number(data.week.growth)}% so với tuần trước
                        </>
                      )}

                      {Number(data.week.growth) < 0 && (
                        <>
                          <i className="bi bi-graph-down-arrow me-1"></i>
                          {Math.abs(Number(data.week.growth))}% so với tuần
                          trước
                        </>
                      )}

                      {Number(data.week.growth) === 0 && <>Không thay đổi</>}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className=" mb-3 "
              style={{
                border: "none",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
              }}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="me-1 fw-bold" style={{ color: "#E35765" }}>
                    Doanh thu tháng {data.month.label}
                  </span>
                </div>
                <div className="d-flex justify-content-start align-items-center">
                  <i
                    className="bi bi-currency-dollar rounded-circle me-3 fs-5"
                    style={{
                      backgroundColor: "#fff1f3",
                      color: "#E35765",
                      padding: "10px 14px",
                    }}
                  ></i>
                  <div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {Number(data.month.current).toLocaleString("vi-VN")}đ
                    </div>
                    <div
                      className={`${
                        Number(data.month.growth) > 0
                          ? "text-success"
                          : Number(data.month.growth) < 0
                          ? "text-warning"
                          : "text-muted"
                      }`}
                    >
                      {Number(data.month.growth) > 0 && (
                        <>
                          <i className="bi bi-graph-up-arrow me-1"></i>
                          {Number(data.month.growth)}% so với tháng trước
                        </>
                      )}

                      {Number(data.month.growth) < 0 && (
                        <>
                          <i className="bi bi-graph-down-arrow me-1"></i>
                          {Math.abs(Number(data.month.growth))}% so với tháng
                          trước
                        </>
                      )}

                      {Number(data.month.growth) === 0 && <>Không thay đổi</>}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className=" mb-3 "
              style={{
                border: "none",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
              }}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="me-1 fw-bold" style={{ color: "#E35765" }}>
                    Doanh thu trong quý {data.quarter.label}
                  </span>
                </div>
                <div className="d-flex justify-content-start align-items-center">
                  <i
                    className="bi bi-currency-dollar rounded-circle me-3 fs-5"
                    style={{
                      backgroundColor: "#fff1f3",
                      color: "#E35765",
                      padding: "10px 14px",
                    }}
                  ></i>
                  <div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {Number(data.quarter.current).toLocaleString("vi-VN")}đ
                    </div>
                    <div
                      className={`${
                        Number(data.quarter.growth) > 0
                          ? "text-success"
                          : Number(data.quarter.growth) < 0
                          ? "text-warning"
                          : "text-muted"
                      }`}
                    >
                      {Number(data.quarter.growth) > 0 && (
                        <>
                          <i className="bi bi-graph-up-arrow me-1"></i>
                          {Number(data.quarter.growth)}% so với quý trước
                        </>
                      )}

                      {Number(data.quarter.growth) < 0 && (
                        <>
                          <i className="bi bi-graph-down-arrow me-1"></i>
                          {Math.abs(Number(data.quarter.growth))}% so với quý
                          trước
                        </>
                      )}

                      {Number(data.quarter.growth) === 0 && <>Không thay đổi</>}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className=" mb-3 "
              style={{
                border: "none",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
              }}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="me-1 fw-bold" style={{ color: "#E35765" }}>
                    Doanh thu trong năm {data.year.label}
                  </span>
                </div>
                <div className="d-flex justify-content-start align-items-center">
                  <i
                    className="bi bi-currency-dollar rounded-circle me-3 fs-5"
                    style={{
                      backgroundColor: "#fff1f3",
                      color: "#E35765",
                      padding: "10px 14px",
                    }}
                  ></i>
                  <div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {Number(data.year.current).toLocaleString("vi-VN")}đ
                    </div>
                    <div
                      className={`${
                        Number(data.year.growth) > 0
                          ? "text-success"
                          : Number(data.year.growth) < 0
                          ? "text-warning"
                          : "text-muted"
                      }`}
                    >
                      {Number(data.year.growth) > 0 && (
                        <>
                          <i className="bi bi-graph-up-arrow me-1"></i>
                          {Number(data.year.growth)}% so với năm trước
                        </>
                      )}

                      {Number(data.year.growth) < 0 && (
                        <>
                          <i className="bi bi-graph-down-arrow me-1"></i>
                          {Math.abs(Number(data.year.growth))}% so với năm trước
                        </>
                      )}

                      {Number(data.year.growth) === 0 && <>Không thay đổi</>}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};
export default RevenueOverview;
