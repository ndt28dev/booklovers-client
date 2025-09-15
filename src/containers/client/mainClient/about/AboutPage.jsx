import React, { useState } from "react";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import ButtonCustom from "../../../../components/button/ButtonCustom";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Modal,
  Button,
} from "react-bootstrap";
import about1 from "../../../../assets/image/about/about1.jpg";
import about2 from "../../../../assets/image/about/about2.jpg";
import about3 from "../../../../assets/image/about/about3.jpg";
import about4 from "../../../../assets/image/about/about4.webp";
import aboutlast from "../../../../assets/image/about/about_last.png";
import { useNavigate } from "react-router-dom";
import "./AboutPage.scss";

const services = [
  {
    icon: (
      <i
        className="bi bi-box-arrow-down"
        style={{ fontSize: "50px", color: "#E35765" }}
      ></i>
    ),
    title: "1. Bắt đầu chiến dịch",
    desc: "Bắt đầu một chiến dịch quảng bá sách với các công cụ hỗ trợ mạnh mẽ, giúp bạn dễ dàng tiếp cận đúng đối tượng độc giả và tăng khả năng bán sách nhanh chóng, hiệu quả.",
  },
  {
    icon: (
      <i
        className="bi bi-lightbulb"
        style={{ fontSize: "50px", color: "#E35765" }}
      ></i>
    ),
    title: "2. Phát triển ý tưởng",
    desc: "Chúng tôi hỗ trợ bạn trong việc xây dựng và phát triển nội dung sách, từ ý tưởng ban đầu cho đến khi hoàn thiện, đảm bảo cuốn sách của bạn có giá trị và thu hút độc giả.",
  },
  {
    icon: (
      <i
        className="bi bi-people"
        style={{ fontSize: "50px", color: "#E35765" }}
      ></i>
    ),
    title: "3. Thu hút người dùng",
    desc: "Thông qua các chiến lược truyền thông và mạng lưới người yêu sách, bạn có thể nhanh chóng mở rộng tệp độc giả và tạo dựng cộng đồng xung quanh sách của mình.",
  },
  {
    icon: (
      <i
        className="bi bi-balloon-heart"
        style={{ fontSize: "50px", color: "#E35765" }}
      ></i>
    ),
    title: "4. Tạo ưu đãi hấp dẫn",
    desc: "Thiết lập các chương trình giảm giá, quà tặng hoặc combo sách để gia tăng doanh số và tạo cảm giác đặc biệt cho người mua trong từng chiến dịch bán hàng.",
  },
  {
    icon: (
      <i
        className="bi bi-briefcase"
        style={{ fontSize: "50px", color: "#E35765" }}
      ></i>
    ),
    title: "5. Tiết kiệm thời gian",
    desc: "Với hệ thống quản lý bán sách thông minh, bạn sẽ không còn mất nhiều thời gian xử lý đơn hàng, quản lý kho hay theo dõi tiến độ chiến dịch thủ công.",
  },
  {
    icon: (
      <i
        className="bi bi-pencil"
        style={{ fontSize: "50px", color: "#E35765" }}
      ></i>
    ),
    title: "6. Sách in sẵn có",
    desc: "Cung cấp sách in chất lượng cao với các tùy chọn bìa mềm hoặc bìa cứng, đảm bảo trải nghiệm đọc tốt nhất và tạo sự chuyên nghiệp cho sản phẩm của bạn.",
  },
];

const pricingPlans = [
  {
    name: "Cơ bản",
    price: "99.000",
    features: [
      "Truy cập toàn bộ sách cơ bản",
      "Nội dung bổ sung định kỳ mỗi tháng",
      "Hỗ trợ tải sách định dạng PDF",
      "Ưu đãi giảm giá 5% khi mua sách in",
      "Tặng 1 ebook mỗi tháng",
    ],
    highlight: false,
  },
  {
    name: "Tiêu chuẩn",
    price: "499.000",
    features: [
      "Truy cập tất cả sách trong thư viện",
      "Nội dung độc quyền cập nhật hàng tuần",
      "Tải xuống với nhiều định dạng (PDF, ePub, Mobi)",
      "Ưu đãi giảm giá 10% cho sách in và sự kiện",
      "Tặng 3 ebook chất lượng cao mỗi tháng",
    ],
    highlight: true,
  },
  {
    name: "Chuyên nghiệp",
    price: "999.000",
    features: [
      "Toàn quyền truy cập tất cả sách, bao gồm sách mới phát hành",
      "Ưu tiên truy cập nội dung đặc biệt và audio book",
      "Tải không giới hạn, hỗ trợ đọc offline nâng cao",
      "Ưu đãi giảm 20% cho toàn bộ sản phẩm BookLovers",
      "Tặng 5 ebook & 1 sách in miễn phí mỗi tháng",
    ],
    highlight: false,
  },
];

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Giới thiệu" },
];

const AboutPage = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleShowModal = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  return (
    <div>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <Row className="align-items-center py-lg-5">
          <Col md={12} lg={5} className="mb-4 mb-md-0">
            <h2 className="fw-bold mb-3">
              Khám phá <span style={{ color: "#E35765" }}>Thế Giới Sách</span>{" "}
              đầy cảm hứng
            </h2>
            <p className="fst-italic text-muted">
              Sách không chỉ là tri thức – mà còn là người bạn đồng hành giúp
              bạn hiểu rõ bản thân và thế giới quanh mình.
            </p>
            <p>
              Tại BookLovers, chúng tôi tuyển chọn những cuốn sách hay nhất về
              kỹ năng, văn học, thiếu nhi và phát triển bản thân. Mỗi cuốn sách
              là một hành trình – và chúng tôi hân hạnh đồng hành cùng bạn.
            </p>

            <div className="mt-1">
              <ButtonCustom
                text="Xem thêm →"
                bgrColor="#E35765"
                onClick={() => {
                  navigate("/san-pham");
                }}
              />
            </div>
          </Col>

          <Col
            lg={6}
            md={12}
            className="position-relative d-flex justify-content-center mt-lg-0 mt-5"
          >
            <div
              className="position-relative"
              style={{ width: "320px", height: "320px" }}
            >
              <Image
                src={about1}
                rounded
                fluid
                className="position-absolute shadow"
                style={{
                  width: "300px",
                  top: "30px",
                  right: "-150px",
                  border: "4px solid #fff",
                  zIndex: 2,
                }}
              />
              <Image
                src={about2}
                rounded
                fluid
                className="position-absolute shadow"
                style={{
                  width: "200px",
                  top: "90px",
                  left: "60px",
                  border: "4px solid #fff",
                  zIndex: 4,
                }}
              />
              <Image
                src={about3}
                rounded
                fluid
                className="position-absolute shadow"
                style={{
                  width: "300px",
                  bottom: "10px",
                  left: "0",
                  border: "4px solid #fff",
                  zIndex: 3,
                }}
              />
              <Image
                src={about4}
                rounded
                fluid
                className="position-absolute shadow"
                style={{
                  width: "250px",
                  top: "-30px",
                  left: "10px",
                  border: "4px solid #fff",
                  zIndex: 1,
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
      <Container className="py-5 text-center">
        <h4 className="text-uppercase text-muted mb-2">Dịch vụ nổi bật</h4>
        <div className="d-flex justify-content-center">
          <p className="text-secondary mb-5" style={{ width: "420px" }}>
            Các nhà sách trực tuyến lớn cung cấp sách đã qua sử dụng. Bạn cũng
            có thể bán sách của riêng mình.
          </p>
        </div>
        <Row>
          {services.map((service, index) => (
            <Col md={4} className="mb-4" key={index}>
              <Card className="p-4 shadow-sm border-0 h-100">
                <div className="mb-2">{service.icon}</div>
                <h6 className="fw-bold" style={{ color: "#2e2e2e" }}>
                  {service.title}
                </h6>
                <p className="text-muted small">{service.desc}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Container className="py-5 text-center">
        <h4 className="text-uppercase text-muted mb-2">Các gói dịch vụ</h4>
        <div className="d-flex justify-content-center">
          <p className="text-secondary mb-5" style={{ width: "480px" }}>
            Các nhà sách trực tuyến cung cấp sách với nhiều tùy chọn phù hợp.
            Hãy chọn gói dịch vụ phù hợp với bạn!
          </p>
        </div>
        <Row>
          {pricingPlans.map((plan, idx) => (
            <Col md={4} key={idx} className="mb-4">
              <Card
                className={`p-4 h-100 shadow-sm border-0 d-flex flex-column ${
                  plan.highlight ? "text-white bg-custom" : ""
                }`}
              >
                <div
                  className={`mb-3 fw-bold ${
                    plan.highlight
                      ? "bg-white text-custom"
                      : "bg-custom text-white"
                  } py-1 px-3 rounded-pill d-inline-block`}
                >
                  {plan.name.toUpperCase()}
                </div>
                <h2 className="display-5 mb-0">
                  <sup className="fs-6">₫</sup>
                  {plan.price}
                </h2>
                <small className="text-uppercase mb-3 d-block">/ tháng</small>
                <hr
                  className={`my-3 ${plan.highlight ? "border-white" : ""}`}
                />
                <ul className="list-unstyled mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="mb-2">
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto d-flex justify-content-center">
                  <ButtonCustom
                    text="Mua ngay"
                    bgrColor={plan.highlight ? "white" : "#E35765"}
                    color={plan.highlight ? "#E35765" : "white"}
                    onClick={() => handleShowModal(plan)}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Container className="py-5">
        <h5 className="text-uppercase text-center text-muted mb-2">
          Đọc sách trên mọi thiết bị
        </h5>
        <p
          className="text-center text-secondary mb-5"
          style={{ maxWidth: 600, margin: "0 auto" }}
        >
          BookLovers hỗ trợ bạn đọc sách mọi lúc mọi nơi với trải nghiệm tuyệt
          vời trên cả điện thoại và máy tính bảng. Dù bạn đang di chuyển hay thư
          giãn tại nhà, việc đọc sách chưa bao giờ dễ dàng đến thế.
        </p>

        <Row className="align-items-center" style={{ padding: "0 100px" }}>
          <Col md={6}>
            <h5 className=" text-dark" style={{ fontWeight: "600" }}>
              Thư viện sách trong tầm tay của bạn
            </h5>
            <p className="text-muted">
              Với ứng dụng BookLovers, bạn có thể truy cập hàng ngàn cuốn sách
              từ điện thoại, tablet hoặc bất kỳ thiết bị nào. Giao diện thân
              thiện, dễ sử dụng và tốc độ nhanh giúp bạn tận hưởng trải nghiệm
              đọc liền mạch.
            </p>
            <p className="text-muted">
              Tải ngay ứng dụng miễn phí và khám phá thế giới sách mọi lúc mọi
              nơi.
            </p>
            <div className="d-flex gap-3 flex-wrap mt-3">
              <Button
                variant="light"
                className="d-flex align-items-center px-3 py-2 shadow"
                style={{
                  backgroundColor: "#2e2e2e",
                  color: "white",
                  borderRadius: "0.5rem",
                }}
              >
                <i className="bi bi-apple me-2"></i>
                <div className="text-start">
                  <small
                    className="d-block"
                    style={{ lineHeight: "1", color: "#9c9c9c" }}
                  >
                    Tải trên
                  </small>
                  <span>App Store</span>
                </div>
              </Button>

              <Button
                variant="light"
                className="d-flex align-items-center px-3 py-2 shadow"
                style={{
                  backgroundColor: "#2e2e2e",
                  color: "white",
                  borderRadius: "0.5rem",
                }}
              >
                <i className="bi bi-google-play me-2"></i>
                <div className="text-start">
                  <small
                    className="d-block"
                    style={{ lineHeight: "1", color: "#9c9c9c" }}
                  >
                    Tải từ
                  </small>
                  <span>Google Play</span>
                </div>
              </Button>
            </div>
          </Col>
          <Col md={6} className="text-center mt-3 mt-md-0">
            <Image
              src={aboutlast}
              alt="Thiết bị hiển thị"
              fluid
              rounded
              style={{ maxHeight: "300px" }}
            />
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận mua gói</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan && (
            <>
              <p>
                Bạn có chắc chắn muốn đăng ký gói{" "}
                <strong style={{ color: "#E35765" }}>
                  {selectedPlan.name}
                </strong>{" "}
                với giá{" "}
                <strong style={{ color: "#E35765" }}>
                  {selectedPlan.price}₫ / tháng
                </strong>{" "}
                không?
              </p>
              <ul>
                {selectedPlan.features.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>

          <ButtonCustom
            text="Xác nhận"
            onClick={() =>
              alert(
                "Chức năng này sẽ được phát triển trong thời gian tới. Vui lòng quay lại sau."
              )
            }
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AboutPage;
