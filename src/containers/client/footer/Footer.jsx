import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import ButtonCustom from "../../../components/button/ButtonCustom";
import "./Footer.scss";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../../../config/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchSystemSettings } from "../../../redux/slices/admin/systemSlice";

const Footer = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { settings } = useSelector((state) => state.system);

  useEffect(() => {
    dispatch(fetchSystemSettings());
  }, []);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = () => {
    if (!isValidEmail(email)) {
      toast.error("Vui lòng nhập email hợp lệ!");
      return;
    }
    toast.success("Đăng ký nhận bản tin thành công!");
    setEmail("");
  };
  return (
    <div className="bg-white">
      <Container className="py-4">
        <Row className="text-center fw-bold">
          <Col xs={6} lg={3}>
            <i className="bi bi-truck colorPri fs-1"></i>
            <div className="colorPri">MIỄN PHÍ VẬN CHUYỂN</div>
            <small className="fw-normal" style={{ color: "#666666" }}>
              cho đơn hàng trên 300,000 VNĐ
            </small>
          </Col>
          <Col xs={6} lg={3}>
            <i className="bi bi-cash-coin colorPri fs-1"></i>
            <div className="colorPri">SHIP COD TOÀN QUỐC</div>
            <small className="fw-normal" style={{ color: "#666666" }}>
              Thanh toán khi nhận sách
            </small>
          </Col>
          <Col xs={6} lg={3}>
            <i className="bi bi-emoji-smile colorPri fs-1"></i>
            <div className="colorPri">MIỄN PHÍ ĐỔI TRẢ HÀNG</div>
            <small className="fw-normal" style={{ color: "#666666" }}>
              trong vòng 10 ngày
            </small>
          </Col>
          <Col xs={6} lg={3}>
            <i className="bi bi-telephone-fill colorPri fs-1"></i>
            <div className="colorPri">HOTLINE:</div>
            <small className="fw-normal" style={{ color: "#666666" }}>
              {settings?.hotline}
            </small>
          </Col>
        </Row>
      </Container>
      <Container
        className="py-lg-4 px-lg-5 py-md-3 px-md-4 p-3"
        style={{ backgroundColor: "#3C3C3C" }}
      >
        <Row className="align-items-center justify-content-center">
          <Col
            lg={3}
            md={5}
            sm={12}
            className="d-flex align-items-center justify-content-center text-white mb-2 mb-md-0"
          >
            <i className="bi bi-envelope-fill fs-3 me-3"></i>
            <strong>ĐĂNG KÝ NHẬN BẢN TIN</strong>
          </Col>
          <Col lg={7} md={6} sm={12}>
            <InputGroup>
              <Form.Control
                type="email"
                placeholder="Nhập email của bạn"
                aria-label="Đăng ký bản tin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="sm"
              />
              <ButtonCustom
                bgrColor="#E14654"
                text="Đăng ký"
                onClick={handleEmailSubmit}
                disabled={!isValidEmail(email)}
              />
            </InputGroup>
          </Col>
        </Row>
      </Container>
      <div
        style={{
          padding: "20px 0 ",
        }}
      >
        <Container>
          <Row>
            <Col lg={3} className="d-none d-lg-block">
              <Link to="/">
                <Image
                  src={`${API_URL}/logo/logo-1.webp`}
                  style={{ width: "90%" }}
                  alt="Logo"
                />
              </Link>
              <p className="mt-3">Đ/C: {settings?.address}</p>
              <div className="mt-3 d-flex gap-3">
                <a
                  href={settings?.facebook}
                  target="_blank"
                  className="footer-icon"
                >
                  <i className="bi bi-facebook fs-5"></i>
                </a>
                <a
                  href={settings?.instagram}
                  target="_blank"
                  className="footer-icon"
                >
                  <i className="bi bi-instagram fs-5"></i>
                </a>
                <a
                  href={settings?.tiktok}
                  target="_blank"
                  className="footer-icon"
                >
                  <i className="bi bi-tiktok"></i>
                </a>
                <a
                  href={settings?.youtube}
                  target="_blank"
                  className="footer-icon"
                >
                  <i className="bi bi-youtube fs-5"></i>
                </a>
              </div>
            </Col>

            <Col lg={9}>
              <Row>
                <Col lg={4} md={4} xs={12}>
                  <h5 className="fw-bold" style={{ color: "#212529" }}>
                    Dịch vụ
                  </h5>
                  <ul className="list-unstyled ul-foot">
                    <li>Điều khoản sử dụng</li>
                    <li>Chính sách bảo mật</li>
                    <li>Giới thiệu Pibook</li>
                  </ul>
                  <h5 className="fw-bold mt-3">Liên hệ</h5>
                  <p className="mb-1 mb-md-3 d-flex align-items-center justify-content-start text-center text-lg-start">
                    <i
                      className="bi bi-telephone-fill fs-6 me-1"
                      style={{ color: "#444" }}
                    ></i>
                    <span>
                      <span className="d-none d-lg-inline">Hotline: </span>
                      {settings?.hotline}
                    </span>
                  </p>
                  <p className="d-flex d-md-none align-items-center justify-content-start text-center text-lg-start">
                    <i
                      className="bi bi-envelope-fill  fs-6 me-1"
                      style={{ color: "#444" }}
                    ></i>
                    <span className="mt-md-2 mt-lg-0">
                      <span className="d-none d-lg-inline">Email: </span>
                      {settings?.email}
                    </span>
                  </p>
                </Col>

                <Col lg={4} md={4} xs={12}>
                  <h5 className="fw-bold" style={{ color: "#212529" }}>
                    Hỗ trợ
                  </h5>
                  <ul className="list-unstyled ul-foot">
                    <li>Chính sách đổi - trả - hoàn tiền</li>
                    <li>Phương thức vận chuyển</li>
                    <li>Phương thức thanh toán</li>
                  </ul>
                  <h5
                    className="fw-bold d-none d-lg-block"
                    style={{ visibility: "hidden" }}
                  >
                    Liên hệ
                  </h5>
                  <p className="d-none mt-md-4 mt-lg-0 d-md-flex align-items-center justify-content-start text-center text-lg-start">
                    <i
                      className="bi bi-envelope-fill  fs-6 me-1"
                      style={{ color: "#444" }}
                    ></i>
                    <span className="">
                      <span className="d-none d-lg-inline">Email: </span>
                      {settings?.email}
                    </span>
                  </p>
                </Col>

                <Col lg={4} md={4} xs={12}>
                  <h5 className="fw-bold" style={{ color: "#212529" }}>
                    Tài khoản của tôi
                  </h5>
                  <ul className="list-unstyled ul-foot">
                    <li>Đăng nhập/Tạo tài khoản mới</li>
                    <li>Thay đổi địa chỉ khách hàng</li>
                    <li>Lịch sử mua hàng</li>
                  </ul>
                </Col>
              </Row>
            </Col>
            <Col className="d-block d-lg-none">
              <Link to="/">
                <Image
                  src={`${API_URL}/logo/logo-1.webp`}
                  style={{ width: "50%" }}
                  alt="Logo"
                />
              </Link>
              <p className="mt-3">Đ/C: {settings?.address}</p>
              <div className="mt-3 d-flex gap-3">
                <a
                  href={settings?.facebook}
                  target="_blank"
                  className="footer-icon"
                >
                  <i className="bi bi-facebook fs-5"></i>
                </a>
                <a
                  href={settings?.instagram}
                  target="_blank"
                  className="footer-icon"
                >
                  <i className="bi bi-instagram fs-5"></i>
                </a>
                <a
                  href={settings?.tiktok}
                  target="_blank"
                  className="footer-icon"
                >
                  <i className="bi bi-tiktok"></i>
                </a>
                <a
                  href={settings?.youtube}
                  target="_blank"
                  className="footer-icon"
                >
                  <i className="bi bi-youtube fs-5"></i>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <p
        className="text-center small text-muted p-1"
        style={{ backgroundColor: "rgb(248, 247, 247)", margin: 0 }}
      >
        © 2025 - Thiết kế và phát triển bởi Ctit28
      </p>
    </div>
  );
};

export default Footer;
