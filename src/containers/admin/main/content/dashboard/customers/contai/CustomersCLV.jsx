import { Card, Col, Row, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerCLV } from "../../../../../../../redux/slices/admin/CustomerSlice";
import { useEffect } from "react";

const CustomersCLV = () => {
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.adminCustomer.clv);

  useEffect(() => {
    dispatch(fetchCustomerCLV());
  }, [dispatch]);

  return (
    <div className="mb-3">
      <Row>
        <Col md={3}>
          <Card
            className="h-100"
            style={{
              border: "none",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
            }}
          >
            <Card.Body>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-cash-coin text-primary fs-5"></i>
                <h6 className="text-primary mb-0">CLV trung bình</h6>
              </div>

              <h5 className="mt-1 fw-bold  mb-0 text-primary">
                {data?.avgCLV?.toLocaleString("vi-VN") || 0}đ
              </h5>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="h-100"
            style={{
              border: "none",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
            }}
          >
            <Card.Body>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-trophy-fill text-success fs-5"></i>
                <h6 className="text-success mb-0">CLV cao nhất</h6>
              </div>

              <div className="mt-1 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold  mb-0 text-success">
                  {data?.maxCLV?.toLocaleString("vi-VN") || 0} đ
                </h5>

                <small className="text-muted">
                  {data?.topCustomerName || "N/A"}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="h-100"
            style={{
              border: "none",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
            }}
          >
            <Card.Body>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-cart-fill text-info fs-5"></i>
                <h6 className="text-info mb-0">Đơn lớn nhất</h6>
              </div>
              <div className="mt-1 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold  mb-0 text-info">
                  {data?.maxOrder?.total_price?.toLocaleString("vi-VN") || 0} đ
                </h5>

                <small className="text-muted">
                  {data?.maxOrder?.fullname || "N/A"}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="h-100"
            style={{
              border: "none",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
            }}
          >
            <Card.Body>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-cart-check-fill text-warning fs-5"></i>
                <h6 className="text-warning mb-0">Đơn cao nhì</h6>
              </div>
              <div className="mt-1 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold  mb-0 text-warning">
                  {data?.secondMaxOrder?.total_price?.toLocaleString("vi-VN") ||
                    0}{" "}
                  đ
                </h5>

                <small className="text-muted">
                  {data?.secondMaxOrder?.fullname || "N/A"}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomersCLV;
