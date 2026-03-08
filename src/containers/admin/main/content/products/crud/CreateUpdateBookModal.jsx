import { Form, Button, Row, Col, Image } from "react-bootstrap";
import MyModal from "../../../../../../components/mymodal/MyModal";
import { useDispatch } from "react-redux";
import { useState, useRef } from "react";
import API_URL from "../../../../../../config/api";
import { Editor } from "@tinymce/tinymce-react";

const CreateUpdateBookModal = ({
  isOpen,
  onClose,
  title,
  isCheck = false,
  dataSelected,
  currentPage,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    subcategory_id: "",
    price: "",
    discount: "",

    barcode: "",
    supplier_name: "",
    authors: "",
    publisher: "",
    published_year: "",
    language: "",
    weight_gram: "",
    dimensions: "",
    page_count: "",
    cover_type: "",

    description: "",

    mainImageFile: null,
    mainImagePreview: `${API_URL}/book/default.jpg`,

    subImages: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubImages = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setForm({
      ...form,
      subImages: [...form.subImages, ...newImages],
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const preview = URL.createObjectURL(file);

      setForm({
        ...form,
        mainImageFile: file,
        mainImagePreview: preview,
      });
    }
  };

  const removeSubImage = (index) => {
    const newImages = [...form.subImages];
    newImages.splice(index, 1);

    setForm({
      ...form,
      subImages: newImages,
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("category_id", form.category_id);
    formData.append("subcategory_id", form.subcategory_id);
    formData.append("price", form.price);
    formData.append("discount", form.discount);

    if (form.mainImageFile) {
      formData.append("main_image", form.mainImageFile);
    }

    console.log(formData);

    // dispatch(createBook(formData))
  };

  return (
    <MyModal show={isOpen} handleClose={onClose} title={title} size="lg">
      <Form>
        <Row
          className="align-items-start"
          style={{ backgroundColor: "#F3F7FD", padding: "10px 0" }}
        >
          <Col md={12}>
            <Form.Group className="mb-2">
              <Form.Label>Tên sách</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                  >
                    <option disabled value="">
                      Chọn danh mục
                    </option>
                    <option value="1">Programming</option>
                    <option value="2">Novel</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Danh mục con</Form.Label>
                  <Form.Select
                    name="subcategory_id"
                    value={form.subcategory_id}
                    onChange={handleChange}
                  >
                    <option disabled value="">
                      Chọn danh mục con
                    </option>
                    <option value="1">Backend</option>
                    <option value="2">Frontend</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>Giảm giá (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    value={form.discount}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>

          {/* <Col md={3} className="text-center position-relative">
            <Image
              src={form.mainImagePreview}
              rounded
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
              <i className="bi bi-pencil-fill"></i>
            </Button>
          </Col> */}
        </Row>
        <Row className="mt-3 mb-3">
          <Col md={3} className="position-relative text-center">
            <label style={{ marginBottom: "5px" }}>Ảnh đại diện</label>
            <Image
              src={form.mainImagePreview}
              rounded
              style={{
                width: "120px",
                height: "150px",
                objectFit: "cover",
                border: "2px solid #ddd",
                padding: "3px",
              }}
            />

            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
            />

            <Button
              size="sm"
              variant="success"
              className="position-absolute"
              style={{
                top: "25px",
                right: "30px",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                padding: 0,
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <i className="bi bi-pencil"></i>
            </Button>
          </Col>

          <Col md={9}>
            <label style={{ marginBottom: "5px" }}>Ảnh liên quan</label>
            <Col className="d-flex gap-2 flex-wrap">
              {form.subImages.map((img, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                  }}
                >
                  <Image
                    src={img.preview}
                    rounded
                    style={{
                      width: "60px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute"
                    style={{
                      top: "-6px",
                      right: "-6px",
                      width: "20px",
                      height: "20px",
                      padding: 0,
                      borderRadius: "50%",
                      fontSize: "12px",
                    }}
                    onClick={() => removeSubImage(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}

              {/* ADD IMAGE */}
              <label
                style={{
                  width: "60px",
                  height: "80px",
                  border: "2px dashed #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "24px",
                  color: "#888",
                }}
              >
                +
                <input type="file" multiple hidden onChange={handleSubImages} />
              </label>
            </Col>
          </Col>
        </Row>
        <label style={{ marginBottom: "5px" }}>Mô tả</label>
        <Editor
          apiKey="66bx6owe7e8habzc85msf0cjt0fq0tcowhkrcmuwa6l4x8f9"
          value={form.description}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap preview",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table code help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic | \
       alignleft aligncenter alignright | \
       bullist numlist | link image",
          }}
          onEditorChange={(content) =>
            setForm({ ...form, description: content })
          }
        />
        <Row
          className="mt-3"
          style={{ backgroundColor: "#F3F7FD", padding: "10px 0" }}
        >
          <Col md={12}>
            <Row className="d-flex align-items-center">
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Mã vạch</Form.Label>
                  <Form.Control
                    name="barcode"
                    value={form.barcode}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Nhà cung cấp</Form.Label>
                  <Form.Control
                    name="supplier_name"
                    value={form.supplier_name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="d-flex align-items-center">
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Tác giả</Form.Label>
                  <Form.Control
                    name="authors"
                    value={form.authors}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Nhà xuất bản</Form.Label>
                  <Form.Control
                    name="publisher"
                    value={form.publisher}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Năm xuất bản</Form.Label>
                  <Form.Control
                    name="published_year"
                    value={form.published_year}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Ngôn ngữ</Form.Label>
                  <Form.Control
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Cân nặng (g)</Form.Label>
                  <Form.Control
                    name="weight_gram"
                    value={form.weight_gram}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Số trang</Form.Label>
                  <Form.Control
                    name="page_count"
                    value={form.page_count}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Kích thước</Form.Label>
                  <Form.Control
                    name="dimensions"
                    value={form.dimensions}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Loại bìa</Form.Label>
                  <Form.Control
                    name="cover_type"
                    value={form.cover_type}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="d-flex justify-content-end gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Huỷ
            </Button>
            <Button variant="success" size="sm" onClick={handleSubmit}>
              Lưu
            </Button>
          </Col>
        </Row>
      </Form>
    </MyModal>
  );
};

export default CreateUpdateBookModal;
