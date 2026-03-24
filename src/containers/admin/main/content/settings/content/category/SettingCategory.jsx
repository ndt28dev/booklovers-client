import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyButtonUpdate from "../../../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../../../components/button/MyButtonDelete";
import MyButtonCreate from "../../../../../../../components/button/MyButtonCreate";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

import {
  fetchCategoriesWithSub,
  createCategory,
  updateCategory,
  deleteCategory,
  resetCreate,
  resetUpdate,
  resetDelete,
} from "../../../../../../../redux/slices/categorySlice";

import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  resetCreate as resetSubCreate,
  resetUpdate as resetSubUpdate,
  resetDelete as resetSubDelete,
} from "../../../../../../../redux/slices/subcategorySlice";

const SettingCategory = () => {
  const dispatch = useDispatch();

  // ========== STATES ==========
  const [openIds, setOpenIds] = useState([]);
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatValue, setEditingCatValue] = useState("");

  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const [editingSubId, setEditingSubId] = useState(null);
  const [editingSubValue, setEditingSubValue] = useState("");
  const [addingSubCatId, setAddingSubCatId] = useState(null);
  const [newSubName, setNewSubName] = useState("");

  const { categories: data, fetch } = useSelector((state) => state.category);
  const {
    create,
    update,
    delete: del,
  } = useSelector((state) => state.category);

  const subCreate = useSelector((state) => state.subcategory.create);
  const subUpdate = useSelector((state) => state.subcategory.update);
  const subDelete = useSelector((state) => state.subcategory.delete);

  // ========== EFFECTS ==========
  useEffect(() => {
    dispatch(fetchCategoriesWithSub());
  }, [dispatch]);

  // ===== Category Toasts =====
  useEffect(() => {
    if (create.success) {
      toast.success("Thêm danh mục cha thành công!");
      dispatch(resetCreate());
      dispatch(fetchCategoriesWithSub());
      setAddingCat(false);
      setNewCatName("");
    } else if (create.error) {
      toast.error(create.error || "Lỗi khi thêm danh mục cha");
    }
  }, [create, dispatch]);

  useEffect(() => {
    if (update.success) {
      toast.success("Cập nhật danh mục cha thành công!");
      dispatch(resetUpdate());
      dispatch(fetchCategoriesWithSub());
      setEditingCatId(null);
      setEditingCatValue("");
    } else if (update.error) {
      toast.error(update.error || "Lỗi khi cập nhật danh mục cha");
    }
  }, [update, dispatch]);

  useEffect(() => {
    if (del.success) {
      toast.success("Xoá danh mục cha thành công!");
      dispatch(resetDelete());
      dispatch(fetchCategoriesWithSub());
    } else if (del.error) {
      toast.error(del.error || "Lỗi khi xoá danh mục cha");
    }
  }, [del, dispatch]);

  // ===== Subcategory Toasts =====
  useEffect(() => {
    if (subCreate.success) {
      toast.success("Thêm danh mục con thành công!");
      dispatch(resetSubCreate());
      dispatch(fetchCategoriesWithSub());
      setAddingSubCatId(null);
      setNewSubName("");
    } else if (subCreate.error) {
      toast.error(subCreate.error || "Lỗi khi thêm danh mục con");
    }
  }, [subCreate, dispatch]);

  useEffect(() => {
    if (subUpdate.success) {
      toast.success("Cập nhật danh mục con thành công!");
      dispatch(resetSubUpdate());
      dispatch(fetchCategoriesWithSub());
      setEditingSubId(null);
      setEditingSubValue("");
    } else if (subUpdate.error) {
      toast.error(subUpdate.error || "Lỗi khi cập nhật danh mục con");
    }
  }, [subUpdate, dispatch]);

  useEffect(() => {
    if (subDelete.success) {
      toast.success("Xoá danh mục con thành công!");
      dispatch(resetSubDelete());
      dispatch(fetchCategoriesWithSub());
    } else if (subDelete.error) {
      toast.error(subDelete.error || "Lỗi khi xoá danh mục con");
    }
  }, [subDelete, dispatch]);

  // ========== HANDLERS ==========
  const toggle = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ===== Category =====
  const handleCatEdit = (cat) => {
    setEditingCatId(cat.id);
    setEditingCatValue(cat.name);
  };

  const handleCatUpdate = (cat) => {
    if (!editingCatValue.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }
    dispatch(updateCategory({ id: cat.id, name: editingCatValue.trim() }));
  };

  const handleCatDelete = (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xoá danh mục này?");
    if (!confirmed) return;
    dispatch(deleteCategory(id));
  };

  const handleCatAdd = () => {
    if (!newCatName.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }
    dispatch(createCategory(newCatName.trim()));
  };

  // ===== Subcategory =====
  const handleSubEdit = (sub) => {
    setEditingSubId(sub.id);
    setEditingSubValue(sub.name);
  };

  const handleSubUpdate = (sub) => {
    if (!editingSubValue.trim()) {
      toast.error("Tên danh mục con không được để trống");
      return;
    }
    dispatch(updateSubcategory({ id: sub.id, name: editingSubValue.trim() }));
  };

  const handleSubDelete = (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xoá danh mục con?");
    if (!confirmed) return;
    dispatch(deleteSubcategory(id));
  };

  const handleAddSubClick = (catId) => {
    setAddingSubCatId(catId);
    setNewSubName("");
  };

  const handleAddSubCancel = () => {
    setAddingSubCatId(null);
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
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 style={{ color: "#E35765" }}>Danh sách danh mục</h5>
        {addingCat ? (
          <div className="d-flex align-items-center gap-2">
            <input
              className="form-control"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Tên danh mục mới"
              style={{ width: "200px", height: "30px" }}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAddingCat(false)}
            >
              Huỷ
            </Button>
            <Button variant="success" size="sm" onClick={handleCatAdd}>
              Lưu
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={() => setAddingCat(true)}
            size="sm"
          >
            <i className="bi bi-plus me-2"></i>Thêm danh mục
          </Button>
        )}
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
            onClick={() => toggle(cat.id)}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="flex-grow-1">
                <span className="d-flex align-items-center">
                  {openIds.includes(cat.id) ? (
                    <i className="bi bi-caret-down"></i>
                  ) : (
                    <i className="bi bi-caret-right"></i>
                  )}{" "}
                  {editingCatId === cat.id ? (
                    <input
                      className="form-control me-1"
                      value={editingCatValue}
                      onChange={(e) => setEditingCatValue(e.target.value)}
                      style={{ width: "200px", height: "30px" }}
                    />
                  ) : (
                    cat.name
                  )}{" "}
                  ({cat.subcategories && cat.subcategories.length})
                </span>
              </div>

              <div className="d-flex align-items-center gap-1">
                {editingCatId === cat.id ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // <-- Ngăn event div cha
                        setEditingCatId(null);
                      }}
                    >
                      Huỷ
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCatUpdate(cat);
                      }}
                    >
                      Lưu
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddSubClick(cat.id);
                      }}
                      className="me-2"
                    >
                      <i className="bi bi-plus"></i>
                    </Button>
                    <MyButtonUpdate
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCatEdit(cat);
                      }}
                    />
                    <MyButtonDelete
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCatDelete(cat.id);
                      }}
                    />
                  </>
                )}
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
                  {editingSubId === sub.id ? (
                    <div className="d-flex align-items-center gap-2">
                      <input
                        className="form-control"
                        value={editingSubValue}
                        onChange={(e) => setEditingSubValue(e.target.value)}
                        style={{ width: "250px", height: "30px" }}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingSubId(null)}
                      >
                        Huỷ
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleSubUpdate(sub)}
                      >
                        Lưu
                      </Button>
                    </div>
                  ) : (
                    <span style={{ fontWeight: "500" }}>{sub.name}</span>
                  )}
                  <div className="d-flex align-items-center gap-1">
                    <MyButtonUpdate onClick={() => handleSubEdit(sub)} />
                    <MyButtonDelete onClick={() => handleSubDelete(sub.id)} />
                  </div>
                </div>
              ))}

              {addingSubCatId === cat.id && (
                <div className="d-flex align-items-center gap-2 mt-2">
                  <input
                    className="form-control"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder="Tên danh mục con mới"
                    style={{ width: "250px", height: "30px" }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddSubCancel}
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
