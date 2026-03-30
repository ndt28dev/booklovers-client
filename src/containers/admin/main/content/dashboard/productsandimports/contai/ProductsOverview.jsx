import { useEffect, useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsOverview } from "../../../../../../../redux/slices/admin/ProductsImportsSlice";

const OverviewCard = ({ title, value, icon, desc, color, bg }) => {
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

        <div className="d-flex align-items-center">
          <i
            className={`bi ${icon} me-3 fs-5`}
            style={{
              fontSize: "22px",
              color: "#fff",
              background: color,
              padding: "10px 14px",
              borderRadius: "12px",
            }}
          />

          <div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "800",
                color: "#1f1f1f",
              }}
            >
              {value ?? 0}
            </div>

            <div style={{ fontSize: "13px", color: "#555" }}>{desc}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const ProductsOverview = () => {
  const dispatch = useDispatch();

  const { data } = useSelector(
    (state) => state.adminProductsImports.productsOverview
  );

  useEffect(() => {
    dispatch(fetchProductsOverview());
  }, [dispatch]);

  const cards = useMemo(
    () => [
      {
        title: "Tổng sản phẩm trong hệ thống",
        value: data?.total_products,
        icon: "bi-box",
        desc: "Tổng số đầu sách trong hệ thống",
        color: "#0d6efd",
        bg: "linear-gradient(135deg, #d7e8ff, #f8fbff)",
      },
      {
        title: "Tổng số lượng sách đã bán",
        value: data?.total_sold_quantity,
        icon: "bi-cart-check",
        desc: "Tổng số sách đã được bán ra",
        color: "#198754",
        bg: "linear-gradient(135deg, #dff7e6, #f6fffa)",
      },
      {
        title: "Số đầu sách đã bán",
        value: data?.sold_books,
        icon: "bi-check2-circle",
        desc: "Số loại sách đã có lượt mua",
        color: "#fd7e14",
        bg: "linear-gradient(135deg, #ffe2c8, #fff7ef)",
      },
      {
        title: "Số đầu sách chưa bán",
        value: data?.unsold_books,
        icon: "bi-hourglass-split",
        desc: "Số loại sách chưa có lượt mua",
        color: "#dc3545",
        bg: "linear-gradient(135deg, #ffd6db, #fff5f6)",
      },
    ],
    [data]
  );

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
          <h6
            className="mb-3 w-100"
            style={{ color: "#E35765", fontWeight: "700" }}
          >
            Thống kê sản phẩm
          </h6>
          {cards.map((item, index) => (
            <Col md={3} key={index}>
              <OverviewCard {...item} />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductsOverview;
