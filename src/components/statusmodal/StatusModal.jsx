import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const StatusModal = ({ show, onClose, onSubmit, order }) => {
  const orderStatuses = [
    "pending",
    "confirmed",
    "shipping",
    "delivered",
    "cancelled",
    "returned",
  ];

  const currentIndex = orderStatuses.indexOf(order?.status);
  const nextStatus =
    currentIndex >= 0 && currentIndex < orderStatuses.length - 1
      ? orderStatuses[currentIndex + 1]
      : null;

  const getLabel = (key) => {
    switch (key) {
      case "pending":
        return "Đang chờ xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "shipping":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã huỷ";
      case "returned":
        return "Đã trả hàng";
      default:
        return key;
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật trạng thái đơn hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {order && (
          <div className="mb-3">
            <p>
              <strong>Mã đơn hàng:</strong> {order.order_code}
            </p>
            <p>
              <strong>Khách hàng:</strong> {order.fullname}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong>{" "}
              {order.payment_method === "cod"
                ? "Thanh toán bằng tiền mặt"
                : "Thanh toán qua VNPay"}
            </p>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              {Number(order.total_price).toLocaleString("vi-VN")}₫
            </p>
            <hr />
          </div>
        )}

        <Form.Label className="fw-bold" style={{ color: "#E35765" }}>
          Trạng thái đơn hàng
        </Form.Label>
        <div className="d-flex gap-3">
          <Form.Group style={{ flex: 1 }}>
            <Form.Label className="fw-semibold">Hiện tại</Form.Label>
            <Form.Control
              value={getLabel(order?.status)}
              readOnly
              plaintext
              style={{ backgroundColor: "#f8f9fa" }}
            />
          </Form.Group>

          <Form.Group style={{ flex: 1 }}>
            <Form.Label className="fw-semibold">Chuyển sang</Form.Label>
            <Form.Select
              //   value={status}
              //   onChange={(e) => setStatus(e.target.value)}
              disabled={!nextStatus}
            >
              {nextStatus ? (
                <option value={nextStatus}>{getLabel(nextStatus)}</option>
              ) : (
                <option disabled>Không thể cập nhật thêm</option>
              )}
            </Form.Select>
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={() => onSubmit(nextStatus)}>
          Cập nhật
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusModal;
