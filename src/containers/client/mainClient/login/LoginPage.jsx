import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import ButtonCustom from "../../../../components/button/ButtonCustom";
import { InputGroup, Button } from "react-bootstrap";
import logoGG from "../../../../assets/image/google.png";
import logoFB from "../../../../assets/image/facebook.png";
import bookstoreImg from "../../../../assets/image/bookstore.jpg";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  resetLoginUserState,
  getUserWithAddress,
  googleLogin,
  facebookLogin,
} from "../../../../redux/slices/userSlice";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import FacebookLogin from "react-facebook-login";

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Đăng nhập" },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, error, isLoggedIn } = useSelector(
    (state) => state.user.auth
  );

  const {
    user,
    accessToken,
    loading,
    error: errorLoginGoogle,
  } = useSelector((state) => state.user.userLoginGoogle);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    if (!validateForm()) return;

    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserWithAddress());
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {}, [navigate]);

  const handleinputEmail = (e) => {
    setEmail(e.target.value);
    if (e.target.value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Vui lòng nhập Email",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  };

  const handleinputPassword = (e) => {
    dispatch(resetLoginUserState());

    setPassword(e.target.value);
    if (e.target.value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Vui lòng nhập mật khẩu",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "",
      }));
    }
  };

  const responseFacebook = (response) => {
    console.log("Facebook response:", response);

    if (response.accessToken) {
      dispatch(facebookLogin(response.accessToken));
    } else {
      console.error("Facebook login failed:", response);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập Email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />
      <div className="pb-5 pt-3">
        <Row className="justify-content-center ">
          <Col
            md={12}
            lg={10}
            className=" rounded overflow-hidden  bg-white"
            style={{ backgroundColor: "#F8F9FA" }}
          >
            <Row>
              <Col md={6} className="p-3 p-lg-5">
                <h3 className="text-center mb-4">Đăng nhập</h3>

                <Form noValidate>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-envelope-fill" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={handleinputEmail}
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
                      <InputGroup.Text>
                        <i className="bi bi-lock-fill" />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={handleinputPassword}
                        isInvalid={!!errors.password || !!error}
                      />
                      <Button
                        // onMouseDown={() => setShowPassword(true)}
                        // onMouseUp={() => setShowPassword(false)}
                        // onMouseLeave={() => setShowPassword(false)}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ backgroundColor: "#E9ECEF", border: "none" }}
                      >
                        <i
                          className={`bi text-black ${
                            showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                          }`}
                        />
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {error || errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <div className="d-flex justify-content-end mb-3">
                    <Link to="/quen-mat-khau" className="small">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <div className="d-flex justify-content-center">
                    <ButtonCustom
                      bgrColor="#E14654"
                      text={
                        isLoading ? (
                          <>
                            <Spinner
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
                            Đăng nhập
                          </>
                        ) : (
                          "Đăng nhập"
                        )
                      }
                      icon={!isLoading && "bi bi-box-arrow-in-right fs-5 me-2"}
                      onClick={handleLogin}
                      disabled={isLoading}
                    />
                  </div>
                </Form>

                <div className="d-flex align-items-center my-3">
                  <div className="flex-grow-1">
                    <hr />
                  </div>
                  <div className="px-3 text-muted">hoặc đăng nhập bằng</div>
                  <div className="flex-grow-1">
                    <hr />
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <GoogleLogin
                    onSuccess={(res) => dispatch(googleLogin(res.credential))}
                    onError={() => console.log("Google login thất bại")}
                    useOneTap={false}
                  />
                </div>
              </Col>

              <Col md={6} className="position-relative p-0 ">
                <div className="w-100 h-100">
                  <img
                    src={bookstoreImg}
                    alt="bookstore"
                    className="w-100 h-100 img-fluid"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center px-3"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                >
                  <h2 className="fw-bold mb-3">
                    Chào mừng bạn đến với Booklovers!
                  </h2>
                  <p className="fs-5 mb-4">
                    Khám phá thế giới tri thức, kết nối với hàng ngàn đầu sách
                    hấp dẫn ngay hôm nay.
                  </p>
                  <Link to="/dang-ky">
                    <Button
                      variant="light"
                      className="fw-bold px-4 py-2"
                      style={{ color: "#E14654", border: "2px solid white" }}
                    >
                      Tạo tài khoản mới
                    </Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default LoginPage;
