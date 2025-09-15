import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "100vh", textAlign: "center" }}
    >
      <h1 className="display-1 text-danger">404</h1>
      <h2 className="mb-3">Trang không tồn tại</h2>
      <p className="mb-4">
        Rất tiếc, chúng tôi không thể tìm thấy trang bạn yêu cầu.
      </p>
    </Container>
  );
};

export default NotFound;
