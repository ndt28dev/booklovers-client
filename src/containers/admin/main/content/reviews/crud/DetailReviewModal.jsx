import MyModal from "../../../../../../components/mymodal/MyModal";
import { Badge, Row, Col, Image } from "react-bootstrap";
import API_URL from "../../../../../../config/api";

const DetailReviewModal = ({ isOpen, onClose, dataSelected }) => {
  if (!dataSelected) return null;

  const {
    user_name,
    book_name,
    rating,
    title,
    comment,
    status,
    created_at,
    media,
  } = dataSelected;

  return (
    <MyModal
      show={isOpen}
      handleClose={onClose}
      title="Chi tiết đánh giá"
      size="lg"
    >
      <div>
        <div
          style={{
            background: "#fff1f3",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "5px",
          }}
        >
          <Row className="mb-2">
            <Col md={7} className="d-flex align-items-center gap-1">
              <strong>Sản phẩm:</strong>
              <span style={{ fontSize: "16px" }}>{book_name}</span>
            </Col>
            <Col md={5} className="d-flex align-items-center gap-1">
              <strong>Trạng thái:</strong>
              {status === "visible" && <Badge bg="success">Hiển thị</Badge>}
              {status === "hidden" && <Badge bg="warning">Ẩn</Badge>}
            </Col>
          </Row>
          <Row>
            <Col md={7} className="d-flex align-items-center gap-1">
              <strong>Người đánh giá:</strong>
              <span style={{ fontSize: "16px" }}>{user_name}</span>
            </Col>
            <Col md={5} className="d-flex align-items-center gap-1">
              <strong>Ngày tạo:</strong>
              <span style={{ fontSize: "16px" }}>{created_at}</span>
            </Col>
          </Row>
        </div>

        <div
          style={{ marginBottom: "15px" }}
          className="d-flex align-items-center gap-1"
        >
          <strong>Đánh giá:</strong>
          <div style={{ fontSize: "1.5rem", color: "#FFD700" }}>
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </div>
        </div>

        <div
          style={{
            padding: "0 15px",
            borderRadius: "8px",
            marginBottom: "15px",
            overflow: "hidden",
          }}
        >
          <Row className="p-2" style={{ background: "#f1f1f1" }}>
            <Col md={2}>
              <strong>Tiêu đề:</strong>
            </Col>
            <Col md={10}>
              <strong>{title}</strong>
            </Col>
          </Row>
          <Row className="p-2" style={{ background: "#f8f8f8" }}>
            <Col md={2}>
              <strong>Nội dung:</strong>
            </Col>
            <Col md={10}>
              <span style={{ fontSize: "16px" }}>{comment}</span>
            </Col>
          </Row>
        </div>

        {media && media.length > 0 && (
          <div>
            <strong>Media:</strong>
            <Row className="mt-2">
              {media.map((m) => (
                <Col key={m.id} xs={6} md={4} lg={3}>
                  {m.type === "image" && (
                    <Image
                      src={`${API_URL}/reviews/${m.url}`}
                      alt={m.url}
                      thumbnail
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        transition: "transform 0.3s",
                      }}
                    />
                  )}
                  {m.type === "video" && (
                    <video
                      controls
                      src={`${API_URL}/reviews/${m.url}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </MyModal>
  );
};

export default DetailReviewModal;
