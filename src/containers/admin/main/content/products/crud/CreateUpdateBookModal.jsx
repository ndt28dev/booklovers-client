import { Form, Button, Row, Col, Image } from "react-bootstrap";
import MyModal from "../../../../../../components/mymodal/MyModal";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import API_URL from "../../../../../../config/api";
import { Editor } from "@tinymce/tinymce-react";
import { fetchCategoriesWithSub } from "../../../../../../redux/slices/categorySlice";
import {
  createBook,
  fetchAllBook,
  resetCreateBookStatus,
  resetUpdateBookStatus,
  updateBook,
} from "../../../../../../redux/slices/bookSlice";
import { toast } from "react-toastify";

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
  const [errors, setErrors] = useState({});

  const { isLoading, error, success } = useSelector(
    (state) => state.book.createBook
  );

  const {
    isLoading: isLoadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.book.updateBook);

  const [form, setForm] = useState({
    id: "",
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
    mainImagePreview: `bookDefault.png`,

    subImages: [],
  });

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên sách không được để trống";
    }

    if (!form.category_id) {
      newErrors.category_id = "Vui lòng chọn danh mục";
    }

    if (!form.subcategory_id) {
      newErrors.subcategory_id = "Vui lòng chọn danh mục con";
    }

    if (!form.price) {
      newErrors.price = "Giá không được để trống";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const { categories: categoriesAll } = useSelector((state) => state.category);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    dispatch(fetchCategoriesWithSub());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_id") {
      const selectedCategory = categoriesAll.find(
        (cat) => cat.id === Number(value)
      );

      setSubcategories(selectedCategory?.subcategories || []);

      setForm((prev) => ({
        ...prev,
        category_id: value,
        subcategory_id: "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    if (!validateForm()) return;

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("category_id", form.category_id);
    formData.append("subcategory_id", form.subcategory_id);
    formData.append("price", form.price);
    formData.append("discount", form.discount);
    formData.append("description", form.description);

    // add details
    formData.append("barcode", form.barcode);
    formData.append("supplier_name", form.supplier_name);
    formData.append("authors", form.authors);
    formData.append("publisher", form.publisher);
    formData.append("published_year", form.published_year);
    formData.append("language", form.language);
    formData.append("weight_gram", form.weight_gram);
    formData.append("dimensions", form.dimensions);
    formData.append("page_count", form.page_count);
    formData.append("cover_type", form.cover_type);

    // add images
    formData.append("mainImage", form.mainImageFile);

    // ảnh cũ
    const oldImages = form.subImages
      .filter((img) => img.id)
      .map((img) => img.id);

    formData.append("oldImages", JSON.stringify(oldImages));

    // ảnh mới
    form.subImages
      .filter((img) => img.file)
      .forEach((img) => {
        formData.append("subImages", img.file);
      });

    if (isCheck) {
      formData.append("id", form.id);
      dispatch(updateBook(formData));
    } else {
      dispatch(createBook(formData));
    }
  };

  useEffect(() => {
    if (isCheck && dataSelected) {
      const categoryId = dataSelected?.category?.id || "";

      const selectedCategory = categoriesAll.find(
        (cat) => cat.id === Number(categoryId)
      );

      setSubcategories(selectedCategory?.subcategories || []);

      setForm({
        id: dataSelected?.id || "",
        name: dataSelected?.name || "",
        category_id: categoryId,
        subcategory_id: dataSelected?.subcategory?.id || "",

        price: dataSelected?.price || "",
        discount: dataSelected?.discount || "",

        description: dataSelected?.description || "",

        barcode: dataSelected?.book_detail?.barcode || "",
        supplier_name: dataSelected?.book_detail?.supplier_name || "",
        authors: dataSelected?.book_detail?.authors || "",
        publisher: dataSelected?.book_detail?.publisher || "",
        published_year: dataSelected?.book_detail?.published_year || "",
        language: dataSelected?.book_detail?.language || "",
        weight_gram: dataSelected?.book_detail?.weight_gram || "",
        dimensions: dataSelected?.book_detail?.dimensions || "",
        page_count: dataSelected?.book_detail?.page_count || "",
        cover_type: dataSelected?.book_detail?.cover_type || "",

        mainImagePreview: dataSelected?.main_image || "",
        subImages: dataSelected?.images || [],
      });
    }
  }, [isCheck, dataSelected, categoriesAll]);

  useEffect(() => {
    if (success) {
      toast.success("Thêm sản phẩm thành công!");
      dispatch(resetCreateBookStatus());
      dispatch(fetchAllBook({ page: currentPage, limit: 10 }));
      onClose();
    } else if (error) {
      toast.error(error?.message || error);
    }
  }, [error, success]);

  useEffect(() => {
    if (successUpdate) {
      toast.success("Cập nhật sản phẩm thành công!");
      dispatch(resetUpdateBookStatus());
      dispatch(fetchAllBook({ page: currentPage, limit: 10 }));
      onClose();
    } else if (errorUpdate) {
      toast.error(errorUpdate?.message || errorUpdate);
    }
  }, [errorUpdate, successUpdate]);

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
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    isInvalid={!!errors.category_id}
                  >
                    <option disabled value="">
                      Chọn danh mục
                    </option>

                    {categoriesAll.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Thể loại</Form.Label>
                  <Form.Select
                    name="subcategory_id"
                    value={form.subcategory_id}
                    onChange={handleChange}
                    isInvalid={!!errors.subcategory_id}
                    disabled={!form.category_id}
                  >
                    <option disabled value="">
                      Chọn danh thể loại
                    </option>

                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
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
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
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
        </Row>
        <Row className="mt-3 mb-3">
          <Col md={3} className="position-relative text-center">
            <label style={{ marginBottom: "5px" }}>Ảnh đại diện</label>
            <Image
              src={
                form.mainImagePreview?.startsWith("blob")
                  ? form.mainImagePreview
                  : `${API_URL}/uploads/${form.mainImagePreview}`
              }
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
            {errors.mainImageFile && (
              <div style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
                {errors.mainImageFile}
              </div>
            )}
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
              {form.subImages &&
                form.subImages.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                    }}
                  >
                    <Image
                      src={
                        img.preview
                          ? img.preview
                          : `${API_URL}/uploads/${img.image_url}`
                      }
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
        <label style={{ marginBottom: "5px" }}>Mô tả</label> <br />
        <label style={{ marginBottom: "5px" }} className="text-muted">
          Soạn thảo thuận tiện hơn{" "}
          <a href="https://docs.google.com/" target="_blank">
            ở đây{" "}
          </a>
        </label>
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
                  <Form.Select
                    name="cover_type"
                    value={form.cover_type}
                    onChange={handleChange}
                  >
                    <option value="">Chọn loại bìa</option>
                    <option value="Bìa mềm">Bìa mềm</option>
                    <option value="Bìa cứng">Bìa cứng</option>
                  </Form.Select>
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
