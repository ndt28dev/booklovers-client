import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import MyModal from "../../../../../../components/mymodal/MyModal";
import { Editor } from "@tinymce/tinymce-react";

const CreateUpdateBlogModal = ({
  isOpen,
  onClose,
  title,
  isCheck = false,
  dataSelected,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    author: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  // ================= VALIDATE =================

  const validate = () => {
    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    }

    if (!formData.date) {
      newErrors.date = "Vui lòng chọn ngày đăng";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Tác giả không được để trống";
    }

    if (!formData.description || formData.description === "<p><br></p>") {
      newErrors.description = "Mô tả không được để trống";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= FILL DATA WHEN UPDATE =================

  useEffect(() => {
    if (isCheck && dataSelected) {
      setFormData({
        title: dataSelected.title || "",
        date: dataSelected.date || "",
        author: dataSelected.author || "",
        description: dataSelected.description || "",
        image: null,
      });

      setPreview(dataSelected.image || null);
    }
  }, [dataSelected, isCheck]);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ================= HANDLE IMAGE =================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);

    setFormData({
      ...formData,
      image: null,
    });
  };

  // ================= SUBMIT =================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();

    data.append("title", formData.title);
    data.append("date", formData.date);
    data.append("author", formData.author);
    data.append("description", formData.description);

    if (formData.image) {
      data.append("image", formData.image);
    }

    if (isCheck) {
      console.log("Update Blog", data);
      // dispatch(updateBlog(data))
    } else {
      console.log("Create Blog", data);
      // dispatch(createBlog(data))
    }
  };

  return (
    <MyModal show={isOpen} handleClose={onClose} title={title} size="xl">
      <Form onSubmit={handleSubmit}>
        <Row>
          {/* LEFT SIDE */}
          <Col md={6}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Tiêu đề</Form.Label>

                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề bài viết"
                  />

                  {errors.title && (
                    <small className="text-danger">{errors.title}</small>
                  )}
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày đăng</Form.Label>

                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />

                  {errors.date && (
                    <small className="text-danger">{errors.date}</small>
                  )}
                </Form.Group>
              </Col>

              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Tác giả</Form.Label>

                  <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Nhập tên tác giả"
                  />

                  {errors.author && (
                    <small className="text-danger">{errors.author}</small>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Col>

          {/* RIGHT SIDE */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Row className="align-items-start">
                <Col md={3}>
                  <Form.Label>Ảnh bài viết</Form.Label>

                  <Form.Label
                    htmlFor="upload-image"
                    className="btn btn-secondary btn-sm"
                  >
                    Chọn ảnh
                  </Form.Label>

                  <Form.Control
                    id="upload-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </Col>

                <Col md={9}>
                  {preview && (
                    <div style={{ position: "relative", width: "100%" }}>
                      <Image
                        src={preview}
                        alt="preview"
                        rounded
                        style={{
                          height: "150px",
                          width: "80%",
                          objectFit: "cover",
                          border: "1px solid #ddd",
                          padding: "3px",
                        }}
                      />

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleRemoveImage}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "85px",
                          padding: "2px 8px",
                          lineHeight: "1",
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </Form.Group>
          </Col>

          {/* DESCRIPTION */}
          <Col md={12}>
            <div className="mb-3">
              <label style={{ marginBottom: "5px" }}>Mô tả</label>
              <br />

              <label className="text-muted" style={{ marginBottom: "5px" }}>
                Soạn thảo thuận tiện hơn{" "}
                <a
                  href="https://docs.google.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ở đây
                </a>
              </label>

              <Editor
                apiKey="66bx6owe7e8habzc85msf0cjt0fq0tcowhkrcmuwa6l4x8f9"
                value={formData.description}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap preview",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table code help wordcount",
                  ],
                  toolbar: `
                    undo redo |
                    formatselect |
                    bold italic underline |
                    alignleft aligncenter alignright |
                    bullist numlist |
                    link image |
                    code
                  `,
                }}
                onEditorChange={(content) =>
                  setFormData({
                    ...formData,
                    description: content,
                  })
                }
              />

              {errors.description && (
                <small className="text-danger">{errors.description}</small>
              )}
            </div>
          </Col>
        </Row>

        {/* BUTTON */}
        <div className="d-flex justify-content-end mt-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="me-2"
            size="sm"
          >
            Hủy
          </Button>

          <Button variant="success" type="submit" size="sm">
            Lưu
          </Button>
        </div>
      </Form>
    </MyModal>
  );
};

export default CreateUpdateBlogModal;
