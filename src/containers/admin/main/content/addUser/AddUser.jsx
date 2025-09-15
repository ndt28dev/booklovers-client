import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {
  createNewUser,
  resetCreateUserStatus,
} from "../../../../../redux/slices/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../../../../../config/api";

const AddUser = () => {
  const dispatch = useDispatch();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    password: "",
    avatar: "",
    role: "",
  });

  const isTheme = useSelector((state) => state.theme.isTheme);
  const { isLoading, error, success } = useSelector(
    (state) => state.user.createUser
  );

  //   const [deliveryList, setDeliveryList] = useState([
  //     { phone: "", address: "" },
  //   ]);

  const [deliveryList, setDeliveryList] = useState([]);

  const [avatarPreview, setAvatarPreview] = useState(
    `${API_URL}/avatar/default.jpg`
  );

  const handleAdd = () => {
    setDeliveryList([...deliveryList, { phone: "", address: "" }]);
  };

  const handleRemove = (index) => {
    const updatedList = deliveryList.filter((_, i) => i !== index);
    setDeliveryList(updatedList);
  };

  const handleChange = (index, field, value) => {
    const updatedList = [...deliveryList];
    updatedList[index][field] = value;
    setDeliveryList(updatedList);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("avatar", avatar);

    // Nếu muốn gửi deliveryList
    // formData.append("deliveryList", JSON.stringify(deliveryList));

    dispatch(createNewUser(formData));
  };

  useEffect(() => {
    if (success) {
      setFullname("");
      setEmail("");
      setPassword("");
      setRole("");
      setAvatar(null);
      setAvatarPreview(`${API_URL}/avatar/default.jpg`);
      fileInputRef.current.value = null;

      setErrors({
        fullname: "",
        email: "",
        password: "",
        avatar: "",
        role: "",
      });
      dispatch(resetCreateUserStatus());
      toast.success("Create successful user");
    } else if (error) {
      toast.error(error);
    }
  }, [success, error]);

  const handleRole = (e) => {
    setRole(e.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      role: "",
    }));
  };

  const handleFullname = (e) => {
    setFullname(e.target.value);
    if (e.target.value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullname: "Fullname is required",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullname: "",
      }));
    }
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);

    if (e.target.value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "",
      }));
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    // setErrors((prevErrors) => ({
    //   ...prevErrors,
    //   email: "",
    // }));
    if (e.target.value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      // setAvatar(file.name);
      setAvatar(file);
      setErrors((prevErrors) => ({
        ...prevErrors,
        avatar: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullname.trim()) {
      newErrors.fullname = "Fullname is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!avatar) {
      newErrors.avatar = "Avatar is required";
    }

    if (!role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div>
      {/* <ToastContainer autoClose={1500} /> */}
      <ul
        className="d-flex"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li className="breadcrumb-item me-2">
          <Link to="/admin/users" style={{ textDecoration: "none" }}>
            <i className="bi bi-arrow-left-circle me-1"></i>Users
          </Link>
        </li>
        <li>/ Add User</li>
      </ul>
      <div className="p-4 d-flex justify-content-center w-100 ">
        <div
          className=" p-3 "
          style={{
            flex: "0.7",
            borderRadius: "5px",
            backgroundColor: isTheme ? "#112143" : "#ffffff",
          }}
        >
          <h4 className="mb-3">Add new user</h4>
          <Form style={{ width: "100%" }}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Choose Avatar</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleAvatarChange}
                    isInvalid={!!errors.avatar}
                    ref={fileInputRef}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.avatar}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formRole" className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={role}
                    onChange={handleRole}
                    isInvalid={!!errors.role}
                  >
                    <option value="" disabled>
                      Select role
                    </option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.role}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col
                md={6}
                className="d-flex align-items-center justify-content-center"
              >
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={avatarPreview || "https://via.placeholder.com/150"}
                    alt="Avatar Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Fullname</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter fullname"
                  value={fullname}
                  onChange={handleFullname}
                  isInvalid={!!errors.fullname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullname}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePassword}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} className="" controlId="formGridAddress1">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="@gmail.com"
                  value={email}
                  onChange={handleEmail}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            {/* <div className="mb-3">
              <Row className="align-items-center  justify-content-between">
                <Col>
                  <Form.Label>Delivery information</Form.Label>
                </Col>
                <Col xs="auto">
                  <i
                    className="bi bi-plus-circle-fill text-secondary"
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    onClick={handleAdd}
                  ></i>
                </Col>
              </Row>

              {deliveryList.map((item, index) => (
                <Row key={index} className="mb-2 align-items-center">
                  <Form.Group as={Col}>
                    <Form.Control
                      placeholder="Number phone"
                      value={item.phone}
                      onChange={(e) =>
                        handleChange(index, "phone", e.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Control
                      placeholder="Address"
                      value={item.address}
                      onChange={(e) =>
                        handleChange(index, "address", e.target.value)
                      }
                    />
                  </Form.Group>
                  <Col xs="auto">
                    <i
                      className="bi bi-trash3-fill text-danger"
                      style={{ cursor: "pointer", fontSize: "1.3rem" }}
                      onClick={() => handleRemove(index)}
                    ></i>
                  </Col>
                </Row>
              ))}
            </div> */}

            <Button
              variant="primary"
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Đang tạo...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
