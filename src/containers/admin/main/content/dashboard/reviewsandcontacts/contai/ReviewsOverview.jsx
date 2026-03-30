import { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewStats } from "../../../../../../../redux/slices/admin/ReviewsContactsSlice";

const ReviewsOverview = () => {
  const dispatch = useDispatch();

  const { data } = useSelector(
    (state) => state.adminReviewsContacts.reviewStats
  );

  useEffect(() => {
    dispatch(fetchReviewStats());
  }, [dispatch]);

  const cards = [
    {
      label: "Tổng đánh giá",
      value: data?.total_reviews,
      bg: "linear-gradient(135deg, #4f46e5, #3b82f6)",
      icon: "bi bi-chat-dots",
    },
    {
      label: "Điểm trung bình",
      value: Number(data?.avg_rating || 0).toFixed(1),
      bg: "linear-gradient(135deg, #f59e0b, #eab308)",
      icon: "bi bi-star-fill",
    },
    {
      label: "4 - 5 sao",
      value: Number(data?.star_5 || 0) + Number(data?.star_4 || 0),
      bg: "linear-gradient(135deg, #22c55e, #16a34a)",
      icon: "bi bi-star-fill",
    },
    {
      label: "1 - 2 - 3 sao",
      value:
        Number(data?.star_1 || 0) +
        Number(data?.star_2 || 0) +
        Number(data?.star_3 || 0),
      bg: "linear-gradient(135deg, #ef4444, #f97316)",
      icon: "bi bi-exclamation-triangle",
    },
  ];

  return (
    <Card
      className="mb-3"
      style={{
        border: "none",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
      <Card.Body>
        <h6 className="mb-3 fw-bold" style={{ color: "#E35765" }}>
          Thống kê đánh giá
        </h6>
        <Row>
          {cards.map((item, idx) => (
            <Col md={3} key={idx}>
              <Card
                style={{
                  background: item.bg,
                  color: "white",
                  border: "none",
                }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold">{item.label}</h6>
                      <span style={{ fontSize: "20px" }} className="fw-bold">
                        {item.value}
                      </span>
                    </div>

                    <i
                      className={item.icon}
                      style={{ fontSize: "28px", opacity: 0.9 }}
                    ></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ReviewsOverview;
