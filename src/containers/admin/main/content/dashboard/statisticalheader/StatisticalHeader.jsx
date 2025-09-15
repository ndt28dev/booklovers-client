import React, { use, useEffect } from "react";
import { Card, Row, Col, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatisticsHeader } from "../../../../../../redux/slices/admin/statisticSlice";
import { Link } from "react-router-dom";

const StatisticalHeader = () => {
  const dispatch = useDispatch();

  const { loading, data, error } = useSelector(
    (state) => state.statistics.statisticsheader
  );

  useEffect(() => {
    dispatch(fetchStatisticsHeader());
  }, [dispatch]);

  return (
    <Row className="mb-2">
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
                Đơn hàng
              </span>
              <Link
                to="/admin/don-hang"
                className="text-primary"
                style={{ fontSize: "0.9rem", textDecoration: "none" }}
              >
                Xem chi tiết
                <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <i
                className="bi bi-cart rounded-circle me-3 fs-5"
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
                  {data?.totalOrders}
                </div>
                <div
                  className={`${
                    Number(data?.totalOrdersChange) > 0
                      ? "text-success"
                      : Number(data?.totalOrdersChange) < 0
                      ? "text-warning"
                      : "text-muted"
                  }`}
                >
                  {Number(data?.totalOrdersChange) > 0 && (
                    <>
                      <i className="bi bi-graph-up-arrow me-1"></i>
                      {Number(data?.totalOrdersChange)}% so với tháng trước
                    </>
                  )}

                  {Number(data?.totalOrdersChange) < 0 && (
                    <>
                      <i className="bi bi-graph-down-arrow me-1"></i>
                      {Math.abs(Number(data?.totalOrdersChange))}% so với tháng
                      trước
                    </>
                  )}

                  {Number(data?.totalOrdersChange) === 0 && <>Không thay đổi</>}
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
                Doanh thu
              </span>
              <Link
                to="/admin/don-hang"
                className="text-primary"
                style={{ fontSize: "0.9rem", textDecoration: "none" }}
              >
                Xem chi tiết
                <i className="bi bi-arrow-right ms-1"></i>
              </Link>
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
                  {Number(data?.revenue).toLocaleString("vi-VN")} VNĐ
                </div>
                <div
                  className={`${
                    Number(data?.revenueChange) > 0
                      ? "text-success"
                      : Number(data?.revenueChange) < 0
                      ? "text-warning"
                      : "text-muted"
                  }`}
                >
                  {Number(data?.revenueChange) > 0 && (
                    <>
                      <i className="bi bi-graph-up-arrow me-1"></i>
                      {Number(data?.revenueChange)}% so với tháng trước
                    </>
                  )}

                  {Number(data?.revenueChange) < 0 && (
                    <>
                      <i className="bi bi-graph-down-arrow me-1"></i>
                      {Math.abs(Number(data?.revenueChange))}% so với tháng
                      trước
                    </>
                  )}

                  {Number(data?.revenueChange) === 0 && <>Không thay đổi</>}
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
                Khách hàng
              </span>
              <Link
                to="/admin/nguoi-dung"
                className="text-primary"
                style={{ fontSize: "0.9rem", textDecoration: "none" }}
              >
                Xem chi tiết<i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <i
                className="bi bi-people rounded-circle me-3 fs-5"
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
                  {data?.totalUsers}
                </div>
                <div
                  className={`${
                    Number(data?.totalUsersChange) > 0
                      ? "text-success"
                      : Number(data?.totalUsersChange) < 0
                      ? "text-warning"
                      : "text-muted"
                  }`}
                >
                  {Number(data?.totalUsersChange) > 0 && (
                    <>
                      <i className="bi bi-graph-up-arrow me-1"></i>
                      {Number(data?.totalUsersChange)}% so với tháng trước
                    </>
                  )}

                  {Number(data?.totalUsersChange) < 0 && (
                    <>
                      <i className="bi bi-graph-down-arrow me-1"></i>
                      {Math.abs(Number(data?.totalUsersChange))}% so với tháng
                      trước
                    </>
                  )}

                  {Number(data?.totalUsersChange) === 0 && <>Không thay đổi</>}
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
                Sản phẩm
              </span>
              <Link
                to="/admin/san-pham"
                className="text-primary d-flex align-items-center"
                style={{ fontSize: "0.9rem", textDecoration: "none" }}
              >
                Xem chi tiết
                <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <i
                className="bi bi-book rounded-circle me-3 fs-5"
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
                  {data?.totalProducts}
                </div>
                <div className="text-success">Cập nhật liên tục</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticalHeader;
