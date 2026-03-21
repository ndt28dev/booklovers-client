import { Form, Button, Row, Col, Image, Spinner } from "react-bootstrap";
import MyModal from "../../../../../../components/mymodal/MyModal";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewUser,
  fetchAllUser,
  resetCreateUserStatus,
  resetUpdateUserStatus,
  updateUser,
} from "../../../../../../redux/slices/userSlice";
import { toast } from "react-toastify";
import API_URL from "../../../../../../config/api";
import Select from "react-select";

const genderOptions = [
  { value: "", label: "Chọn giới tính" },
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
];

const roleOptions = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

const CreateUpdateUserModal = ({
  isOpen,
  onClose,
  title,
  isCheck = false,
  dataSelected,
  currentPage,
}) => {
  const dispatch = useDispatch();

  const { isLoading, error, success } = useSelector(
    (state) => state.user.createUser
  );

  const {
    isLoading: isLoadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.user.updateUser);

  const [form, setForm] = useState({
    id: "",
    fullname: "",
    email: "",
    role: "user",
    avatarFile: null,
    avatarPreview: `${API_URL}/avatar/default.jpg`,
    birthday: "",
    gender: "",
    phone: "",
    password: "123456",
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const preview = URL.createObjectURL(file);

      setForm({
        ...form,
        avatarFile: file,
        avatarPreview: preview,
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullname.trim())
      newErrors.fullname = "Họ và tên không được để trống";

    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập Email";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "SĐT không được để trống";
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(form.phone)) {
      newErrors.phone = "SĐT không đúng định dạng";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const formData = new FormData();

    formData.append("fullname", form.fullname);
    formData.append("email", form.email);
    formData.append("role", form.role);
    formData.append("birthday", form.birthday);
    formData.append("gender", form.gender);
    formData.append("phone", form.phone);
    formData.append("password", form.password);

    if (form.avatarFile) {
      formData.append("avatar", form.avatarFile);
    }

    if (isCheck) {
      formData.append("id", form.id);
      dispatch(updateUser(formData));
    } else {
      dispatch(createNewUser(formData));
    }
  };

  useEffect(() => {
    if (isCheck && dataSelected) {
      setForm({
        id: dataSelected?.id || "",
        fullname: dataSelected?.fullname || "",
        email: dataSelected?.email || "",
        role: dataSelected?.role || "user",
        avatarFile: null,
        avatarPreview: dataSelected?.avatar
          ? `${API_URL}/avatar/${dataSelected.avatar}`
          : `${API_URL}/avatar/default.jpg`,
        birthday: dataSelected?.birthday
          ? new Date(dataSelected.birthday).toISOString().split("T")[0]
          : "",
        gender: dataSelected?.gender || "",
        phone: dataSelected?.phone || "",
        password: "",
      });
    }
  }, [isCheck, dataSelected]);

  useEffect(() => {
    if (success) {
      toast.success("Thêm người dùng thành công!");
      dispatch(resetCreateUserStatus());
      dispatch(fetchAllUser({ page: currentPage, limit: 10 }));
      onClose();
    } else if (error) {
      toast.error(error?.message || error);
    }
  }, [error, success]);

  useEffect(() => {
    if (successUpdate) {
      toast.success("Cập nhật người dùng thành công!");
      dispatch(resetUpdateUserStatus());
      dispatch(fetchAllUser({ page: currentPage, limit: 10 }));
      onClose();
    } else if (errorUpdate) {
      toast.error(errorUpdate?.message || errorUpdate);
    }
  }, [errorUpdate, successUpdate]);

  return (
    <MyModal show={isOpen} handleClose={onClose} title={title} size="lg">
      <Form>
        <Row className="align-items-center">
          <Col md={8}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Họ và tên</Form.Label>
              <Form.Control
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                isInvalid={!!errors.fullname}
              />
              {errors.fullname && (
                <small className="text-danger">{errors.fullname}</small>
              )}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Email</Form.Label>
              <Form.Control
                name="email"
                value={form.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="mb-0">SĐT</Form.Label>
              <Form.Control
                name="phone"
                value={form.phone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
              />
              {errors.phone && (
                <small className="text-danger">{errors.phone}</small>
              )}
            </Form.Group>
          </Col>

          <Col md={4} className="text-center position-relative">
            <Image
              src={form.avatarPreview || `${API_URL}/avatar/default.jpg`}
              roundedCircle
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                border: "3px solid #cce5ff",
                padding: "5px",
              }}
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <Button
              variant="light"
              size="sm"
              className="position-absolute"
              style={{
                bottom: "0px",
                right: "55px",
                border: "1px solid #ccc",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                padding: 0,
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <i className="bi bi-pencil-fill" style={{ fontSize: "16px" }}></i>
            </Button>
          </Col>
        </Row>

        <Row className="mt-2">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="mb-0">Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                value={form.birthday}
                size="md"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="mb-0">Giới tính</Form.Label>
              <Select
                value={genderOptions.find(
                  (option) => option.value === form.gender
                )}
                onChange={(selectedOption) =>
                  handleChange({
                    target: { name: "gender", value: selectedOption.value },
                  })
                }
                options={genderOptions}
                isClearable={false}
                styles={{
                  control: (provided) => ({ ...provided, minHeight: 38 }),
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="mb-0">Quyền</Form.Label>
              <Select
                value={roleOptions.find((option) => option.value === form.role)}
                onChange={(selectedOption) =>
                  handleChange({
                    target: { name: "role", value: selectedOption.value },
                  })
                }
                options={roleOptions}
                isClearable={false}
                styles={{
                  control: (provided) => ({ ...provided, minHeight: 38 }),
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="d-flex align-items-end justify-content-end mt-3">
          <Col md={3} className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose} size="sm">
              Huỷ
            </Button>
            <Button variant="success" onClick={handleSubmit} size="sm">
              {isLoading || isLoadingUpdate ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                </>
              ) : (
                "Lưu"
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </MyModal>
  );
};

export default CreateUpdateUserModal;
