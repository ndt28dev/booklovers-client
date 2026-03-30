import { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedbackStats } from "../../../../../../../redux/slices/admin/ReviewsContactsSlice";

const ContactsOverview = () => {
  const dispatch = useDispatch();

  const { data } = useSelector(
    (state) => state.adminReviewsContacts.reviewOverview
  );

  useEffect(() => {
    dispatch(fetchFeedbackStats());
  }, [dispatch]);

  const cards = [
    {
      label: "Tổng phản hồi",
      value: data?.total,
      bg: "linear-gradient(135deg, #4f46e5, #3b82f6)",
      icon: "bi bi-chat-dots",
    },
    {
      label: "Chưa xử lý",
      value: data?.pending,
      bg: "linear-gradient(135deg, #ef4444, #f97316)",
      icon: "bi bi-clock",
    },
    {
      label: "Đang xử lý",
      value: data?.in_progress,
      bg: "linear-gradient(135deg, #f59e0b, #eab308)",
      icon: "bi bi-arrow-repeat",
    },
    {
      label: "Đã xử lý",
      value: data?.resolved,
      bg: "linear-gradient(135deg, #22c55e, #16a34a)",
      icon: "bi bi-check-circle",
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
          Thống kê phản hồi
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
                      style={{
                        fontSize: "28px",
                        opacity: 0.9,
                      }}
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
export default ContactsOverview;
