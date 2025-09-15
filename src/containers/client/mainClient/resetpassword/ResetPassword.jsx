import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import bookstoreImg from "../../../../assets/image/anh1.jpg";
import ButtonCustom from "../../../../components/button/ButtonCustom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  clearAllStatus,
} from "../../../../redux/slices/authSlice";
import Spinner from "react-bootstrap/Spinner";

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Quên mật khẩu", link: "/quen-mat-khau" },
  { label: "Đặt lại mật khẩu" },
];

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email || "";

  const { loading } = useSelector((state) => state.auth.resetPasswordStatus);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordXn, setShowPasswordXn] = useState(false);

  useEffect(() => {
    dispatch(clearAllStatus());
  }, [dispatch]);

  const handleInputPassword = (e) => {
    const value = e.target.value;
    setPassword(value);

    setErrors((prev) => ({
      ...prev,
      password: value.trim() === "" ? "Vui lòng nhập Mật khẩu mới" : "",
    }));

    if (confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          confirmPassword !== value ? "Mật khẩu xác nhận không khớp" : "",
      }));
    }
  };

  const handleInputConfirmPassword = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    setErrors((prev) => ({
      ...prev,
      confirmPassword:
        value.trim() === ""
          ? "Vui lòng nhập Xác nhận mật khẩu"
          : value !== password
          ? "Mật khẩu xác nhận không khớp"
          : "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập Mật khẩu mới";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng nhập Xác nhận mật khẩu";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(resetPassword({ email, newPassword: password })).unwrap();
      navigate("/dang-nhap");
    } catch (err) {
      console.error("Lỗi đặt lại mật khẩu:", err);
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
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <h3 className="fw-bold">Tạo mật khẩu mới</h3>
                  <p>
                    Nhập mật khẩu mới để tiếp tục sử dụng tài khoản của bạn.{" "}
                    <br />
                    Đảm bảo mật khẩu mạnh và dễ nhớ!
                  </p>
                </div>
              </Col>

              <Col md={6} className="bg-white ps-5 pe-5 pt-3 pb-3">
                <h4 className="mb-4 text-center fw-bold">Đặt lại mật khẩu</h4>
                <Form>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ backgroundColor: "#E9ECEF" }}>
                        <i className="bi bi-lock-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu mới"
                        value={password}
                        onChange={handleInputPassword}
                        isInvalid={!!errors.password}
                      />
                      <Button
                        // onMouseDown={() => setShowPassword(true)}
                        // onMouseUp={() => setShowPassword(false)}
                        // onMouseLeave={() => setShowPassword(false)}
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        style={{ backgroundColor: "#E9ECEF", border: "none" }}
                      >
                        <i
                          className={`bi text-black ${
                            showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                          }`}
                        ></i>
                      </Button>
                      <Form.Control.Feedback
                        type="invalid"
                        style={{ display: "block" }}
                      >
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ backgroundColor: "#E9ECEF" }}>
                        <i className="bi bi-lock-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type={showPasswordXn ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={handleInputConfirmPassword}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Button
                        // onMouseDown={() => setShowPasswordXn(true)}
                        // onMouseUp={() => setShowPasswordXn(false)}
                        // onMouseLeave={() => setShowPasswordXn(false)}
                        onClick={() => setShowPasswordXn(!showPasswordXn)}
                        tabIndex={-1}
                        style={{ backgroundColor: "#E9ECEF", border: "none" }}
                      >
                        <i
                          className={`bi text-black ${
                            showPasswordXn ? "bi-eye-slash-fill" : "bi-eye-fill"
                          }`}
                        ></i>
                      </Button>
                      <Form.Control.Feedback
                        type="invalid"
                        style={{ display: "block" }}
                      >
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <div className="d-flex justify-content-center mt-3">
                    <ButtonCustom
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
                            Đang xử lý
                          </>
                        ) : (
                          "Đặt lại mật khẩu"
                        )
                      }
                      bgrColor="#D14552"
                      color="white"
                      onClick={handleSubmit}
                      disabled={loading}
                    />
                  </div>
                </Form>

                <div className="mt-4  justify-content-center d-flex align-items-center">
                  <span className="me-2">Đã nhớ mật khẩu? </span>
                  <Button
                    variant="link"
                    onClick={() => navigate("/dang-nhap")}
                    className="p-0 text-decoration-none"
                  >
                    Đăng nhập ngay
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
