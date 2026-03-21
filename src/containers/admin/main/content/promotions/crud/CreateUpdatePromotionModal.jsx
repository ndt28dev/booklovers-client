import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import MyModal from "../../../../../../components/mymodal/MyModal";
import {
  createPromotion,
  fetchAllPromotion,
  resetCreatePromotion,
  resetUpdatePromotion,
  updatePromotion,
} from "../../../../../../redux/slices/promotionSlice";
import { toast } from "react-toastify";
import Select from "react-select";

const discountTypeOptions = [
  { value: "percent", label: "Phần trăm (%)" },
  { value: "fixed", label: "Số tiền" },
];

const CreateUpdatePromotionModal = ({
  isOpen,
  onClose,
  title,
  isCheck = false,
  dataSelected,
  currentPage,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: null,
    code: "",
    description: "",
    discount_type: "percent",
    discount_value: "",
    usage_limit: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  const { isLoading, error, success } = useSelector(
    (state) => state.promotion.create
  );

  const {
    isLoading: isLoadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.promotion.update);

  const validatePromotion = (data) => {
    const errors = {};

    if (!data.code || data.code.trim() === "") {
      errors.code = "Vui lòng nhập mã khuyến mãi";
    }

    if (!data.discount_value || data.discount_value <= 0) {
      errors.discount_value = "Giá trị giảm phải lớn hơn 0";
    }

    if (data.discount_type === "percent" && data.discount_value > 100) {
      errors.discount_value = "Phần trăm giảm không được lớn hơn 100%";
    }

    if (data.usage_limit && data.usage_limit < 0) {
      errors.usage_limit = "Số lượt dùng không hợp lệ";
    }

    if (!data.start_date) {
      errors.start_date = "Vui lòng chọn ngày bắt đầu";
    }

    if (!data.end_date) {
      errors.end_date = "Vui lòng chọn ngày kết thúc";
    }

    if (data.start_date && data.end_date) {
      if (new Date(data.start_date) >= new Date(data.end_date)) {
        errors.end_date = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
      }
    }

    return errors;
  };

  useEffect(() => {
    if (isCheck && dataSelected) {
      setFormData({
        id: dataSelected.id || null,
        code: dataSelected.code || "",
        description: dataSelected.description || "",
        discount_type: dataSelected.discount_type || "percent",
        discount_value: dataSelected.discount_value || "",
        usage_limit: dataSelected.usage_limit || "",
        start_date: dataSelected.start_date?.slice(0, 16) || "",
        end_date: dataSelected.end_date?.slice(0, 16) || "",
        is_active: dataSelected.is_active === 1,
      });
    }
  }, [dataSelected, isCheck]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validatePromotion(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = {
      code: formData.code,
      description: formData.description,
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      usage_limit: formData.usage_limit,
      start_date: formData.start_date,
      end_date: formData.end_date,
      is_active: formData.is_active ? 1 : 0,
    };

    if (isCheck) {
      data.id = dataSelected.id;
      dispatch(updatePromotion(data));
    } else {
      dispatch(createPromotion(data));
    }
  };

  useEffect(() => {
    if (success) {
      toast.success("Thêm khuyến mãi thành công!");
      dispatch(resetCreatePromotion());
      dispatch(fetchAllPromotion({ page: currentPage, limit: 10 }));
      onClose();
    } else if (error) {
      toast.error(error?.message || error);
    }
  }, [error, success]);

  useEffect(() => {
    if (successUpdate) {
      toast.success("Cập nhật khuyến mãi thành công!");
      dispatch(resetUpdatePromotion());
      dispatch(fetchAllPromotion({ page: currentPage, limit: 10 }));
      onClose();
    } else if (errorUpdate) {
      toast.error(errorUpdate?.message || errorUpdate);
    }
  }, [errorUpdate, successUpdate]);

  return (
    <MyModal show={isOpen} handleClose={onClose} title={title} size="md">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label className="mb-0">Mã khuyến mãi</Form.Label>
          <Form.Control
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            isInvalid={!!errors.code}
          />
          <Form.Control.Feedback type="invalid">
            {errors.code}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label className="mb-0">Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Loại giảm</Form.Label>
              <Select
                name="discount_type"
                value={discountTypeOptions.find(
                  (option) => option.value === formData.discount_type
                )}
                onChange={(selectedOption) => {
                  handleChange({
                    target: {
                      name: "discount_type",
                      value: selectedOption.value,
                    },
                  });
                }}
                options={discountTypeOptions}
                isClearable={false}
                styles={{
                  control: (provided) => ({ ...provided, minHeight: 38 }),
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Giá trị giảm</Form.Label>
              <Form.Control
                type="number"
                name="discount_value"
                value={formData.discount_value}
                onChange={handleChange}
                isInvalid={!!errors.discount_value}
              />
              <Form.Control.Feedback type="invalid">
                {errors.discount_value}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Ngày bắt đầu</Form.Label>
              <Form.Control
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                isInvalid={!!errors.start_date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.start_date}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Ngày kết thúc</Form.Label>
              <Form.Control
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                isInvalid={!!errors.end_date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.end_date}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="mb-0">Số lượt dùng</Form.Label>
              <Form.Control
                type="number"
                name="usage_limit"
                value={formData.usage_limit}
                onChange={handleChange}
                isInvalid={!!errors.usage_limit}
              />
              <Form.Control.Feedback type="invalid">
                {errors.usage_limit}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6} className="d-flex">
            <Form.Group>
              <Form.Label className="mb-0">Trạng thái</Form.Label>
              <Form.Check
                type="checkbox"
                label="Đang hoạt động"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-2 ">
          <Button variant="secondary" onClick={onClose} size="sm">
            Hủy
          </Button>
          <Button type="submit" variant="success" size="sm">
            Lưu
          </Button>
        </div>
      </Form>
    </MyModal>
  );
};

export default CreateUpdatePromotionModal;
