import { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchImportOverview } from "../../../../../../../redux/slices/admin/ProductsImportsSlice";

const ImportCard = ({ title, value, icon, color, bg, desc }) => {
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

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              {value ?? 0}
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

const ImportOverview = () => {
  const dispatch = useDispatch();

  const { data, loading } = useSelector(
    (state) => state.adminProductsImports.importOverview
  );

  useEffect(() => {
    dispatch(fetchImportOverview());
  }, [dispatch]);

  const cards = [
    {
      title: "Đơn nhập hàng",
      value: data?.total_import_details,
      icon: "bi-bag",
      color: "#0d6efd",
      bg: "linear-gradient(135deg, #d7e8ff, #f8fbff)",
      desc: "Tổng số đơn nhập",
    },
    {
      title: "Doanh thu nhập",
      value: data?.total_import_revenue.toLocaleString("vi-VN") + "đ",
      icon: "bi-cash-coin",
      color: "#198754",
      bg: "linear-gradient(135deg, #dff7e6, #f6fffa)",
      desc: "Tổng tiền nhập hàng",
    },
    {
      title: "Sách nhập",
      value: data?.total_import_books,
      icon: "bi-box",
      color: "#fd7e14",
      bg: "linear-gradient(135deg, #ffe2c8, #fff7ef)",
      desc: "Tổng số lượng nhập",
    },
    {
      title: "Nhà cung cấp",
      value: data?.total_suppliers,
      icon: "bi-truck",
      color: "#dc3545",
      bg: "linear-gradient(135deg, #ffd6db, #fff5f6)",
      desc: "Số NCC đang hợp tác",
    },
  ];

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
        <h6 className="mb-3 fw-bold" style={{ color: "#E35765" }}>
          Thống kê nhập hàng
        </h6>

        <Row>
          {cards.map((item, index) => (
            <Col md={3} key={index}>
              <ImportCard {...item} />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ImportOverview;
