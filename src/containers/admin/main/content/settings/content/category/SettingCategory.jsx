import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyButtonUpdate from "../../../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../../../components/button/MyButtonDelete";
import MyButtonCreate from "../../../../../../../components/button/MyButtonCreate";
import { Button } from "react-bootstrap";
import { fetchCategoriesWithSub } from "../../../../../../../redux/slices/categorySlice";
import {
  deleteSubcategory,
  getAllSubcategories,
  resetDelete,
  resetUpdate,
  updateSubcategory,
} from "../../../../../../../redux/slices/subcategorySlice";
import { toast } from "react-toastify";

const SettingCategory = () => {
  const dispatch = useDispatch();

  const [openIds, setOpenIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const { categories: data } = useSelector((state) => state.category);
  //   const { subcategories } = useSelector((state) => state.subcategory);

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
    dispatch(
      updateSubcategory({
        id: sub.id,
        name: editingValue.trim(),
      })
    );
    setEditingId(null);
    setEditingValue("");
  };

  const handleSubCategoryDelete = (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xoá danh mục con này?");
    if (!confirmed) return; // nếu nhấn Cancel thì thôi
    dispatch(deleteSubcategory(id));
  };

  //   useEffect(() => {
  //     if (success) {
  //       toast.success("Thêm khuyến mãi thành công!");
  //       dispatch(resetCreatePromotion());
  //       dispatch(fetchAllPromotion({ page: currentPage, limit: 10 }));
  //       onClose();
  //     } else if (error) {
  //       toast.error(error?.message || error);
  //     }
  //   }, [error, success]);

  useEffect(() => {
    if (successUpdate) {
      toast.success("Cập nhật danh mục con thành công!");
      dispatch(resetUpdate());
      dispatch(fetchCategoriesWithSub());
    } else if (errorUpdate) {
      toast.error(errorUpdate?.message || errorUpdate);
    }
  }, [errorUpdate, successUpdate]);

  useEffect(() => {
    if (successDelete) {
      toast.success("Xoá danh mục con thành công!");
      dispatch(resetDelete());
      dispatch(fetchCategoriesWithSub());
    } else if (errorDelete) {
      toast.error(errorDelete?.message || errorDelete);
    }
  }, [errorDelete, successDelete]);

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
                  {cat.name}{" "}
                </span>
                <span>({cat.subcategories.length})</span>
              </div>
              <div className="d-flex align-items-center">
                <Button variant="primary" size="sm" className="me-2">
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SettingCategory;
