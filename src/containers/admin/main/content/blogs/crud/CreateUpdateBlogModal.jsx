import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MyModal from "../../../../../../components/mymodal/MyModal";
import { Editor } from "@tinymce/tinymce-react";
import {
  createBlog,
  fetchAllBlog,
  resetCreateBlogState,
  resetUpdateBlogState,
  updateBlog,
} from "../../../../../../redux/slices/blogSlice";
import API_URL from "../../../../../../config/api";
import { toast } from "react-toastify";

const CreateUpdateBlogModal = ({
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
    title: "",
    date: "",
    author: "",
    description: "",
    image: null,
    is_featured: 0,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const { isLoading, error, success } = useSelector(
    (state) => state.blog.createState
  );

  const {
    isLoading: isLoadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.blog.updateState);

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

    const text = formData.description.replace(/<[^>]*>?/gm, "").trim();

    if (!text) {
      newErrors.description = "Mô tả không được để trống";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isCheck && dataSelected) {
      setFormData({
        id: dataSelected.id || null,
        title: dataSelected.title || "",
        date: dataSelected.date
          ? new Date(dataSelected.date).toISOString().split("T")[0]
          : "",
        author: dataSelected.author || "",
        description: dataSelected.description || "",
        image: null,
        is_featured: dataSelected.is_featured || 0,
      });

      if (dataSelected.image) {
        setPreview(`${API_URL}/blogs/${dataSelected.image}`);
      }
    }
  }, [dataSelected, isCheck]);

  const handleToggleFeatured = (e) => {
    setFormData((prev) => ({
      ...prev,
      is_featured: e.target.checked ? 1 : 0,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);

    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();

    data.append("title", formData.title);
    data.append("date", formData.date);
    data.append("author", formData.author);
    data.append("description", formData.description);
    data.append("is_featured", formData.is_featured);

    if (formData.image) {
      data.append("image", formData.image);
    }

    if (isCheck) {
      data.append("id", formData.id);
      dispatch(updateBlog(data));
    } else {
      // console.log("Create Blog", formData.description);
      dispatch(createBlog(data));
    }
  };

  useEffect(() => {
    if (success) {
      toast.success("Thêm bài viết thành công!");
      dispatch(resetCreateBlogState());
      dispatch(fetchAllBlog({ page: currentPage, limit: 10 }));
      onClose();
    } else if (error) {
      toast.error(error?.message || error);
    }
  }, [error, success]);

  useEffect(() => {
    if (successUpdate) {
      toast.success("Cập nhật bài viết thành công!");
      dispatch(resetUpdateBlogState());
      dispatch(fetchAllBlog({ page: currentPage, limit: 10 }));
      onClose();
    } else if (errorUpdate) {
      toast.error(errorUpdate?.message || errorUpdate);
    }
  }, [errorUpdate, successUpdate]);

  return (
    <MyModal show={isOpen} handleClose={onClose} title={title} size="xl">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-0">Tiêu đề</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề bài viết"
                    isInvalid={errors.title}
                  />

                  {errors.title && (
                    <small className="text-danger">{errors.title}</small>
                  )}
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-0">Ngày đăng</Form.Label>

                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    isInvalid={errors.date}
                  />

                  {errors.date && (
                    <small className="text-danger">{errors.date}</small>
                  )}
                </Form.Group>
              </Col>

              <Col md={7}>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-0">Tác giả</Form.Label>

                  <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Nhập tên tác giả"
                    isInvalid={errors.author}
                  />

                  {errors.author && (
                    <small className="text-danger">{errors.author}</small>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Row className="align-items-start">
                <Col md={3}>
                  <Form.Label className="mb-0">Ảnh bài viết</Form.Label>

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
                          top: "4px",
                          right: "21%",
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

          <Col md={12}>
            <div className="mb-3">
              <label className="mb-0" style={{ marginBottom: "5px" }}>
                Mô tả
              </label>
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
                  setFormData((prev) => ({
                    ...prev,
                    description: content,
                  }))
                }
              />

              {errors.description && (
                <small className="text-danger">{errors.description}</small>
              )}
            </div>
          </Col>
        </Row>

        <div className="d-flex justify-content-between align-items-center ">
          <Form.Check
            type="switch"
            id="featured-switch"
            label="Bài viết nổi bật"
            checked={formData.is_featured === 1}
            onChange={handleToggleFeatured}
          />

          <div>
            <Button
              variant="secondary"
              onClick={onClose}
              className="me-2"
              size="sm"
            >
              Hủy
            </Button>

            <Button
              variant="success"
              type="submit"
              size="sm"
              disabled={isLoading}
            >
              Lưu
            </Button>
          </div>
        </div>
      </Form>
    </MyModal>
  );
};

export default CreateUpdateBlogModal;
