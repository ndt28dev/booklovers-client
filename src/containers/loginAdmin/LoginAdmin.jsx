import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/image/logoStore.jpg";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../../redux/slices/userSlice";
import "../../assets/styles/loading.scss";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isLoggedIn, isLoading } = useSelector(
    (state) => state.user.adminAuth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginAdmin({ email, password }));
  };

  useEffect(() => {
    if (isLoggedIn) {
      setEmail("");
      setPassword("");
      navigate("/admin");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      setEmail("");
      setPassword("");
      navigate("/admin");
    }
  }, [isLoggedIn, navigate]);
  return (
    <>
      {isLoading && (
        <div className="overlay">
          <Spinner animation="border" variant="primary" />
          <div className="mt-3">Đang đăng nhập...</div>
        </div>
      )}
      <div
        className="d-flex justify-content-center  vh-100"
        style={{ userSelect: "none" }}
      >
        <div>
          <div className="d-flex justify-content-center">
            <Image
              src={logoImage}
              roundedCircle
              style={{ width: "200px", height: "200px" }}
            />
          </div>
          <Form
            onSubmit={handleLogin}
            style={{
              minWidth: "400px",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
              />
            </Form.Group>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
              <Form.Text className="text-muted" style={{ cursor: "pointer" }}>
                <a href="#" className="text-decoration-none">
                  Forget Password
                </a>
              </Form.Text>
            </div>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default LoginAdmin;
