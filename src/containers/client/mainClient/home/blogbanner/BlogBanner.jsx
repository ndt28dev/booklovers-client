import React from "react";
import { Container, Row, Col, Button, Image, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ButtonCustom from "../../../../../components/button/ButtonCustom";
import blogbanner1 from "../../../../../assets/image/blogbanner1.jpg";
import blogbanner2 from "../../../../../assets/image/blogbanner2.jpg";

const BlogBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <Container className="py-3">
        <Row className="align-items-center gx-5">
          <Col md={4}>
            <p className="text-muted">Sách Nổi Bật</p>
            <h3 className="fw-bold">
              Cẩm Nang Thiết Kế Đồ Họa Dành Cho Người Mới Bắt Đầu
            </h3>
            <em>Anggi Krisna</em>
            <p className="mt-3 text-secondary">
              Từ những bộ chọn CSS nâng cao, hiệu ứng đổ bóng, chuyển màu, cho
              đến font chữ web và các kỹ thuật hoạt hình tinh tế – cuốn sách này
              mở ra cả một thế giới sáng tạo dành cho những ai yêu thích thiết
              kế giao diện web và đồ họa.
            </p>

            <ButtonCustom
              text="Đọc ngay →"
              bgrColor="#E25765"
              onClick={() => navigate("/bai-viet")}
            />
          </Col>

          <Col md={8} className="text-center p-3">
            <Row className="g-0 mb-3">
              <Image
                src={blogbanner1}
                alt="Book Cover"
                fluid
                className="rounded shadow-sm"
                style={{ width: "100%", height: "250px" }}
              />
            </Row>
            <Row className="g-0">
              <Image
                src={blogbanner2}
                alt="Book Cover"
                fluid
                className="rounded shadow-sm"
                style={{ width: "100%", height: "250px" }}
              />
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogBanner;
