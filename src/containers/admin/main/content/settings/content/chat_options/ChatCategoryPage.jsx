import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyModal from "../../../../../../../components/mymodal/MyModal";
import { Button, Form } from "react-bootstrap";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  resetCreate,
  resetUpdate,
  resetDelete,
} from "../../../../../../../redux/slices/chatCategorySlice";
import MyButtonCreate from "../../../../../../../components/button/MyButtonCreate";
import MyButtonUpdate from "../../../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../../../components/button/MyButtonDelete";
import { toast } from "react-toastify";

const ChatCategoryPage = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.chatCategory.list);
  const createState = useSelector((state) => state.chatCategory.create);
  const updateState = useSelector((state) => state.chatCategory.update);
  const deleteState = useSelector((state) => state.chatCategory.delete);

  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
    }
  }, [isOpen]);

  useEffect(() => {
    if (createState.success) {
      setNewName("");
      dispatch(resetCreate());
    }
  }, [createState.success]);

  useEffect(() => {
    if (updateState.success) {
      setEditId(null);
      setEditName("");
      dispatch(resetUpdate());
    }
  }, [updateState.success]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    dispatch(createCategory({ name: newName }));
  };

  const handleUpdate = (id) => {
    if (!editName.trim()) return;
    dispatch(updateCategory({ id, name: editName }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá?")) {
      dispatch(deleteCategory(id));
    }
  };

  useEffect(() => {
    if (createState.success) {
      toast.success("Thêm danh mục câu hỏi thành công!");
      dispatch(resetCreate());
      dispatch(fetchCategories());
    } else if (createState.error) {
      toast.error(createState.error?.message || createState.error);
    }
  }, [createState.error, createState.success]);

  useEffect(() => {
    if (updateState.success) {
      toast.success("Cập nhật danh mục câu hỏi thành công!");
      dispatch(resetUpdate());
      dispatch(fetchCategories());
    } else if (updateState.error) {
      toast.error(updateState.error?.message || updateState.error);
    }
  }, [updateState.error, updateState.success]);

  useEffect(() => {
    if (deleteState.success) {
      toast.success("Xoá danh mục câu hỏi thành công!");
      dispatch(resetDelete());
      dispatch(fetchCategories());
    } else if (deleteState.error) {
      toast.error(deleteState.error?.message || deleteState.error);
    }
  }, [deleteState.error, deleteState.success]);

  return (
    <MyModal
      show={isOpen}
      handleClose={onClose}
      title="Danh sách danh mục câu hỏi"
      size="md"
    >
      <div className="d-flex gap-2 mb-3">
        <Form.Control
          placeholder="Nhập tên danh mục..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button onClick={handleCreate} variant="success" size="sm">
          Thêm
        </Button>
      </div>

      <div
        style={{
          maxHeight: "500px",
          overflowY: "auto",
          paddingRight: "4px",
        }}
      >
        <div className="d-flex flex-column gap-2">
          {loading ? (
            <div className="text-center">Đang tải...</div>
          ) : data?.length === 0 ? (
            <div className="text-center">Không có dữ liệu</div>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                className="d-flex align-items-center justify-content-between"
                style={{
                  background: "#F5F5F5",
                  borderRadius: "6px",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                <div className="me-2" style={{ flex: 1 }}>
                  {editId === item.id ? (
                    <Form.Control
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId === item.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditId(null)}
                      >
                        Huỷ
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleUpdate(item.id)}
                      >
                        Lưu
                      </Button>
                    </>
                  ) : (
                    <div className="d-flex gap-0">
                      <MyButtonUpdate
                        onClick={() => {
                          setEditId(item.id);
                          setEditName(item.name);
                        }}
                      />
                      <MyButtonDelete onClick={() => handleDelete(item.id)} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MyModal>
  );
};

export default ChatCategoryPage;
