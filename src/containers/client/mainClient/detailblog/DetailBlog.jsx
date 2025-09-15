import React from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import FeaturedPostCard from "../../../../components/featuredpostcard/FeaturedPostCard";
import {
  fetchBlogById,
  fetchAllBlogFeatured,
} from "../../../../redux/slices/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import API_URL from "../../../../config/api";

const DetailBlog = () => {
  const dispatch = useDispatch();
  const { blogDetail } = useSelector((state) => state.blog.detailState);
  const { listFeatured } = useSelector((state) => state.blog.featuredState);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(Number(id)));
      dispatch(fetchAllBlogFeatured());
    }
  }, [dispatch, id]);

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Bài viết", link: "/bai-viet" },
    { label: blogDetail?.title },
  ];
  return (
    <Container className="mb-3">
      <Breadcrumb items={breadcrumbItems} />
      <Row>
        {blogDetail && (
          <Col md={8}>
            <Card className="mb-4 shadow-sm " style={{ border: "none" }}>
              <Card.Body>
                <Card.Text
                  style={{
                    color: "#a7a7a7",
                    fontSize: "12px",
                    padding: "5px 0",
                    margin: "0",
                    fontWeight: "500",
                  }}
                  className="text-muted"
                >
                  {new Date(blogDetail.date).toLocaleDateString("vi-VN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Card.Text>
                <Card.Title style={{ color: "#222" }}>
                  {blogDetail.title}
                </Card.Title>
                <Card.Text
                  style={{
                    fontSize: "12px",
                    color: "#757575",
                    fontStyle: "italic",
                    fontWeight: "500",
                  }}
                >
                  {blogDetail.author}
                </Card.Text>
                <Card.Img
                  variant="top"
                  src={`${API_URL}/blogs/${blogDetail.image}`}
                  style={{
                    maxHeight: 300,
                    objectFit: "cover",
                    margin: "10px 0 20px",
                  }}
                />
                <Card.Text style={{ color: "#757575", whiteSpace: "pre-line" }}>
                  {blogDetail.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}

        <Col md={4}>
          <div style={{ backgroundColor: "white", padding: "14px 10px 5px" }}>
            <h5 className="m2-4">Bài Viết Nổi Bật</h5>
            {listFeatured &&
              listFeatured.map((blog, idx) => (
                <FeaturedPostCard key={idx} blog={blog} />
              ))}
          </div>
        </Col>
      </Row>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "16px",
          border: "1px dashed #ccc",
          borderRadius: "8px",
          color: "#555",
          fontSize: "16px",
          fontStyle: "italic",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        🛠️ Phần bình luận và đánh giá sẽ được phát triển trong thời gian tới.
      </div>
    </Container>
  );
};
export default DetailBlog;
