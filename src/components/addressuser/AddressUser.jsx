import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Badge, Spinner } from "react-bootstrap";
import { getUserWithAddress } from "../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

const AddressUser = ({
  onClose,
  onConfirm,
  onClickAdd,
  onClickUp,
  itemAddress,
}) => {
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState();

  const { addresses, user } = useSelector((state) => state.user.profile);

  useEffect(() => {
    dispatch(getUserWithAddress());
  }, [dispatch]);

  useEffect(() => {
    if (itemAddress) {
      setSelectedItem(itemAddress);
    }
  }, [itemAddress]);

  useEffect(() => {
    if (!addresses?.length) return;

    setSelectedItem((prev) => {
      if (prev) return prev; // ❗ đã có rồi thì giữ nguyên

      const defaultAddr =
        addresses.find((a) => Number(a.is_default) === 1) || addresses[0];

      return defaultAddr;
    });
  }, [addresses]);

  const handleConfirm = () => {
    onConfirm(selectedItem);
  };

  return (
    <Modal show onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Địa chỉ của tôi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {addresses && addresses.length > 0 ? (
          <Form>
            {addresses.map((addr, index) => (
              <div
                key={addr.id}
                className={`border rounded p-2 ${
                  index + 1 === addresses.length ? "mb-0" : "mb-3"
                } d-flex justify-content-between align-items-start ${
                  selectedItem && selectedItem.id === addr.id
                    ? "border-success"
                    : ""
                }`}
                style={{
                  backgroundColor:
                    selectedItem && selectedItem.id === addr.id
                      ? "#f9fff9"
                      : "#fff",
                }}
              >
                <Form.Check
                  type="radio"
                  name="selectedAddress"
                  id={`address-${addr.id}`}
                  checked={selectedItem && selectedItem.id === addr.id}
                  onChange={() => setSelectedItem(addr)}
                />
                <div className="ms-3 flex-grow-1">
                  <strong>{addr.fullname || "Không rõ tên"}</strong>{" "}
                  {addr.is_default === 1 && (
                    <Badge bg="light" text="success" className="ms-2">
                      <i className="bi bi-check-circle-fill text-success me-1"></i>
                      Địa chỉ mặc định
                    </Badge>
                  )}
                  <p className="mb-1">Địa chỉ: {addr.address}</p>
                  <p className="mb-1">Điện thoại: {addr.phone}</p>
                </div>
                <div style={{ width: "90px", textAlign: "right" }}>
                  <Button
                    variant="link"
                    className="text-primary p-0"
                    onClick={() => onClickUp(addr)}
                  >
                    Cập nhật
                  </Button>
                </div>
              </div>
            ))}
          </Form>
        ) : (
          <div
            className="text-center text-muted"
            style={{ userSelect: "none" }}
          >
            <i className="bi bi-geo-alt-fill me-2"></i>
            Chưa có địa chỉ nào
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button variant="danger" onClick={onClickAdd} size="sm">
          + Thêm địa chỉ mới
        </Button>

        <div>
          <Button variant="secondary" onClick={onClose} size="sm">
            Đóng
          </Button>
          <Button
            variant="success"
            onClick={handleConfirm}
            className="ms-2"
            style={{ minWidth: "63px" }}
            size="sm"
          >
            Chọn
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AddressUser;
