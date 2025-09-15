import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserAddress,
  getUserWithAddress,
  updateUserAddress,
  resetCreateAddress,
  resetUpdateAddress,
} from "../../redux/slices/userSlice";
import { Spinner } from "react-bootstrap";

const AddLocation = ({ show, handleClose, user, itemUpAddress }) => {
  const dispatch = useDispatch();
  const { loading, success } = useSelector((state) => state.user.createAddress);

  const { loading: loadingUp, success: successUp } = useSelector(
    (state) => state.user.updateAddress
  );

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    // province: "",
    // district: "",
    // ward: "",
    address: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      if (itemUpAddress) {
        setFormData({
          fullname: itemUpAddress.fullname || user.fullname || "",
          phone: itemUpAddress.phone ?? user.phone ?? "",
          address: itemUpAddress.address || "",
          isDefault: itemUpAddress.is_default === 1,
        });
      } else {
        setFormData({
          fullname: user.fullname || "",
          phone: user.phone || "",
          address: "",
          isDefault: false,
        });
      }
      setErrors({});
    }
  }, [show, itemUpAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const updatedValue = type === "checkbox" ? checked : value;

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullname || !formData.fullname.trim())
      newErrors.fullname = "Họ tên không được bỏ trống";

    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được bỏ trống";
    } else if (!/^0\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.address || !formData.address.trim())
      newErrors.address = "Địa chỉ không được bỏ trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (Object.keys(itemUpAddress).length > 0) {
        dispatch(
          updateUserAddress({
            id: itemUpAddress.id,
            fullname: formData.fullname,
            phone: formData.phone,
            address: formData.address,
            isDefault: formData.isDefault,
          })
        );
      } else {
        dispatch(createUserAddress(formData));
      }
    }
  };

  useEffect(() => {
    if (success && show) {
      dispatch(getUserWithAddress());
      dispatch(resetCreateAddress());
      handleClose();
      setFormData({
        fullname: "",
        phone: "",
        address: "",
        isDefault: false,
      });
    }
    if (successUp && show) {
      dispatch(getUserWithAddress());
      dispatch(resetUpdateAddress());
      handleClose();
      setFormData({
        fullname: "",
        phone: "",
        address: "",
        isDefault: false,
      });
    }
  }, [success, successUp, show, handleClose]);

  const handleCancel = () => {
    // setErrors({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {itemUpAddress && Object.keys(itemUpAddress).length > 0
            ? "Cập nhật địa chỉ"
            : "Thêm địa chỉ mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              isInvalid={!!errors.fullname}
              placeholder="Nhập họ tên"
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullname}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              isInvalid={!!errors.phone}
              placeholder="Nhập số điện thoại"
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>

          {/* <Row className="mb-3">
            <Col>
              <Form.Label>Tỉnh thành</Form.Label>
              <Form.Select
                name="province"
                value={formData.province}
                onChange={handleChange}
                isInvalid={!!errors.province}
              >
                <option value="">--</option>
                <option value="HCM">Hồ Chí Minh</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.province}
              </Form.Control.Feedback>
            </Col>
            <Col>
              <Form.Label>Quận huyện</Form.Label>
              <Form.Select
                name="district"
                value={formData.district}
                onChange={handleChange}
                isInvalid={!!errors.district}
              >
                <option value="">--</option>
                <option value="1">Quận 1</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.district}
              </Form.Control.Feedback>
            </Col>
            <Col>
              <Form.Label>Phường xã</Form.Label>
              <Form.Select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                isInvalid={!!errors.ward}
              >
                <option value="">--</option>
                <option value="Bến Nghé">Bến Nghé</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.ward}
              </Form.Control.Feedback>
            </Col>
          </Row> */}

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              isInvalid={!!errors.address}
              placeholder="Số nhà, tên đường..."
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              label="Đặt là địa chỉ mặc định?"
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" className="me-2" onClick={handleCancel}>
              Hủy
            </Button>
            <Button variant="success" onClick={handleSubmit} disabled={loading}>
              {loading || loadingUp ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Đang xử lý
                </>
              ) : itemUpAddress && Object.keys(itemUpAddress).length > 0 ? (
                "Cập nhật địa chỉ"
              ) : (
                "Thêm địa chỉ"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddLocation;
