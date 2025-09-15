import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import ButtonCustom from "../../../../components/button/ButtonCustom";
import { InputGroup, Button, Spinner, Row, Col } from "react-bootstrap";
import bookstoreImg from "../../../../assets/image/bookstore.jpg";
import {
  createNewUser,
  resetCreateUserStatus,
} from "../../../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Đăng ký" },
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordXn, setShowPasswordXn] = useState(false);

  const { isLoading, error, success } = useSelector(
    (state) => state.user.createUser
  );

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (success) {
      navigate("/dang-nhap");
      toast.success("Tạo tài khoản thành công!");
      dispatch(resetCreateUserStatus());
    } else if (error) {
      toast.error(error);
    }
  }, [error, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullname.trim()) newErrors.fullname = "Vui lòng nhập Họ và tên";
    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập Email";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!form.password) {
      newErrors.password = "Vui lòng nhập Mật khẩu";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Vui lòng nhập lại Mật khẩu";
    else if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Mật khẩu không khớp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("fullname", form.fullname);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role", "user");
    formData.append("avatar", "default.jpg");

    dispatch(createNewUser(formData));
  };

  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />
      <div className="pb-5 pt-3">
        <Row className="justify-content-center">
          <Col
            md={12}
            lg={10}
            className=" rounded overflow-hidden  bg-white"
            style={{ backgroundColor: "#F8F9FA" }}
          >
            <Row>
              <Col md={6} className="position-relative p-0 d-none d-md-block">
                <img
                  src={bookstoreImg}
                  alt="bookstore"
                  className="w-100 h-100"
                  style={{ objectFit: "cover", minHeight: "400px" }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center px-3"
                  style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                >
                  <h2 className="fw-bold mb-4">
                    Gia nhập cộng đồng Booklovers!
                  </h2>
                  <p className="fs-5 mb-4">
                    Cùng hàng ngàn người yêu sách khám phá kho tàng tri thức
                    phong phú và đa dạng.
                  </p>
                  <span className="fs-6">
                    Bạn đã có tài khoản?
                    <Link
                      to="/dang-nhap"
                      className="text-warning text-decoration-underline ms-1"
                    >
                      Đăng nhập ngay
                    </Link>
                  </span>
                </div>
              </Col>

              <Col md={6} className="p-3 p-lg-5">
                <h3 className="text-center mb-4">Đăng ký tài khoản</h3>
                <Form>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Họ và tên</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <i className="bi bi-person-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="fullname"
                        value={form.fullname}
                        onChange={handleChange}
                        placeholder="Họ và tên"
                        isInvalid={!!errors.fullname}
                      />
                      <Form.Control.Feedback
                        style={{ minHeight: "21px" }}
                        type="invalid"
                      >
                        {errors.fullname}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <i className="bi bi-envelope-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <i className="bi bi-lock-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Mật khẩu"
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
                        />
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="formConfirmPassword">
                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <i className="bi bi-lock-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type={showPasswordXn ? "text" : "password"}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Nhập lại mật khẩu"
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
                        />
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Form>

                <div className="d-flex justify-content-center">
                  <ButtonCustom
                    bgrColor="#E14654"
                    text={
                      isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Đang tạo
                        </>
                      ) : (
                        "Đăng ký"
                      )
                    }
                    icon={!isLoading && "bi bi-person-plus-fill fs-5 me-2"}
                    onClick={handleRegister}
                    disabled={isLoading}
                  />
                </div>
              </Col>
              <Col md={6} className="position-relative p-0 d-block d-md-none">
                <img
                  src={bookstoreImg}
                  alt="bookstore"
                  className="w-100 h-100"
                  style={{ objectFit: "cover", minHeight: "400px" }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center px-3"
                  style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                >
                  <h2 className="fw-bold mb-4">
                    Gia nhập cộng đồng Booklovers!
                  </h2>
                  <p className="fs-5 mb-4">
                    Cùng hàng ngàn người yêu sách khám phá kho tàng tri thức
                    phong phú và đa dạng.
                  </p>
                  <span className="fs-6">
                    Bạn đã có tài khoản?
                    <Link
                      to="/dang-nhap"
                      className="text-warning text-decoration-underline ms-1"
                    >
                      Đăng nhập ngay
                    </Link>
                  </span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Register;
