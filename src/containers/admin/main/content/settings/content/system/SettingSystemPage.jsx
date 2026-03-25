import React, { useEffect, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUpdateSuccess,
  fetchSystemSettings,
  updateSystemSettings,
} from "../../../../../../../redux/slices/admin/systemSlice";
import API_URL from "../../../../../../../config/api";
import { toast } from "react-toastify";

const SettingSystemPage = () => {
  const dispatch = useDispatch();

  const { settings, loading, error, updateSuccess } = useSelector(
    (state) => state.system
  );

  const [form, setForm] = useState({
    logo: null,
    hotline: "",
    email: "",
    address: "",
    zalo: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    google_map_link: "",
  });

  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    dispatch(fetchSystemSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setForm({
        ...settings,
        logo: settings.logo ? `${API_URL}/logo/${settings.logo}` : "",
      });
    }
  }, [settings]);

  console.log(settings);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // preview tạm thời
      setForm({ ...form, logo: URL.createObjectURL(file) });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("logo", logoFile);
      data.append("hotline", form.hotline);
      data.append("email", form.email);
      data.append("address", form.address);
      data.append("zalo", form.zalo);
      data.append("facebook", form.facebook);
      data.append("instagram", form.instagram);
      data.append("tiktok", form.tiktok);
      data.append("youtube", form.youtube);
      data.append("google_map_link", form.google_map_link);
      await dispatch(updateSystemSettings(data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setForm({
      ...form,
      logo: settings.logo ? `${API_URL}/logo/${settings.logo}` : "",
      hotline: settings.hotline,
      email: settings.email,
      address: settings.address,
      zalo: settings.zalo,
      facebook: settings.facebook,
      instagram: settings.instagram,
      tiktok: settings.tiktok,
      youtube: settings.youtube,
      google_map_link: settings.google_map_link,
    });
  };

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Cập nhật hệ thống thành công!");
      dispatch(clearUpdateSuccess());
      dispatch(fetchSystemSettings());
    } else if (error) {
      toast.error(error?.message || error);
    }
  }, [error, updateSuccess]);

  return (
    <div>
      <div>
        <h5 style={{ color: "#E35765" }}>Logo Website</h5>

        <Form.Group className="mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="text-center" style={{ width: "300px" }}>
              <Form.Control type="file" onChange={handleLogoChange} />
            </div>
            <div style={{ marginBottom: "10px", textAlign: "center" }}>
              {form.logo && (
                <Image src={form.logo} alt="Logo" style={{ height: "100px" }} />
              )}
            </div>
          </div>
        </Form.Group>
      </div>
      <div>
        <h5 style={{ color: "#E35765" }}>Thông tin liên hệ</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Hotline</Form.Label>
              <Form.Control
                name="hotline"
                value={form.hotline}
                onChange={handleChange}
                placeholder="Nhập hotline"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Email</Form.Label>
              <Form.Control
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Địa chỉ</Form.Label>
              <Form.Control
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Zalo</Form.Label>
              <Form.Control
                name="zalo"
                value={form.zalo}
                onChange={handleChange}
                placeholder="Nhập số zalo"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Link google map</Form.Label>
              <Form.Control
                name="google_map_link"
                value={form.google_map_link}
                onChange={handleChange}
                placeholder="Nhập link google map"
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div>
        <h5 style={{ color: "#E35765" }}>Mạng xã hội</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Facebook</Form.Label>
              <Form.Control
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="Link Facebook"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Instagram</Form.Label>
              <Form.Control
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="Link Instagram"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>TikTok</Form.Label>
              <Form.Control
                name="tiktok"
                value={form.tiktok}
                onChange={handleChange}
                placeholder="Link TikTok"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Youtube</Form.Label>
              <Form.Control
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                placeholder="Link Youtube"
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="d-flex align-items-center justify-content-end gap-2">
        <Button variant="secondary" size="sm" onClick={handleCancel}>
          Huỷ
        </Button>
        <Button variant="success" size="sm" onClick={handleSave}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default SettingSystemPage;
