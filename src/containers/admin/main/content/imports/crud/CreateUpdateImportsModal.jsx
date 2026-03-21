import { useState, useEffect } from "react";
import MyModal from "../../../../../../components/mymodal/MyModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuppliers,
  fetchSuppliersAll,
} from "../../../../../../redux/slices/supplierSlice";
import {
  createImport,
  fetchImports,
  resetCreateImport,
} from "../../../../../../redux/slices/importSlice";
import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { getAllBooksNoPaging } from "../../../../../../redux/slices/bookSlice";
import MyButtonEye from "../../../../../../components/button/MyButtonEye";
import MyButtonDelete from "../../../../../../components/button/MyButtonDelete";
import MyButtonUpdate from "../../../../../../components/button/MyButtonUpdate";
import { toast } from "react-toastify";

const CreateUpdateImportsModal = ({ isOpen, onClose, currentPage }) => {
  const dispatch = useDispatch();

  const { data: suppliers } = useSelector(
    (state) => state.supplier.suppliersAll
  );

  const { listBookAllNoPaging } = useSelector(
    (state) => state.book.fetchBookAllNoPaging
  );

  const { loading, error, success } = useSelector(
    (state) => state.imports.createImport
  );

  const [supplierId, setSupplierId] = useState("");
  const [bookId, setBookId] = useState("");
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  const [errors, setErrors] = useState({});

  const [currentItem, setCurrentItem] = useState({
    book_id: "",
    quantity: "",
    price: "",
  });

  const optionsSupplier = suppliers?.map((s) => ({
    value: s.id,
    label:
      s.id +
      " - " +
      s.name +
      " - " +
      s.phone +
      " - " +
      s.email +
      " - " +
      s.address,
  }));

  const optionsBook = listBookAllNoPaging?.map((s) => ({
    value: s.id,
    label: s.id + " - " + s.name + " - " + s.price.toLocaleString("vi-VN"),
  }));

  useEffect(() => {
    dispatch(fetchSuppliersAll());
    dispatch(getAllBooksNoPaging());
  }, []);

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      return sum + Number(item.quantity) * Number(item.price);
    }, 0);

    setTotalAmount(total);
  }, [items]);

  const handleAddItem = () => {
    const newErrors = {};

    if (!bookId) newErrors.book_id = "Vui lòng chọn sản phẩm";
    if (!currentItem.quantity) newErrors.quantity = "Vui lòng nhập SL";
    if (!currentItem.price) newErrors.price = "Vui lòng nhập giá";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingIndex !== null) {
      const newItems = [...items];

      newItems[editingIndex] = {
        ...currentItem,
        book_id: bookId,
      };

      setItems(newItems);
    } else {
      setItems([
        ...items,
        {
          ...currentItem,
          book_id: bookId,
        },
      ]);
    }

    setCurrentItem({
      book_id: "",
      quantity: "",
      price: "",
    });
    setBookId("");
    setEditingIndex(null);
    setErrors({});
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!supplierId) newErrors.supplier = "Vui lòng chọn nhà cung cấp";

    if (items.length === 0) newErrors.items = "Chưa có sản phẩm nào";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await dispatch(
      createImport({
        supplier_id: supplierId,
        items,
      })
    );
  };

  useEffect(() => {
    if (success) {
      toast.success("Thêm phiếu nhập thành công!");
      dispatch(resetCreateImport());
      dispatch(fetchImports({ page: currentPage, limit: 10 }));
      onClose();
    } else if (error) {
      toast.error(error?.message || error);
    }
  }, [error, success]);

  return (
    <MyModal
      show={isOpen}
      handleClose={onClose}
      title={"Thêm mới phiếu nhập hàng"}
      size="xl"
    >
      <div>
        <div className="mb-3">
          <h6>Nhà cung cấp</h6>
          <Select
            options={optionsSupplier}
            value={optionsSupplier.find((o) => o.value === supplierId)}
            onChange={(selected) => {
              setSupplierId(selected.value);
              setErrors((prev) => ({
                ...prev,
                supplier: "",
              }));
            }}
            placeholder="-- Chọn nhà cung cấp --"
            styles={{
              menuList: (provided) => ({
                ...provided,
                maxHeight: 250,
                overflowY: "auto",
              }),
            }}
          />
          {errors.supplier && (
            <div className="text-danger mt-1">{errors.supplier}</div>
          )}
        </div>

        <div className="border p-3 mb-3">
          <h6>Thêm sản phẩm</h6>

          <Row className="d-flex align-items-center justify-content-between">
            <Col style={{ flex: "1" }}>
              <Select
                options={optionsBook}
                value={optionsBook.find((o) => o.value === bookId) || null}
                onChange={(selected) => {
                  setBookId(selected.value);
                  setErrors((prev) => ({
                    ...prev,
                    book_id: "",
                  }));
                }}
                placeholder="-- Chọn sản phẩm --"
                styles={{
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: 250,
                    overflowY: "auto",
                  }),
                }}
              />
              {errors.book_id && (
                <div className="text-danger mt-1">{errors.book_id}</div>
              )}
            </Col>

            <div style={{ width: "150px" }}>
              <input
                type="text"
                placeholder="Số lượng"
                className="form-control"
                value={currentItem.quantity}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    quantity: e.target.value,
                  });
                  setErrors((prev) => ({
                    ...prev,
                    quantity: "",
                  }));
                }}
              />
              {errors.quantity && (
                <div className="text-danger mt-1">{errors.quantity}</div>
              )}
            </div>

            <div style={{ width: "150px" }}>
              <input
                type="text"
                placeholder="Giá nhập"
                className="form-control"
                value={currentItem.price}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    price: e.target.value,
                  });
                  setErrors((prev) => ({
                    ...prev,
                    price: "",
                  }));
                }}
              />
              {errors.price && (
                <div className="text-danger mt-1">{errors.price}</div>
              )}
            </div>

            <div
              style={{ width: "140px" }}
              className="d-flex justify-content-center"
            >
              <Button
                variant="secondary"
                onClick={() => {
                  setCurrentItem({
                    book_id: "",
                    quantity: "",
                    price: "",
                  });
                  setBookId("");
                  setErrors({});
                  setEditingIndex(null);
                }}
                size="sm"
                className="me-2"
              >
                Huỷ
              </Button>
              <Button
                variant={editingIndex !== null ? "warning" : "primary"}
                onClick={handleAddItem}
                size="sm"
              >
                {editingIndex !== null ? "Lưu" : "Thêm"}
              </Button>
            </div>
          </Row>
        </div>

        {/* Danh sách đã thêm */}
        <div className="mb-3">
          <h6>Chi tiết phiếu nhập</h6>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th className="text-center" style={{ width: "100px" }}>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.book_id}</td>
                  <td>{item.quantity}</td>
                  <td>{Number(item.price).toLocaleString("vi-VN")}</td>
                  <td className="text-center">
                    <MyButtonUpdate
                      onClick={() => {
                        const item = items[index];

                        setCurrentItem({
                          book_id: item.book_id,
                          quantity: item.quantity,
                          price: item.price,
                        });

                        setBookId(item.book_id);
                        setEditingIndex(index);
                      }}
                    />
                    <MyButtonDelete onClick={() => handleRemoveItem(index)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {errors.items && <div className="text-danger mb-2">{errors.items}</div>}
        {items.length > 0 && (
          <div className="text-end mb-2 d-flex align-items-center justify-content-end gap-2">
            <h6 className="mb-0">Tổng tiền:</h6>
            <span>{totalAmount.toLocaleString("vi-VN")} VNĐ</span>
          </div>
        )}
        <div className="text-end">
          <Button className="btn btn-success" onClick={handleSubmit} size="sm">
            Lưu phiếu nhập
          </Button>
        </div>
      </div>
    </MyModal>
  );
};

export default CreateUpdateImportsModal;
