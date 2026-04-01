import { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import MyModal from "../../../../../../../../components/mymodal/MyModal";
import { fetchCategories } from "../../../../../../../../redux/slices/chatCategorySlice";

import {
  createChatOption,
  updateChatOption,
  resetCreateChat,
  resetUpdateChat,
  fetchChatOptions,
} from "../../../../../../../../redux/slices/chatOptionSlice";

import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

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
  const createState = useSelector((state) => state.chatOption.createChat);
  const updateState = useSelector((state) => state.chatOption.updateChat);

  const [form, setForm] = useState({
    id: null,
    question: "",
    answer: "",
    category: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
    }
  }, [isOpen, dispatch]);

  const categoryOptions =
    data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

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

  useEffect(() => {
    if (!isOpen) {
      setForm({
        id: null,
        question: "",
        answer: "",
        category: null,
      });
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (createState.success) {
      dispatch(resetCreateChat());
      onClose();
    }
  }, [createState.success]);

  useEffect(() => {
    if (updateState.success) {
      dispatch(resetUpdateChat());
      onClose();
    }
  }, [updateState.success]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      question: form.question,
      answer: form.answer,
      category_id: form.category?.value,
    };

    if (form.id) {
      dispatch(updateChatOption({ id: form.id, ...payload }));
    } else {
      dispatch(createChatOption(payload));
    }
  };

  useEffect(() => {
    if (createState.success) {
      toast.success("Thêm bộ câu hỏi thành công!");
      dispatch(resetCreateChat());
      dispatch(fetchChatOptions({ page: currentPage, limit: 10 }));
      onClose();
    } else if (createState.error) {
      toast.error(createState.error?.message || createState.error);
    }
  }, [createState.error, createState.success]);

  useEffect(() => {
    if (updateState.success) {
      toast.success("Cập nhật bộ câu hỏi thành công!");
      dispatch(resetUpdateChat());
      dispatch(fetchChatOptions({ page: currentPage, limit: 10 }));
      onClose();
    } else if (updateState.error) {
      toast.error(updateState.error?.message || updateState.error);
    }
  }, [updateState.error, updateState.success]);

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

          <Button
            type="submit"
            className="btn btn-success"
            size="sm"
            disabled={createState.loading || updateState.loading}
          >
            {createState.loading || updateState.loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </MyModal>
  );
};

export default CreateUpdateChatOption;
