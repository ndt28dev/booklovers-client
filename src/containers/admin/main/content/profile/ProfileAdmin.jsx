import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Form, Image, Spinner } from "react-bootstrap";
import MyModal from "../../../../../components/mymodal/MyModal";
import ButtonCustom from "../../../../../components/button/ButtonCustom";
import API_URL from "../../../../../config/api";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminUserProfile,
  resetUpdateAdminProfileStatus,
  updateAdminProfile,
} from "../../../../../redux/slices/userSlice";
import { toast } from "react-toastify";

const dayOptions = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`,
}));
const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`,
}));
const yearOptions = Array.from({ length: 2015 - 1960 + 1 }, (_, i) => ({
  value: 1960 + i,
  label: `${1960 + i}`,
}));

const ProfileAdmin = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.profileAdmin);
  const { loading, success, error } = useSelector(
    (state) => state.user.updateAdminProfile
  );

  const [formData, setFormData] = useState({
    fullName: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    avatar: "",
    avatarFile: null,
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getAdminUserProfile());
  }, []);

  useEffect(() => {
    if (user) {
      const birthdayDate = user.birthday ? new Date(user.birthday) : null;

      setFormData({
        fullName: user.fullname || "",
        day: birthdayDate ? birthdayDate.getDate() : "",
        month: birthdayDate ? birthdayDate.getMonth() + 1 : "",
        year: birthdayDate ? birthdayDate.getFullYear() : "",
        gender: user.gender || "",
        avatar: user.avatar || "",
        avatarFile: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Xử lý avatar
    if (name === "avatar" && files?.[0]) {
      setFormData((prev) => ({
        ...prev,
        avatarFile: files[0],
        avatar: URL.createObjectURL(files[0]),
      }));
      setErrors((prev) => ({ ...prev, avatar: null }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: null }));
    if (["day", "month", "year"].includes(name)) {
      setErrors((prev) => ({ ...prev, birthday: null }));
    }
  };

  const handleFileChange = (e) => {
    handleChange(e);
  };

  const validateFormData = () => {
    const { fullName, day, month, year, gender } = formData;
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Họ tên không được để trống";
    }

    if (!day || !month || !year) {
      newErrors.birthday = "Vui lòng chọn đầy đủ ngày, tháng, năm sinh";
    } else {
      const isValidDate = (y, m, d) => {
        const date = new Date(`${y}-${m}-${d}`);
        return (
          date &&
          date.getFullYear() === parseInt(y) &&
          date.getMonth() + 1 === parseInt(m) &&
          date.getDate() === parseInt(d)
        );
      };

      if (!isValidDate(year, month, day)) {
        newErrors.birthday = "Ngày sinh không hợp lệ";
      }
    }

    if (!gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateFormData()) return;

    const { day, month, year, ...rest } = formData;
    const birthday = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    const dataUp = new FormData();
    dataUp.append("fullname", formData.fullName);
    dataUp.append("gender", formData.gender);
    dataUp.append("birthday", birthday);

    if (formData.avatarFile) {
      dataUp.append("avatar", formData.avatarFile);
    }

    dispatch(updateAdminProfile(dataUp));
  };

  useEffect(() => {
    if (success) {
      toast.success("Cập nhật thông tin thành công!");
      dispatch(resetUpdateAdminProfileStatus());
      dispatch(getAdminUserProfile());
    }

    if (error) {
      toast.error(error || "Đã xảy ra lỗi khi cập nhật!");
    }
  }, [success, error, dispatch]);

  return (
    <MyModal
      show={isOpen}
      title="Thông tin cá nhân"
      handleClose={onClose}
      size="lg"
    >
      <Card style={{ border: "none" }} className="pe-3">
        <Card.Body style={{ padding: "8px 0" }}>
          <Row className="align-items-start">
            <Col md={3} className="text-center position-relative">
              <Image
                src={
                  formData.avatarFile
                    ? formData.avatar
                    : user?.avatar?.startsWith("https://")
                    ? user.avatar
                    : `${API_URL}/avatar/${user?.avatar}`
                }
                roundedCircle
                style={{
                  width: "150px",
                  height: "150px",
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
                name="avatar"
              />

              <button
                className="position-absolute"
                style={{
                  bottom: "0px",
                  right: "45px",
                  border: "1px solid #ccc",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  backgroundColor: "#fff",
                  padding: 0,
                  cursor: "pointer",
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <i className="bi bi-pencil-fill" style={{ fontSize: "12px" }} />
              </button>
            </Col>

            <Col md={9}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    value={formData.fullName}
                    onChange={handleChange}
                    name="fullName"
                    type="text"
                    placeholder="Nhập họ tên"
                    isInvalid={!!errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Row>
                    <Col>
                      <Select
                        options={dayOptions}
                        value={dayOptions.find(
                          (opt) => opt.value === formData.day
                        )}
                        onChange={(selected) => {
                          setFormData((prev) => ({
                            ...prev,
                            day: selected?.value || "",
                          }));
                          setErrors((prev) => ({ ...prev, birthday: null })); // Xóa lỗi ngay lập tức
                        }}
                        placeholder="Ngày"
                      />
                    </Col>
                    <Col>
                      <Select
                        options={monthOptions}
                        value={monthOptions.find(
                          (opt) => opt.value === formData.month
                        )}
                        onChange={(selected) => {
                          setFormData((prev) => ({
                            ...prev,
                            month: selected?.value || "",
                          }));
                          setErrors((prev) => ({ ...prev, birthday: null }));
                        }}
                        placeholder="Tháng"
                      />
                    </Col>
                    <Col>
                      <Select
                        options={yearOptions}
                        value={yearOptions.find(
                          (opt) => opt.value === formData.year
                        )}
                        onChange={(selected) => {
                          setFormData((prev) => ({
                            ...prev,
                            year: selected?.value || "",
                          }));
                          setErrors((prev) => ({ ...prev, birthday: null }));
                        }}
                        placeholder="Năm"
                      />
                    </Col>
                    {errors.birthday && (
                      <Col xs={12}>
                        <div className="text-danger mt-1">
                          {errors.birthday}
                        </div>
                      </Col>
                    )}
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Giới tính</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Nam"
                      name="gender"
                      type="radio"
                      value="MALE"
                      checked={formData.gender === "MALE"}
                      onChange={(e) => {
                        handleChange(e);
                        setErrors((prev) => ({ ...prev, gender: null })); // Xóa lỗi
                      }}
                    />
                    <Form.Check
                      inline
                      label="Nữ"
                      name="gender"
                      type="radio"
                      value="FEMALE"
                      checked={formData.gender === "FEMALE"}
                      onChange={(e) => {
                        handleChange(e);
                        setErrors((prev) => ({ ...prev, gender: null })); // Xóa lỗi
                      }}
                    />
                  </div>
                  {errors.gender && (
                    <div className="text-danger mt-1">{errors.gender}</div>
                  )}
                </Form.Group>

                <ButtonCustom
                  text={
                    loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        <span>Đang xử lý</span>
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )
                  }
                  icon="bi bi-save me-2"
                  bgrColor="#E35765"
                  onClick={handleSubmit}
                />
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </MyModal>
  );
};

export default ProfileAdmin;
