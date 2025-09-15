import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import aboutbanner from "../../../../../assets/image/aboutbanner1.jpg";
import ButtonCustom from "../../../../../components/button/ButtonCustom";
import "./AboutBanner.scss";
import { useNavigate } from "react-router-dom";

const AboutBanner = () => {
  const navigate = useNavigate();
  return (
    <Container className="py-4">
      <Row className="align-items-center">
        <Col xs={12} lg={6} className="text-center mb-4 mb-md-0">
          <Image
            src={aboutbanner}
            alt="Founder"
            fluid
            className="rounded shadow"
          />
        </Col>

        <Col
          xs={12}
          lg={6}
          className="text-center text-lg-start mt-4 mt-lg-0 d-flex flex-column justify-content-center align-items-center align-items-lg-start"
        >
          <h5 className="text-uppercase text-muted fw-bold mb-2">
            Về Chúng Tôi
          </h5>
          <h2 className="fw-bold mb-4">
            Nơi hội tụ những cuốn sách hay và truyền cảm hứng
          </h2>

          <p className="fst-italic text-secondary">
            Bạn đang tìm kiếm những cuốn sách giúp bạn phát triển bản thân, hiểu
            thêm về thế giới hoặc đơn giản là thư giãn sau ngày dài? Chúng tôi ở
            đây để giúp bạn!
          </p>

          <p className="text-secondary">
            Website của chúng tôi ra đời với sứ mệnh mang đến cho độc giả những
            cuốn sách được chọn lọc kỹ càng, từ tiểu thuyết, sách kỹ năng, đến
            sách thiếu nhi. Mỗi cuốn sách là một hành trình – và chúng tôi rất
            hân hạnh được đồng hành cùng bạn trên hành trình đó.
          </p>

          <p className="text-secondary">
            Chúng tôi tin rằng:{" "}
            <strong>“Mỗi cuốn sách hay đều có thể thay đổi cuộc đời.”</strong>
            Và bạn xứng đáng được tiếp cận với những cuốn sách như thế.
          </p>

          <p className="text-secondary">
            Cảm ơn bạn đã ghé thăm. Chúc bạn tìm được thật nhiều cảm hứng tại
            đây!
          </p>

          <ButtonCustom
            text="Xem thêm →"
            onClick={() => {
              navigate("/gioi-thieu");
            }}
          />

          <div className="d-flex gap-3 mt-4">
            <a href="https://www.facebook.com/duythuan28102002" target="_blank">
              <i className="aboutbanner-icon bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com/ndt.gk.28/" target="_blank">
              <i className="aboutbanner-icon bi bi-instagram"></i>
            </a>
            <a href="https://www.tiktok.com/@ndt281002" target="_blank">
              <i className="aboutbanner-icon bi bi-tiktok"></i>
            </a>
            <a href="https://www.youtube.com/@iamchaus2083" target="_blank">
              <i className="aboutbanner-icon bi bi-youtube"></i>
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutBanner;
