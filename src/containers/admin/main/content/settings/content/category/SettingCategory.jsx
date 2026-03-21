import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyButtonUpdate from "../../../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../../../components/button/MyButtonDelete";
import MyButtonCreate from "../../../../../../../components/button/MyButtonCreate";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

import { fetchCategoriesWithSub } from "../../../../../../../redux/slices/categorySlice";
import {
  createSubcategory,
  deleteSubcategory,
  updateSubcategory,
  resetDelete,
  resetUpdate,
  resetCreate,
} from "../../../../../../../redux/slices/subcategorySlice";

const SettingCategory = () => {
  const dispatch = useDispatch();

  // State mở danh mục cha
  const [openIds, setOpenIds] = useState([]);
  // State chỉnh sửa subcategory
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  // State thêm subcategory
  const [addingCatId, setAddingCatId] = useState(null);
  const [newSubName, setNewSubName] = useState("");

  const { categories: data } = useSelector((state) => state.category);

  const { loading, error, success } = useSelector(
    (state) => state.subcategory.create
  );

  const {
    loading: isLoadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.subcategory.update);

  const {
    loading: isLoadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.subcategory.delete);

  useEffect(() => {
    dispatch(fetchCategoriesWithSub());
  }, [dispatch]);

  const toggle = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubEdit = (sub) => {
    setEditingId(sub.id);
    setEditingValue(sub.name);
  };

  const handleSubCategoryUpdate = (sub) => {
    if (!editingValue.trim()) {
      toast.error("Tên danh mục con không được để trống");
      return;
    }
    dispatch(updateSubcategory({ id: sub.id, name: editingValue.trim() }));
    setEditingId(null);
    setEditingValue("");
  };

  const handleSubCategoryDelete = (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xoá danh mục con này?");
    if (!confirmed) return;
    dispatch(deleteSubcategory(id));
  };

  const handleAddSubClick = (catId) => {
    setAddingCatId(catId);
    setNewSubName("");
  };

  const handleAddCancel = () => {
    setAddingCatId(null);
    setNewSubName("");
  };

  const handleAddSubSave = (catId) => {
    if (!newSubName.trim()) {
      toast.error("Vui lòng nhập tên danh mục con");
      return;
    }
    dispatch(
      createSubcategory({ name: newSubName.trim(), category_id: catId })
    );
    setAddingCatId(null);
    setNewSubName("");
  };

  useEffect(() => {
    if (success) {
      toast.success("Thêm danh mục con thành công!");
      dispatch(resetCreate());
      dispatch(fetchCategoriesWithSub());
    } else if (error) {
      toast.error(error?.message || error);
    }
  }, [error, success]);

  useEffect(() => {
    if (successUpdate) {
      toast.success("Cập nhật danh mục con thành công!");
      dispatch(resetUpdate());
      dispatch(fetchCategoriesWithSub());
    } else if (errorUpdate) {
      toast.error(errorUpdate?.message || errorUpdate);
    }
  }, [errorUpdate, successUpdate, dispatch]);

  useEffect(() => {
    if (successDelete) {
      toast.success("Xoá danh mục con thành công!");
      dispatch(resetDelete());
      dispatch(fetchCategoriesWithSub());
    } else if (errorDelete) {
      toast.error(errorDelete?.message || errorDelete);
    }
  }, [errorDelete, successDelete, dispatch]);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 style={{ color: "#E35765" }}>Danh sách danh mục</h5>
        <MyButtonCreate />
      </div>

      {data.map((cat) => (
        <div key={cat.id} style={{ marginBottom: "10px", userSelect: "none" }}>
          <div
            style={{
              padding: "10px",
              background: "#f5f5f5",
              cursor: "pointer",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="flex-grow-1" onClick={() => toggle(cat.id)}>
                <span>
                  {openIds.includes(cat.id) ? (
                    <i className="bi bi-caret-down"></i>
                  ) : (
                    <i className="bi bi-caret-right"></i>
                  )}{" "}
                  {cat.name} ({cat.subcategories.length})
                </span>
              </div>
              <div className="d-flex align-items-center">
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleAddSubClick(cat.id)}
                >
                  <i className="bi bi-plus"></i>
                </Button>
                <MyButtonUpdate />
                <MyButtonDelete />
              </div>
            </div>
          </div>

          {openIds.includes(cat.id) && (
            <div
              style={{
                paddingLeft: "60px",
                paddingRight: "60px",
                marginTop: "5px",
              }}
            >
              {cat.subcategories.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    padding: "6px 0",
                    borderBottom: "1px solid #eee",
                  }}
                  className="d-flex align-items-center justify-content-between"
                >
                  {editingId === sub.id ? (
                    <div className="d-flex align-items-center gap-2">
                      <input
                        className="form-control"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        style={{ height: "30px", width: "250px" }}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        Huỷ
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleSubCategoryUpdate(sub)}
                      >
                        Lưu
                      </Button>
                    </div>
                  ) : (
                    <span style={{ fontWeight: "500" }}>{sub.name}</span>
                  )}
                  <div className="d-flex align-items-center">
                    <MyButtonUpdate onClick={() => handleSubEdit(sub)} />
                    <MyButtonDelete
                      onClick={() => handleSubCategoryDelete(sub.id)}
                    />
                  </div>
                </div>
              ))}

              {addingCatId === cat.id && (
                <div
                  className="d-flex align-items-center gap-2 mt-2"
                  style={{ paddingLeft: "0px" }}
                >
                  <input
                    className="form-control"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    style={{ height: "30px", width: "250px" }}
                    placeholder="Tên danh mục con mới"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddCancel}
                  >
                    Huỷ
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAddSubSave(cat.id)}
                  >
                    Lưu
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SettingCategory;
