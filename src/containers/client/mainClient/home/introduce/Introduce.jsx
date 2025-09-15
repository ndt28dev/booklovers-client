import React, { useEffect, useState } from "react";
import { Container, Image, Row, Col } from "react-bootstrap";
import banner1 from "../../../../../assets/image/banner1.jpg";
import banner2 from "../../../../../assets/image/banner2.jpg";
import banner3 from "../../../../../assets/image/banner3.jpg";
import banner4 from "../../../../../assets/image/banner4.jpg";
import "./Introduce.scss";
import ButtonCustom from "../../../../../components/button/ButtonCustom";
import { useNavigate } from "react-router-dom";

const Introduce = () => {
  const navigate = useNavigate();
  const banners = [banner1, banner2, banner3, banner4];
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleBuyNow = () => {
    navigate("/san-pham");
  };

  return (
    <div className="introduce position-relative">
      <Image
        src={banners[currentBanner]}
        style={{ width: "100%", height: "600px", objectFit: "cover" }}
        alt="banner"
      />

      <div
        className="introduce-con position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
        style={{ background: "rgba(0, 0, 0, 0.4)" }}
      >
        <Container>
          <Row className="align-items-center text-white">
            <Col xs={12} md={6} className="text-center text-md-start">
              <h1 className="fw-bold mb-4">ƯU ĐÃI DÀNH RIÊNG CHO BOOKLOVERS</h1>
              <h3 className="mb-4">
                Giảm giá lên đến 30% cho mọi đầu sách yêu thích!
              </h3>
              <p className="mb-4">
                Chào mừng bạn đến với thiên đường của những người yêu sách! Khám
                phá hàng ngàn tựa sách hấp dẫn, giá ưu đãi, chất lượng đảm bảo.
              </p>
              <div className="d-flex justify-content-center justify-content-md-start">
                <ButtonCustom
                  text="Mua ngay →"
                  bgrColor="#D14552"
                  onClick={handleBuyNow}
                />
              </div>
            </Col>

            <Col md={6} className="d-none d-md-block">
              {/* Optional visual/right side */}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Introduce;
