import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import bookstoreImg from "../../../../assets/image/anh1.jpg";
import ButtonCustom from "../../../../components/button/ButtonCustom";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, clearAllStatus } from "../../../../redux/slices/authSlice";

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Quên mật khẩu" },
];

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmailInput] = useState("");
  const [error, setError] = useState({ email: "" });

  const { loading, error: otpError } = useSelector(
    (state) => state.auth.sendOtpStatus
  );

  useEffect(() => {
    dispatch(clearAllStatus());
  }, [dispatch]);

  const handleinputEmail = (e) => {
    const value = e.target.value;
    setEmailInput(value);
    setError((prev) => ({
      ...prev,
      email: value === "" ? "Vui lòng nhập Email" : "",
    }));
  };

  const validateForm = () => {
    const newError = {};
    if (!email.trim()) {
      newError.email = "Vui lòng nhập Email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newError.email = "Email không hợp lệ";
    }
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await dispatch(sendOtp(email)).unwrap();
      navigate("/quen-mat-khau/nhap-ma-otp", { state: { email } });
    } catch (error) {
      console.error("Gửi OTP thất bại:", error);
    }
  };

  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />
      <Row className="justify-content-center align-items-center pb-5 pt-3">
        <Col md={12} lg={10}>
          <Card className="border-0 overflow-hidden">
            <Row>
              <Col
                md={6}
                className="d-none d-md-flex position-relative"
                style={{
                  backgroundImage: `url(${bookstoreImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 text-white p-5 d-flex flex-column justify-content-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                  <h3 className="fw-bold">Booklovers chào bạn!</h3>
                  <p>
                    Quên mật khẩu? Đừng lo! Hãy để chúng tôi giúp bạn lấy lại
                    quyền truy cập.
                  </p>
                </div>
              </Col>

              <Col md={6} className="bg-white p-5">
                <h4 className="mb-4 fw-bold text-center">Quên mật khẩu</h4>
                <Form onSubmit={(e) => e.preventDefault()}>
                  <Form.Group className="mb-1" controlId="formEmail">
                    <Form.Label>Email đã đăng ký</Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ backgroundColor: "#E9ECEF" }}>
                        <i className="bi bi-envelope-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={handleinputEmail}
                        isInvalid={!!error.email}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        style={{ display: "block" }}
                      >
                        {error.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {otpError && (
                    <p className="text-danger text-center mt-2">{otpError}</p>
                  )}

                  <div className="d-flex justify-content-center w-100 mt-3">
                    <ButtonCustom
                      bgrColor="#D14552"
                      color="white"
                      text={
                        loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            <span>Đang gửi</span>
                          </>
                        ) : (
                          "Lấy mã"
                        )
                      }
                      icon={!loading && "bi bi-send-check-fill fs-5 me-2"}
                      onClick={handleSubmit}
                      disabled={loading}
                    />
                  </div>
                </Form>

                <div className="mt-4 text-center">
                  <small>
                    Nhớ lại rồi?{" "}
                    <Link to="/dang-nhap" className="text-decoration-none">
                      Đăng nhập
                    </Link>
                  </small>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
