import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Card,
  Modal,
} from "react-bootstrap";
import storeimg from "../../../../assets/image/store/store.png";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import ButtonCustom from "../../../../components/button/ButtonCustom";
import {
  createContact,
  resetContactStatus,
} from "../../../../redux/slices/contactSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import lienheImage from "../../../../assets/image/store/lienhe.svg";

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Cửa hàng" },
];

const StorePage = () => {
  const dispatch = useDispatch();
  const { isSubmitting, submitSuccess, submitError } = useSelector(
    (state) => state.contact
  );

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleinputName = (e) => {
    setName(e.target.value);
    if (e.target.value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Bắt buộc nhập Họ và tên",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "",
      }));
    }
  };

  const handleinputEmail = (e) => {
    setEmail(e.target.value);
    if (e.target.value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Bắt buộc nhập Email",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  };

  const handleinputPhone = (e) => {
    setPhone(e.target.value);
    if (e.target.value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "Bắt buộc nhập Số điện thoại",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "",
      }));
    }
  };

  const handleinputMesage = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      name,
      email,
      phone,
      message,
    };

    dispatch(createContact(formData));
  };

  useEffect(() => {
    if (submitSuccess) {
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");

      setErrors({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      dispatch(resetContactStatus());

      setShowModal(true);
    } else if (isSubmitting) {
      console.log("thất bại");
    }
  }, [submitSuccess, isSubmitting]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Bắt buộc nhập Họ và tên";
    }

    if (!email.trim()) {
      newErrors.email = "Bắt buộc nhập Email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!phone.trim()) {
      newErrors.phone = "Bắt buộc nhập Số điện thoại";
    } else if (!/^(0\d{9}|84\d{9})$/.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  return (
    <div>
      <Container className="">
        <Breadcrumb items={breadcrumbItems} />
        <Row className="mb-3 py-2 d-flex align-items-center">
          <Col md={12} lg={6}>
            <h2 className="mb-3">
              Hệ thống <span style={{ color: "#D14552" }}>BOOKLOVERS</span>
            </h2>
            <p className="lead text-secondary">
              Đẹp & hiện đại trên toàn quốc – nơi mang lại không gian đọc sách
              tuyệt vời, yên tĩnh và thân thiện.
            </p>
            <p>
              BookLovers là chuỗi nhà sách hiện đại, nơi bạn có thể đọc, học và
              thư giãn trong một không gian rộng rãi và tiện nghi.
            </p>
            <p>
              Chúng tôi mang đến hàng ngàn đầu sách hay, dịch vụ tận tâm và
              không gian đọc lý tưởng cho mọi lứa tuổi.
            </p>
          </Col>

          <Col md={12} lg={6}>
            <Image src={storeimg} fluid rounded />
          </Col>
        </Row>
        <Row className="mb-5 text-center">
          <Col lg={4} md={12} style={{ padding: "0 80px" }}>
            <i
              className="bi bi-telephone"
              style={{ fontSize: "50px", color: "#D14552" }}
            ></i>
            <h5 className="mt-3" style={{ color: "#313E5B", fontWeight: 500 }}>
              Hotline
            </h5>
            <p className="text-muted mb-1">
              Giờ làm việc: 08:00–17:00 hằng ngày (trừ Thứ 7 & Chủ nhật)
            </p>
            <p className="text-primary ">(+84) 76 45 13 977</p>
          </Col>
          <Col lg={4} md={12} style={{ padding: "0 80px" }}>
            <i
              className="bi bi-envelope"
              style={{ fontSize: "50px", color: "#D14552" }}
            ></i>
            <h5 className="mt-3" style={{ color: "#313E5B", fontWeight: 500 }}>
              Email
            </h5>
            <p className="text-muted mb-1">
              Chúng tôi theo dõi hộp thư thường xuyên và sẽ phản hồi sớm nhất.
            </p>
            <p className="text-primary ">ndt28dev@gmail.com</p>
          </Col>
          <Col lg={4} md={12} style={{ padding: "0 80px" }}>
            <i
              className="bi bi-pin-map"
              style={{ fontSize: "50px", color: "#D14552" }}
            ></i>
            <h5 className="mt-3" style={{ color: "#313E5B", fontWeight: 500 }}>
              Địa chỉ
            </h5>
            <p className="text-muted mb-1">
              15 Trương Hán Siêu,Phường Cư Bao,Tỉnh ĐakLak
            </p>
            <a
              href="https://maps.app.goo.gl/4qe1g82VAScfXpUH9"
              target="_blank"
              className="text-primary text-decoration-none "
            >
              Xem trên Google map
            </a>
          </Col>
        </Row>

        <Row className="mb-5 d-flex align-items-center">
          <Col md={6}>
            <img
              src={lienheImage}
              alt="Thông tin liên hệ BookLovers"
              className="img-fluid rounded "
            />
          </Col>

          <Col md={6}>
            <h5 className="mb-3">Gửi phản hồi</h5>
            <Form>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>
                  Họ và tên <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập họ tên"
                  isInvalid={!!errors.name}
                  value={name}
                  onChange={handleinputName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  isInvalid={!!errors.email}
                  onChange={handleinputEmail}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>
                  Số điện thoại <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Số điện thoại"
                  value={phone}
                  isInvalid={!!errors.phone}
                  onChange={handleinputPhone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="message">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Góp ý hoặc yêu cầu của bạn..."
                  value={message}
                  onChange={handleinputMesage}
                />
              </Form.Group>

              <ButtonCustom text="Gửi ngay" onClick={handleSubmit} />
            </Form>
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Gửi liên hệ thành công!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Cảm ơn bạn đã để lại liên hệ với{" "}
            <strong style={{ color: "#D14552" }}>BookLovers</strong>. Chúng tôi
            sẽ phản hồi bạn sớm nhất có thể!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <ButtonCustom text="Về trang chủ" onClick={() => navigate("/")} />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StorePage;
