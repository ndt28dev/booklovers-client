import React, { useEffect, useState, useRef } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Card,
  Image,
  Spinner,
  Container,
  InputGroup,
} from "react-bootstrap";
import ButtonCustom from "../../../../../components/button/ButtonCustom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserWithAddress,
  updateUser,
  resetUpdateUserStatus,
  updatePassword,
} from "../../../../../redux/slices/userSlice";
import { toast } from "react-toastify";
import {
  sendCurrentEmailOtp,
  verifyCurrentEmailOtp,
  confirmNewEmail,
  resetEmailChangeState,
  sendPhoneOtp,
  verifyPhoneOtp,
  sendPhoneOtpFirebase,
  verifyPhoneOtpFirebase,
} from "../../../../../redux/slices/authSlice";
import "./ProfilePage.scss";
import API_URL from "../../../../../config/api";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.profile);
  const { loading, success, error } = useSelector(
    (state) => state.user.updateUser
  );
  const {
    loading: loadingSendCurrentEmailOtp,
    success: successSendCurrentEmailOtp,
    message: messageSendCurrentEmailOtp,
  } = useSelector((state) => state.auth.sendCurrentEmailOtpStatus);
  const {
    loading: loadingVerifyCurrentEmailOtp,
    success: successVerifyCurrentEmailOtp,
    message: messageVerifyCurrentEmailOtp,
  } = useSelector((state) => state.auth.verifyCurrentEmailOtpStatus);
  const {
    loading: loadingConfirmEmail,
    error: errorConfirmEmail,
    success: successConfirmEmail,
    message: messageConfirmNewEmail,
  } = useSelector((state) => state.auth.confirmNewEmailStatus);

  const { sendPhoneOtpStatus } = useSelector((state) => state.auth);

  useEffect(() => {
    if (sendPhoneOtpStatus.message) {
      console.log("OTP đã được gửi:", sendPhoneOtpStatus.message);
    }
    if (sendPhoneOtpStatus.error) {
      console.log("Lỗi khi gửi OTP:", sendPhoneOtpStatus.error);
    }
  }, [sendPhoneOtpStatus]);

  useEffect(() => {
    if (successConfirmEmail) {
      toast.success("Cập nhật thông tin thành công!");
      dispatch(resetEmailChangeState());
      dispatch(getUserWithAddress());
    }

    if (
      errorConfirmEmail &&
      errorConfirmEmail === "Email mới đã tồn tại trong hệ thống."
    ) {
      toast.error(errorConfirmEmail || "Đã xảy ra lỗi khi cập nhật!");
      dispatch(resetEmailChangeState());
    }
  }, [errorConfirmEmail, successConfirmEmail]);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    avatar: "",
    avatarFile: null,
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    day: "",
    month: "",
    year: "",
  });
  const [errors, setErrors] = useState({});

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpConfirm, setOtpConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors1, setErrors1] = useState({});
  const [showPassForm, setShowPassForm] = useState(false);

  useEffect(() => {
    dispatch(getUserWithAddress());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Cập nhật thông tin thành công!");
      dispatch(resetUpdateUserStatus());
      dispatch(getUserWithAddress());
    }

    if (error) {
      toast.error(error || "Đã xảy ra lỗi khi cập nhật!");
    }
  }, [success, error, dispatch]);

  useEffect(() => {
    if (user) {
      const birthdayDate = user.birthday ? new Date(user.birthday) : null;

      setFormData({
        avatar: user.avatar || "",
        fullName: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        day: birthdayDate ? birthdayDate.getDate().toString() : "",
        month: birthdayDate ? (birthdayDate.getMonth() + 1).toString() : "",
        year: birthdayDate ? birthdayDate.getFullYear().toString() : "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFormData = () => {
    const { fullName, day, month, year, gender } = formData;
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Họ tên không được để trống";
    }

    if (!day || !month || !year) {
      newErrors.birthday = "Vui lòng chọn đầy đủ ngày, tháng, năm sinh";
    } else {
      const isValidDate = (y, m, d) => {
        const date = new Date(`${y}-${m}-${d}`);
        return (
          date &&
          date.getFullYear() === parseInt(y) &&
          date.getMonth() + 1 === parseInt(m) &&
          date.getDate() === parseInt(d)
        );
      };

      if (!isValidDate(year, month, day)) {
        newErrors.birthday = "Ngày sinh không hợp lệ";
      }
    }

    if (!gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateFormData()) return;

    const { day, month, year, ...rest } = formData;
    const birthday = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;

    const dataUp = new FormData();
    dataUp.append("fullname", formData.fullName);
    dataUp.append("gender", formData.gender);
    dataUp.append("birthday", birthday);

    if (formData.avatarFile) {
      dataUp.append("avatar", formData.avatarFile);
    }

    dispatch(updateUser(dataUp));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        avatar: preview,
        avatarFile: file,
      }));
    }
  };

  const renderOptions = (start, end) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  const [loadingFakeOtp, setLoadingFakeOtp] = useState(false);
  const [loadingVerifyOtpFake, setLoadingVerifyOtpFake] = useState(false);
  const [loadingUpdateEmailFake, setLoadingUpdateEmailFake] = useState(false);

  const handleSendOTP = async () => {
    setLoadingFakeOtp(true);

    setTimeout(() => {
      dispatch(sendCurrentEmailOtp()).finally(() => {
        setLoadingFakeOtp(false);
        setOtpSent(true);
      });
    }, 1200);
  };

  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) {
      setEmailError("Vui lòng nhập mã xác minh");
      return;
    }

    setLoadingVerifyOtpFake(true);

    setTimeout(() => {
      dispatch(verifyCurrentEmailOtp({ otp: otpCode }))
        .then((res) => {
          if (!res.error) {
            setOtpVerified(true);
            setOtpSent(true);
            setOtpCode("");
            setEmailError("");
            dispatch(resetEmailChangeState());
          } else {
            setEmailError("Mã xác minh không đúng hoặc đã hết hạn");
          }
        })
        .finally(() => setLoadingVerifyOtpFake(false));
    }, 800);
  };

  const handleUpdateNewEmail = async () => {
    if (!newEmail.trim()) {
      setEmailError("Vui lòng nhập email mới");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError("Email không hợp lệ");
      return;
    }

    setLoadingUpdateEmailFake(true);

    setTimeout(() => {
      dispatch(confirmNewEmail({ newEmail }))
        .then((res) => {
          if (!res.error) {
            setShowEmailForm(false);
            setOtpSent(false);
            setOtpVerified(false);
            setOtpCode("");
            setNewEmail("");
            setEmailError("");
          } else {
            setEmailError("Email mới đã tồn tại hoặc có lỗi");
          }
        })
        .finally(() => setLoadingUpdateEmailFake(false));
    }, 1000);
  };

  const handleSendOtpPhone = () => {
    const phone = "0764513977";
    dispatch(sendPhoneOtpFirebase(phone));
  };

  const handleSendOtp = () => {
    const phone = "0764513977";
    dispatch(sendPhoneOtpFirebase(phone));
  };

  const handleVerifyOtpPhone = (otp) => {
    dispatch(verifyPhoneOtp(otp));
  };

  const handleShowPassForm = () => {
    setShowPassForm(!showPassForm);
  };

  const handleUpdatePassword = () => {
    console.log("Cập nhật mật khẩu");
  };

  const handleCancelUpdate = () => {
    setShowPassForm(false);
  };
  const [loadingUpdatePass, setLoadingUpdatePass] = useState(false);

  const handleUpPass = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors1(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoadingUpdatePass(true);
      setTimeout(() => {
        dispatch(updatePassword(password))
          .then((res) => {
            if (!res.error) {
              setShowPassForm(false);
              setPassword("");
              setConfirmPassword("");
              setErrors1({});
              toast.success("Đổi mật khẩu thành công!");
            } else {
              setErrors1({ confirmPassword: "Đổi mật khẩu thất bại!" });
            }
          })
          .finally(() => setLoadingUpdatePass(false));
      }, 1000);
    }
  };

  return (
    <div>
      <Card style={{ borderRadius: "5px" }} className="border-0 p-3">
        <Row className="g-0">
          <Col md={12} lg={7} style={{ borderColor: "#dee2e6" }}>
            <Card style={{ border: "none" }} className="pe-3">
              <Card.Header
                className="px-0 py-1"
                style={{
                  backgroundColor: "#fff",
                  borderBottom: "none",
                }}
              >
                <h5 className="mb-0">Thông tin cá nhân</h5>
              </Card.Header>
              <Card.Body style={{ padding: "8px 0" }}>
                <Row className="align-items-start">
                  <Col md={3} className="text-center position-relative">
                    <Image
                      src={
                        formData.avatarFile
                          ? formData.avatar
                          : user?.avatar?.startsWith("https://")
                          ? user.avatar
                          : `${API_URL}/avatar/${user?.avatar}`
                      }
                      roundedCircle
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        border: "3px solid #cce5ff",
                        padding: "5px",
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    <Button
                      variant="light"
                      size="sm"
                      className="position-absolute"
                      style={{
                        bottom: "0px",
                        right: "15px",
                        border: "1px solid #ccc",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        padding: 0,
                      }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <i
                        className="bi bi-pencil-fill"
                        style={{ fontSize: "12px" }}
                      ></i>
                    </Button>
                  </Col>

                  <Col md={9}>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                          value={formData.fullName}
                          onChange={handleChange}
                          name="fullName"
                          type="text"
                          placeholder="Nhập họ tên"
                          isInvalid={!!errors.fullName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Ngày sinh</Form.Label>
                        <Row>
                          <Col>
                            <Form.Select
                              name="day"
                              value={formData.day}
                              onChange={handleChange}
                              isInvalid={!!errors.birthday}
                              style={{ textAlign: "center" }}
                            >
                              <option value="">Ngày</option>
                              {renderOptions(1, 31)}
                            </Form.Select>
                          </Col>
                          <Col>
                            <Form.Select
                              name="month"
                              value={formData.month}
                              onChange={handleChange}
                              isInvalid={!!errors.birthday}
                              style={{ textAlign: "center" }}
                            >
                              <option value="">Tháng</option>
                              {renderOptions(1, 12)}
                            </Form.Select>
                          </Col>
                          <Col>
                            <Form.Select
                              name="year"
                              value={formData.year}
                              onChange={handleChange}
                              isInvalid={!!errors.birthday}
                              style={{ textAlign: "center" }}
                            >
                              <option value="">Năm</option>
                              {renderOptions(1960, 2015)}
                            </Form.Select>
                          </Col>
                          {errors.birthday && (
                            <Col xs={12}>
                              <div className="text-danger mt-1">
                                {errors.birthday}
                              </div>
                            </Col>
                          )}
                        </Row>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Giới tính</Form.Label>
                        <div>
                          <Form.Check
                            inline
                            label="Nam"
                            name="gender"
                            type="radio"
                            value="MALE"
                            checked={formData.gender === "MALE"}
                            onChange={handleChange}
                            isInvalid={!!errors.gender}
                          />
                          <Form.Check
                            inline
                            label="Nữ"
                            name="gender"
                            type="radio"
                            value="FEMALE"
                            checked={formData.gender === "FEMALE"}
                            onChange={handleChange}
                            isInvalid={!!errors.gender}
                          />
                        </div>
                        {errors.gender && (
                          <div className="text-danger mt-1">
                            {errors.gender}
                          </div>
                        )}
                      </Form.Group>

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
                              <span>Đang xử lý</span>
                            </>
                          ) : (
                            "Lưu thay đổi"
                          )
                        }
                        icon="bi bi-save me-2"
                        bgrColor="#E35765"
                        onClick={handleSubmit}
                      />
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={12} lg={5} className="mt-2 mt-lg-0 border-lg-start">
            <Card style={{ border: "none" }}>
              <Card.Body className="px-0 ps-lg-3 py-1">
                <h5 className="mb-4">Số điện thoại và Email</h5>

                <Row className="align-items-center mb-3">
                  <Col xs={1} className="text-center">
                    <i className="bi bi-telephone-fill text-muted"></i>
                  </Col>
                  <Col xs={8}>
                    <div className="fw-medium">Số điện thoại</div>
                    <div
                      className={`small ${
                        formData.phone ? "text-muted" : "text-warning"
                      }`}
                    >
                      {formData.phone || "Chưa cập nhật"}
                    </div>
                  </Col>
                  <Col xs={3} className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      style={{ minWidth: "75px" }}
                      onClick={handleSendOtpPhone}
                      disabled
                    >
                      Cập nhật
                    </Button>
                    <div id="recaptcha-container"></div>
                  </Col>
                </Row>

                <Row className="align-items-center mb-4">
                  <Col xs={1} className="text-center">
                    <i className="bi bi-envelope-fill text-muted"></i>
                  </Col>
                  <Col xs={8}>
                    <div className="fw-medium">Địa chỉ email</div>
                    <div
                      className={`small ${
                        formData.email ? "text-muted" : "text-warning"
                      }`}
                    >
                      {formData.email || "Chưa cập nhật"}
                    </div>
                  </Col>
                  <Col xs={3} className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      style={{ minWidth: "75px" }}
                      onClick={() => {
                        setShowEmailForm(!showEmailForm);
                      }}
                      // disabled
                    >
                      Cập nhật
                    </Button>
                  </Col>
                </Row>

                {showEmailForm && (
                  <Row>
                    <Col>
                      {!otpSent && (
                        <>
                          <Form.Group className="mb-2">
                            <Form.Control
                              value={formData.email}
                              disabled
                              readOnly
                            />
                          </Form.Group>
                          <div className="d-flex justify-content-end">
                            <Button
                              variant="secondary"
                              className="me-2"
                              size="sm"
                              onClick={() => setShowEmailForm(false)}
                            >
                              Hủy
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={handleSendOTP}
                              disabled={loadingFakeOtp}
                              style={{ minWidth: "61.11px" }}
                            >
                              {loadingFakeOtp ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                  />
                                </>
                              ) : (
                                "Lấy mã"
                              )}
                            </Button>
                          </div>
                        </>
                      )}

                      {otpSent && !otpVerified && (
                        <>
                          <Form.Group className="mb-2">
                            <Form.Label className="fw-semibold">
                              Mã xác minh
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Nhập mã gửi về email hiện tại"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              isInvalid={!!emailError}
                            />
                            <Form.Control.Feedback type="invalid">
                              {emailError}
                            </Form.Control.Feedback>

                            {messageSendCurrentEmailOtp !== null && (
                              <Form.Label
                                className="text-success fw-semibold mt-1"
                                style={{ fontSize: "13px" }}
                              >
                                {messageSendCurrentEmailOtp}
                              </Form.Label>
                            )}
                          </Form.Group>
                          <div className="d-flex justify-content-end">
                            <Button
                              variant="secondary"
                              className="me-2"
                              size="sm"
                              onClick={() => {
                                setOtpSent(false);
                                setOtpCode("");
                                setEmailError("");
                              }}
                            >
                              Quay lại
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={handleVerifyOTP}
                              disabled={loadingVerifyOtpFake}
                              style={{ minWidth: "74.59px" }}
                            >
                              {loadingVerifyOtpFake ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                  />
                                </>
                              ) : (
                                "Xác minh"
                              )}
                            </Button>
                          </div>
                        </>
                      )}

                      {otpVerified && (
                        <>
                          <Form.Group className="mb-2">
                            <Form.Label className="fw-semibold">
                              Email mới
                            </Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="Nhập email mới"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              isInvalid={!!emailError}
                            />
                            <Form.Control.Feedback type="invalid">
                              {emailError}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <div className="d-flex justify-content-end">
                            <Button
                              variant="secondary"
                              className="me-2"
                              size="sm"
                              onClick={() => {
                                setOtpSent(false);
                                setOtpVerified(false);
                                setOtpCode("");
                                setNewEmail("");
                                setEmailError("");
                              }}
                            >
                              Hủy
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={handleUpdateNewEmail}
                              disabled={loadingUpdateEmailFake}
                              style={{ minWidth: "75px" }}
                            >
                              {loadingUpdateEmailFake ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                  />
                                </>
                              ) : (
                                "Cập nhật"
                              )}
                            </Button>
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                )}

                <hr />

                <h5 className="mb-4">Bảo mật</h5>

                <Row className="align-items-center mb-3">
                  <Col xs={1} className="text-center">
                    <i className="bi bi-lock-fill text-muted"></i>
                  </Col>
                  <Col xs={8}>Đổi mật khẩu</Col>
                  <Col xs={3} className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      style={{ minWidth: "75px" }}
                      onClick={handleShowPassForm}
                    >
                      Cập nhật
                    </Button>
                  </Col>
                </Row>
                {showPassForm && (
                  <Form className="mb-3">
                    <Form.Group className="mb-3">
                      <Form.Label>Mật khẩu mới</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-lock-fill" />
                        </InputGroup.Text>
                        <Form.Control
                          type={showPass ? "text" : "password"}
                          placeholder="Mật khẩu mới"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          isInvalid={!!errors1.password}
                        />
                        <InputGroup.Text
                          onClick={() => setShowPass(!showPass)}
                          style={{ cursor: "pointer" }}
                        >
                          <i
                            className={`bi ${
                              showPass ? "bi-eye-slash" : "bi-eye"
                            }`}
                          />
                        </InputGroup.Text>{" "}
                        <Form.Control.Feedback type="invalid">
                          {errors1.password}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-lock-fill" />
                        </InputGroup.Text>
                        <Form.Control
                          type={showConfirm ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu mới"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          isInvalid={!!errors1.confirmPassword}
                        />
                        <InputGroup.Text
                          onClick={() => setShowConfirm(!showConfirm)}
                          style={{ cursor: "pointer" }}
                        >
                          <i
                            className={`bi ${
                              showConfirm ? "bi-eye-slash" : "bi-eye"
                            }`}
                          />
                        </InputGroup.Text>{" "}
                        <Form.Control.Feedback type="invalid">
                          {errors1.confirmPassword}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-secondary"
                        onClick={handleCancelUpdate}
                        size="sm"
                      >
                        Huỷ
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleUpPass}
                        disabled={loadingUpdatePass}
                        style={{ minWidth: "75px" }}
                      >
                        {loadingUpdatePass ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                          </>
                        ) : (
                          "Cập nhật"
                        )}
                      </Button>
                    </div>
                  </Form>
                )}

                <Row className="align-items-center mb-3">
                  <Col xs={1} className="text-center">
                    <i className="bi bi-shield-lock-fill text-muted"></i>
                  </Col>
                  <Col xs={8}>Thiết lập mã PIN</Col>
                  <Col xs={3} className="text-end">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled
                      style={{ minWidth: "75px" }}
                    >
                      Thiết lập
                    </Button>
                  </Col>
                </Row>

                <Row className="align-items-center mb-4">
                  <Col xs={1} className="text-center">
                    <i className="bi bi-trash-fill text-muted"></i>
                  </Col>
                  <Col xs={8}>Yêu cầu xóa tài khoản</Col>
                  <Col xs={3} className="text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      disabled
                      style={{ minWidth: "75px" }}
                    >
                      Yêu cầu
                    </Button>
                  </Col>
                </Row>

                <hr />

                <h5 className="mb-4">Liên kết mạng xã hội</h5>

                <Row className="align-items-center">
                  <Col xs={1} className="text-center">
                    <i className="bi bi-facebook text-primary"></i>
                  </Col>
                  <Col xs={8}>Facebook</Col>
                  <Col xs={3} className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled
                      style={{ minWidth: "75px" }}
                    >
                      Liên kết
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProfilePage;
