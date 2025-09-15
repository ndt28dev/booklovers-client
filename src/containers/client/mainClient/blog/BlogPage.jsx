import React, { useState, useEffect } from "react";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import BlogPostCard from "./blogpostcard/BlogPostCard";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import FeaturedPostCard from "../../../../components/featuredpostcard/FeaturedPostCard";
import "./BlogPage.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBlog,
  fetchAllBlogFeatured,
} from "../../../../redux/slices/blogSlice";

const BlogPage = () => {
  const dispatch = useDispatch();
  const { listBlog, pagination } = useSelector((state) => state.blog.listState);
  const { listFeatured } = useSelector((state) => state.blog.featuredState);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const totalPages = pagination?.totalPages || 0;
  const total = pagination?.total || 0;
  const page = pagination?.page || 1;

  useEffect(() => {
    dispatch(fetchAllBlog({ page: currentPage, limit: postsPerPage }));
    dispatch(fetchAllBlogFeatured());
  }, [dispatch, currentPage]);

  // useEffect(() => {
  //   if (page !== currentPage) {
  //     setCurrentPage(page);
  //   }
  // }, [page]);

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber !== currentPage &&
      pageNumber >= 1 &&
      pageNumber <= totalPages
    ) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const breadcrumbBlog = [
    { label: "Trang chủ", link: "/" },
    { label: "Bài viết" },
  ];

  return (
    <Container className="mb-4">
      <Breadcrumb items={breadcrumbBlog} />

      <Row>
        <Col md={12} lg={8}>
          <h3 className="mb-4">Tất cả Bài Viết</h3>

          <Row className="g-4">
            {listBlog &&
              listBlog.map((post, idx) => (
                <Col key={idx} xs={12} md={6} lg={4}>
                  <BlogPostCard post={post} />
                </Col>
              ))}
          </Row>

          <div className="d-flex justify-content-between align-items-center mt-1">
            <div>
              {/* <span>
                Hiển thị{" "}
                {total === 0 ? 0 : (currentPage - 1) * postsPerPage + 1} đến{" "}
                {Math.min(currentPage * postsPerPage, total)} trong tổng {total}{" "}
                bài viết
              </span> */}
            </div>
            {totalPages < 1 && (
              <div className="d-flex justify-content-end">
                <Pagination></Pagination>
              </div>
            )}
            {totalPages > 1 && (
              <Pagination className="pagination-light-blog mt-3">
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />

                {[...Array(totalPages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={idx + 1 === currentPage}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            )}
          </div>
        </Col>

        <Col md={12} lg={4}>
          <h3 className="mb-4">Bài Viết Nổi Bật</h3>
          <Row className="g-3">
            {listFeatured &&
              listFeatured.map((blog, idx) => (
                <Col key={idx} md={6} lg={12}>
                  <FeaturedPostCard blog={blog} />
                </Col>
              ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogPage;
