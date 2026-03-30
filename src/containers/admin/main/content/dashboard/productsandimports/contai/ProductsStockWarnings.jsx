import { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockWarnings } from "../../../../../../../redux/slices/admin/ProductsImportsSlice";

const StockCard = ({ title, value, color, icon, bg, desc, loading }) => {
  return (
    <Card
      style={{
        border: "none",
        background: bg,
      }}
    >
      <Card.Body>
        <h6 className="fw-bold mb-2" style={{ color }}>
          {title}
        </h6>

        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: "800",
                color: "#1f1f1f",
              }}
            >
              {loading ? "..." : value ?? 0}
            </div>

            <div style={{ fontSize: "13px", color: "#555" }}>{desc}</div>
          </div>

          <i
            className={`bi ${icon}`}
            style={{
              fontSize: "22px",
              color: "#fff",
              background: color,
              padding: "10px 14px",
              borderRadius: "12px",
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

const ProductsStockWarnings = () => {
  const dispatch = useDispatch();

  const { data, loading } = useSelector(
    (state) => state.adminProductsImports.stockWarnings
  );

  useEffect(() => {
    dispatch(fetchStockWarnings());
  }, [dispatch]);

  const cards = [
    {
      title: "Còn hàng",
      value: data?.in_stock,
      color: "#28a745",
      icon: "bi-check-circle",
      bg: "linear-gradient(135deg, #dff7e6, #f6fffa)",
      desc: "Sách đang bán bình thường",
    },
    {
      title: "Sắp hết",
      value: data?.low_stock,
      color: "#fd7e14",
      icon: "bi-exclamation-triangle",
      bg: "linear-gradient(135deg, #ffe2c8, #fff7ef)",
      desc: "Cần theo dõi tồn kho",
    },
    {
      title: "Nguy cơ hết",
      value: data?.critical_stock,
      color: "#dc3545",
      icon: "bi-exclamation-octagon",
      bg: "linear-gradient(135deg, #ffd6db, #fff5f6)",
      desc: "Cần nhập hàng gấp",
    },
    {
      title: "Hết hàng",
      value: data?.out_of_stock,
      color: "#343a40",
      icon: "bi-x-circle",
      bg: "linear-gradient(135deg, #e1e5ea, #f8f9fa)",
      desc: "Đang bị mất doanh thu",
    },
  ];

  return (
    <Card
      className="mb-3"
      style={{
        border: "none",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        borderRadius: "12px",
      }}
    >
      <Card.Body>
        <h6 className="mb-3 fw-bold" style={{ color: "#E35765" }}>
          Thống kê tồn kho
        </h6>

        <Row>
          {cards.map((item, index) => (
            <Col md={3} key={index}>
              <StockCard {...item} loading={loading} />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductsStockWarnings;
