import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MyModal from "../../../../../../../../components/mymodal/MyModal";
import { toast } from "react-toastify";
import {
  createSupplier,
  fetchSuppliers,
  resetCreateSupplier,
  resetUpdateSupplier,
  updateSupplier,
} from "../../../../../../../../redux/slices/supplierSlice";

const CreateUpdateSupplier = ({
  isOpen,
  onClose,
  title,
  isCheck = false,
  dataSelected,
  currentPage,
}) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const { loading, success, error } = useSelector(
    (state) => state.supplier.createSupplier
  );

  const {
    loading: isLoadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.supplier.updateSupplier);

  useEffect(() => {
    if (isCheck && dataSelected) {
      setForm({
        name: dataSelected.name || "",
        email: dataSelected.email || "",
        phone: dataSelected.phone || "",
        address: dataSelected.address || "",
      });
    }
  }, [dataSelected, isCheck]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validatePhone = (phone) => {
    const normalized = normalizePhone(phone);

    const regex = /^(03|05|07|08|09)\d{8}$/;

    return regex.test(normalized);
  };

  const normalizePhone = (phone) => {
    let p = phone.replace(/\s+/g, "");

    if (p.startsWith("+84")) {
      p = "0" + p.slice(3);
    }

    return p;
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Vui lòng nhập tên nhà cung cấp";
    if (!form.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!form.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone =
        "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)";
    } else {
      // nếu hợp lệ thì lưu dạng chuẩn luôn
      form.phone = normalizePhone(form.phone);
    }

    if (!form.address) newErrors.address = "Vui lòng nhập địa chỉ";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (isCheck) {
      dispatch(updateSupplier({ id: dataSelected.id, data: form }));
    } else {
      dispatch(createSupplier(form));
    }
  };

  useEffect(() => {
    if (success) {
      toast.success("Thêm nhà cung cấp thành công!");
      dispatch(resetCreateSupplier());
      dispatch(fetchSuppliers({ page: currentPage, limit: 10 }));
      onClose();
    } else if (error) {
      toast.error(error?.message || error);
    }
  }, [error, success]);

  useEffect(() => {
    if (successUpdate) {
      toast.success("Cập nhật nhà cung cấp thành công!");
      dispatch(resetUpdateSupplier());
      dispatch(fetchSuppliers({ page: currentPage, limit: 10 }));
      onClose();
    } else if (errorUpdate) {
      toast.error(errorUpdate?.message || errorUpdate);
    }
  }, [errorUpdate, successUpdate]);

  return (
    <MyModal show={isOpen} handleClose={onClose} title={title} size="lg">
      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Tên nhà cung cấp</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <div className="text-end  mt-2">
        <Button
          className="btn btn-secondary me-2"
          size="sm"
          onClick={() => {
            onClose();
          }}
        >
          Huỷ
        </Button>
        <Button
          className="btn btn-success "
          onClick={handleSubmit}
          disabled={loading}
          size="sm"
        >
          Lưu
        </Button>
      </div>
    </MyModal>
  );
};
export default CreateUpdateSupplier;
