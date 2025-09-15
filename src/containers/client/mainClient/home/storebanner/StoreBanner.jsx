import React from "react";
import ButtonCustom from "../../../../../components/button/ButtonCustom";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import storebanner from "../../../../../assets/image/storebanner.jpg";
import { useNavigate } from "react-router-dom";

const StoreIntro = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-4">
      <Row className="align-items-center">
        <Col md={6}>
          <h5 className="text-uppercase text-muted mb-2">
            Cửa Hàng Sách Trực Tuyến
          </h5>
          <h2 className="fw-bold mb-3">Khám phá thế giới sách bất tận</h2>
          <p className="text-secondary mb-3">
            Tại cửa hàng của chúng tôi, bạn không chỉ mua sách, bạn khám phá tri
            thức. Chúng tôi cung cấp hàng ngàn tựa sách được chọn lọc kỹ lưỡng,
            đảm bảo chất lượng và giá cả hợp lý.
          </p>
          <ul className="text-secondary mb-4 " style={{ listStyle: "none" }}>
            <li>✔️ Giao hàng toàn quốc</li>
            <li>✔️ Đổi trả miễn phí trong 7 ngày</li>
            <li>✔️ Hỗ trợ khách hàng 24/7</li>
            <li>✔️ Ưu đãi thành viên thân thiết</li>
          </ul>

          <ButtonCustom
            text="Tìm hiểu thêm →"
            bgrColor="white"
            color="#E35765"
            border="1px solid #E35765"
            onClick={() => {
              navigate("/cua-hang");
            }}
          />
        </Col>
        <Col md={6} className="mt-3 mt-md-0">
          <Image src={storebanner} fluid rounded />
        </Col>
      </Row>
    </Container>
  );
};

export default StoreIntro;
