import { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import MyModal from "../../../../../../../../components/mymodal/MyModal";
import { fetchCategories } from "../../../../../../../../redux/slices/chatCategorySlice";
import { Button } from "react-bootstrap";

const CreateUpdateChatOption = ({
  isOpen,
  onClose,
  title,
  isCheck = false,
  dataSelected,
  currentPage,
}) => {
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.chatCategory.list);

  const [form, setForm] = useState({
    id: null,
    question: "",
    answer: "",
    category: null,
  });

  const [errors, setErrors] = useState({});

  // ===== fetch category =====
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
    }
  }, [isOpen, dispatch]);

  // ===== convert options =====
  const categoryOptions =
    data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  // ===== fill data =====
  useEffect(() => {
    if (dataSelected) {
      const selectedCategory = categoryOptions.find(
        (c) => c.value === dataSelected.category_id
      );

      setForm({
        id: dataSelected.id,
        question: dataSelected.question || "",
        answer: dataSelected.answer || "",
        category: selectedCategory || null,
      });
    } else {
      setForm({
        id: null,
        question: "",
        answer: "",
        category: null,
      });
    }

    setErrors({});
  }, [dataSelected, isOpen, data]);

  // ===== validate =====
  const validate = () => {
    const newErrors = {};

    if (!form.question.trim()) {
      newErrors.question = "Vui lòng nhập câu hỏi";
    }

    if (!form.answer.trim()) {
      newErrors.answer = "Vui lòng nhập câu trả lời";
    }

    if (!form.category) {
      newErrors.category = "Vui lòng chọn danh mục";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== handle input =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear lỗi khi nhập lại
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  // ===== handle select =====
  const handleSelectCategory = (selected) => {
    setForm((prev) => ({
      ...prev,
      category: selected,
    }));

    setErrors((prev) => ({
      ...prev,
      category: null,
    }));
  };

  // ===== submit =====
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      question: form.question,
      answer: form.answer,
      category_id: form.category?.value,
    };

    console.log("SUBMIT:", payload);

    // if (form.id) {
    //   dispatch(updateChatOption({ id: form.id, ...payload }));
    // } else {
    //   dispatch(createChatOption(payload));
    // }

    onClose();
  };

  return (
    <MyModal show={isOpen} handleClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label mb-0">Câu hỏi</label>
          <input
            type="text"
            name="question"
            className={`form-control ${errors.question ? "is-invalid" : ""}`}
            value={form.question}
            onChange={handleChange}
            placeholder="Nhập câu hỏi"
          />
          {errors.question && (
            <div className="invalid-feedback">{errors.question}</div>
          )}
        </div>

        <div className="mb-2">
          <label className="form-label mb-0">Câu trả lời</label>
          <textarea
            name="answer"
            className={`form-control ${errors.answer ? "is-invalid" : ""}`}
            rows={4}
            value={form.answer}
            onChange={handleChange}
            placeholder="Nhập câu trả lời"
          />
          {errors.answer && (
            <div className="invalid-feedback">{errors.answer}</div>
          )}
        </div>

        <div className="mb-2">
          <label className="form-label mb-0">Danh mục</label>
          <Select
            options={categoryOptions}
            value={form.category}
            onChange={handleSelectCategory}
            isLoading={loading}
            placeholder="Chọn danh mục"
            noOptionsMessage={() => "Không có dữ liệu"}
          />
          {errors.category && (
            <div className="text-danger mt-1" style={{ fontSize: 13 }}>
              {errors.category}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2">
          <Button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            size="sm"
          >
            Huỷ
          </Button>
          <Button type="submit" className="btn btn-success" size="sm">
            Lưu
          </Button>
        </div>
      </form>
    </MyModal>
  );
};

export default CreateUpdateChatOption;
