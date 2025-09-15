import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import bookstoreImg from "../../../../assets/image/anh1.jpg";
import ButtonCustom from "../../../../components/button/ButtonCustom";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyOtp,
  sendOtp,
  clearAllStatus,
} from "../../../../redux/slices/authSlice";

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Quên mật khẩu", link: "/quen-mat-khau" },
  { label: "Xác minh mã OTP" },
];

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth.verifyOtpStatus);
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    dispatch(clearAllStatus());
  }, [dispatch]);

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("Vui lòng nhập mã xác minh");
      return;
    }

    try {
      await dispatch(verifyOtp({ email, otp })).unwrap();
      navigate("/quen-mat-khau/dat-lai-mat-khau", {
        state: { email },
      });
    } catch (err) {
      setError(err);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      await dispatch(sendOtp(email)).unwrap();
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      alert("Gửi lại mã thất bại: " + err);
    }
  };

  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />
      <Row className="justify-content-center align-items-center pb-5 pt-3">
        <Col md={12} lg={10}>
          <Card className=" border-0  overflow-hidden">
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
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <h3 className="fw-bold">Xác minh mã OTP</h3>
                  <p>
                    Chúng tôi đã gửi một mã xác nhận gồm 6 chữ số đến email của
                    bạn. Vui lòng kiểm tra hộp thư đến và nhập mã vào bên dưới
                    để tiếp tục quá trình đặt lại mật khẩu.
                  </p>
                </div>
              </Col>

              <Col md={6} className="bg-white p-5">
                <h4>Xác minh mã OTP</h4>
                <p>
                  Mã xác minh đã gửi tới email: <h6>{email}</h6>
                </p>
                <Form>
                  <Form.Group className="mb-1">
                    <Form.Label>Nhập mã OTP</Form.Label>
                    <Form.Control
                      type="text"
                      value={otp}
                      isInvalid={!!error}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setError("");
                      }}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ display: "block" }}
                    >
                      {error}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex mt-3 justify-content-between align-items-center">
                    <ButtonCustom
                      bgrColor="#D14552"
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
                            Đang xác minh
                          </>
                        ) : (
                          "Xác minh"
                        )
                      }
                      icon={!loading && "bi bi-shield-lock-fill fs-5 me-2"}
                      onClick={handleVerify}
                      disabled={loading}
                    />

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">
                        {canResend ? (
                          <Button
                            variant="link"
                            className="p-0 text-decoration-none"
                            onClick={handleResendOTP}
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                Đang gửi lại...
                              </>
                            ) : (
                              "Gửi lại mã"
                            )}
                          </Button>
                        ) : (
                          <span className="text-warning">
                            Gửi lại sau {countdown}s
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyOTP;
