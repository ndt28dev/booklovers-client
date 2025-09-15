import React, { useEffect } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./BookBanner.scss";
import bookbanner1 from "../../../../../assets/image/bookbanner1.png";
import bookbanner2 from "../../../../../assets/image/bookbanner2.png";
import bookbanner3 from "../../../../../assets/image/bookbanner3.jpg";
import bookbanner4 from "../../../../../assets/image/bookbanner4.jpg";
import bookbanner5 from "../../../../../assets/image/bookbanner5.png";
import bookbanner6 from "../../../../../assets/image/bookbanner6.png";
import bookbgrbanner from "../../../../../assets/image/bookbgrbanner.jpg";
import ButtonCustom from "../../../../../components/button/ButtonCustom";
import { fetchCategoriesWithSub } from "../../../../../redux/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import slugify from "slugify";

const BookBanner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories: cat } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategoriesWithSub());
  }, []);

  const categories = [
    {
      title: "Tất Cả Sách",
      image: bookbanner1,
      to: "/san-pham",
    },
    {
      title: "Sách Lập Trình",
      image: bookbanner6,
      to: "/san-pham/danh-muc/lap-trinh",
      id: 1,
      name: "Lập Trình",
    },
    {
      title: "Sách Kinh Tế",
      image: bookbanner3,
      to: "/san-pham/danh-muc/kinh-te",
      id: 5,
      name: "Kinh Tế",
    },
    {
      title: "Sách Thiếu Nhi",
      image: bookbanner5,
      to: "/san-pham/danh-muc/thieu-nhi",
      id: 2,
      name: "Thiếu Nhi",
    },
    {
      title: "Sách Kỹ Năng",
      image: bookbanner4,
      to: "/san-pham/danh-muc/ky-nang",
      id: 6,
      name: "Kỹ Năng",
    },
    {
      title: "Sách nước ngoài",
      image: bookbanner2,
      to: "/san-pham/danh-muc/nuoc-ngoai",
      id: 8,
      name: "Nước Ngoài",
    },
  ];

  return (
    <div className="book-banner p-4">
      <Container className="mb-4">
        <Row className="g-4 justify-content-center">
          {categories.map((cat, idx) => (
            <Col xs={6} md={4} lg={2} className="mb-4" key={idx}>
              <Link
                to={cat.to}
                state={{ id: cat.id, name: cat.name }}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="category-card text-center p-3 shadow-sm rounded"
                  style={{
                    cursor: "pointer",
                    background: "#fff",
                    width: "100%",
                  }}
                >
                  <Image
                    src={cat.image}
                    rounded
                    className="mb-3"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <h5 className="text-dark">{cat.title}</h5>
                  <span className="text-primary fw-semibold">
                    XEM NGAY &raquo;
                  </span>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>

      <Container className="book-banner-bottom text-white d-flex align-items-center ">
        <Row className="w-100 g-0 ">
          <Col lg={7} md={12}>
            <Image src={bookbgrbanner} fluid />
          </Col>
          <Col
            lg={5}
            md={12}
            className="d-flex flex-column justify-content-center align-items-start p-2 p-md-4 p-lg-5"
            style={{ backgroundColor: "#E35765" }}
          >
            <p className="small text-uppercase text-white mb-2 mb-md-3">
              KHÁM PHÁ KHO SÁCH
            </p>
            <h1 className="display-5 fs-3 fw-bold text-white">
              TẤT CẢ SẢN PHẨM
            </h1>

            <ButtonCustom
              color="#E35765"
              bgrColor="white"
              text="Khám phá ngay →"
              onClick={() => navigate("/san-pham")}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BookBanner;
