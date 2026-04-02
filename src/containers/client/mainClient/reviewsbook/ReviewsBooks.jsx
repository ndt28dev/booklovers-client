import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ProgressBar,
  Button,
  Image,
  Badge,
} from "react-bootstrap";
import "./ReviewsBooks.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReview,
  getReviewsByBookId,
  resetDeleteReview,
} from "../../../../redux/slices/reviewSlice";
import { getUserWithAddress } from "../../../../redux/slices/userSlice";
import API_URL from "../../../../config/api";
import MyModal from "../../../../components/mymodal/MyModal";
import { formatDateTime } from "../../../../utils/format";
import { toast } from "react-toastify";

const filters = ["Tất cả", "5★", "4★", "3★", "2★", "1★", "0★"];

const ratingMap = {
  "5★": 5,
  "4★": 4,
  "3★": 3,
  "2★": 2,
  "1★": 1,
  "0★": 0,
};

const ReviewsBooks = ({ bookId }) => {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [preview, setPreview] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const { data } = useSelector((state) => state.review.bookReviews);
  const { user } = useSelector((state) => state.user.profile);
  const { success, error } = useSelector((state) => state.review.deleteReview);

  useEffect(() => {
    const ratingValue =
      activeFilter !== "Tất cả" ? ratingMap[activeFilter] : null;

    dispatch(getReviewsByBookId({ book_id: bookId, rating: ratingValue }));
  }, [dispatch, activeFilter, bookId]);

  useEffect(() => {
    dispatch(getUserWithAddress());
  }, []);

  const reviewsList = Array.isArray(data?.reviews) ? data.reviews : [];

  const sortedReviews = [...reviewsList].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
    dispatch(deleteReview(id));
  };

  useEffect(() => {
    if (success) {
      toast.success("Xoá đánh giá thành công!");
      dispatch(resetDeleteReview());
      dispatch(getReviewsByBookId({ book_id: bookId, rating: null }));
    } else if (error) {
      toast.error(error?.message || error);
    }
  }, [error, success]);

  return (
    <>
      <MyModal
        show={!!preview}
        handleClose={() => setPreview(null)}
        title="Xem chi tiết"
      >
        <div className="text-center">
          {preview?.type === "image" && (
            <Image
              src={preview.url}
              fluid
              style={{ maxHeight: "100vh", objectFit: "contain" }}
            />
          )}

          {preview?.type === "video" && (
            <video
              src={preview.url}
              controls
              autoPlay
              style={{ width: "100%", maxHeight: "100vh" }}
            />
          )}
        </div>
      </MyModal>
      <Container className="reviews-container mt-3 mb-3">
        <h5 className="mb-4">Đánh giá & Nhận xét</h5>

        <Row className="mb-4 d-flex align-items-center">
          <Col md={3} className="text-center">
            <div className="d-flex align-items-center justify-content-center">
              <h1 className="rating-score mb-0">
                {data?.rating_summary?.average}
              </h1>
              <div className="stars fs-1">★</div>
            </div>
            <p className="text-muted ">
              Dựa trên {data?.rating_summary?.total} đánh giá
            </p>
          </Col>

          <Col md={6}>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="d-flex align-items-center mb-2">
                <span className="me-2">
                  {star} <span className="stars">★</span>
                </span>

                <ProgressBar
                  now={data?.rating_summary?.percent[star]}
                  variant="warning"
                  className="flex-grow-1"
                />

                <span className="ms-2">
                  ({data?.rating_summary?.counts[star]})
                </span>
              </div>
            ))}
          </Col>
        </Row>

        {data?.rating_summary?.total > 0 && (
          <div className="filter-buttons mb-2">
            {filters.map((item, i) => (
              <Button
                key={i}
                variant={activeFilter === item ? "success" : "outline-success"}
                className="me-2 mb-2"
                size="sm"
                onClick={() => setActiveFilter(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        )}
        {data.reviews &&
          data.reviews.length > 0 &&
          sortedReviews.map((item, index) => (
            <div
              className="review-card"
              style={{
                marginBottom: index === data.reviews.length - 1 ? "0" : "10px",
              }}
              key={item.id}
            >
              <div className="d-flex align-items-start justify-content-between">
                <div className="d-flex align-items-center">
                  <Image
                    src={
                      item.user.avatar.startsWith("https://")
                        ? item.user.avatar
                        : `${API_URL}/avatar/${item.user.avatar}`
                    }
                    roundedCircle
                    style={{ width: "45px", height: "45px" }}
                    className="me-2"
                  />
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <strong>{item.user.name}</strong>
                      <Badge bg="primary">
                        <i className="bi bi-check-lg me-1"></i>Đã mua hàng
                      </Badge>
                    </div>
                    <div className="stars">
                      {"★".repeat(item.rating)}
                      {"☆".repeat(5 - item.rating)}
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <span style={{ color: "#777" }}>
                    {formatDateTime(item.created_at)}
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="mt-2">
                    <h5>{item.title}</h5>
                    <p className="mb-0">{item.comment}</p>
                  </div>

                  <div className="review-images d-flex gap-2 mt-2">
                    {item.review_media &&
                      item.review_media.map((media, index) => {
                        const mediaUrl = `${API_URL}/reviews/${media.url}`;

                        if (media.type === "image") {
                          return (
                            <Image
                              key={index}
                              src={mediaUrl}
                              thumbnail
                              width={100}
                              height={100}
                              style={{ cursor: "zoom-in" }}
                              onClick={() =>
                                setPreview({ type: "image", url: mediaUrl })
                              }
                            />
                          );
                        }

                        if (media.type === "video") {
                          return (
                            <video
                              key={index}
                              src={mediaUrl}
                              width={100}
                              height={100}
                              controls
                              style={{ borderRadius: "5px", cursor: "zoom-in" }}
                              onClick={() =>
                                setPreview({ type: "video", url: mediaUrl })
                              }
                            />
                          );
                        }

                        return null;
                      })}
                  </div>
                </div>
                <div style={{ position: "relative" }}>
                  {confirmDeleteId === item.id && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-70px",
                        right: 0,
                        backgroundColor: "#fff3f3",
                        border: "1px solid #ff4d4f",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        zIndex: 10,
                        gap: "10px",
                        width: "225px",
                      }}
                    >
                      <div className="d-block mb-1">
                        Bạn chắc chắn xoá đánh giá?
                      </div>
                      <div className="d-flex gap-2 align-items-center justify-content-end">
                        <Button
                          variant="secondary"
                          onClick={() => setConfirmDeleteId(null)}
                          size="sm"
                        >
                          Huỷ
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            handleDelete(item.id);
                            setConfirmDeleteId(null);
                          }}
                          size="sm"
                        >
                          Xoá
                        </Button>
                      </div>
                    </div>
                  )}

                  {item.user.id === user?.id && (
                    <span
                      className="text-danger"
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => setConfirmDeleteId(item.id)}
                    >
                      Xoá
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        {data.reviews && data.reviews.length === 0 && (
          <div
            className="no-reviews text-center p-4 my-3"
            style={{
              border: "1px dashed #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              color: "#666",
              fontSize: "16px",
            }}
          >
            Chưa có đánh giá{" "}
            {activeFilter === "Tất cả" ? "" : `${activeFilter}`} nào cho sản
            phẩm này
          </div>
        )}
      </Container>
    </>
  );
};

export default ReviewsBooks;
