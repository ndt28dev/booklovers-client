import { useState, useEffect } from "react";
import MyModal from "../../../../../../components/mymodal/MyModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuppliers } from "../../../../../../redux/slices/supplierSlice";
import { createImport } from "../../../../../../redux/slices/importSlice";

const CreateUpdateImportsModal = ({ isOpen, onClose, currentPage }) => {
  const dispatch = useDispatch();

  const { data: suppliers } = useSelector((state) => state.supplier.suppliers);

  // state
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);

  const [currentItem, setCurrentItem] = useState({
    book_id: "",
    quantity: "",
    price: "",
  });

  // load supplier
  useEffect(() => {
    dispatch(fetchSuppliers());
  }, []);

  // thêm item vào danh sách
  const handleAddItem = () => {
    if (!currentItem.book_id || !currentItem.quantity || !currentItem.price) {
      return alert("Vui lòng nhập đầy đủ thông tin");
    }

    setItems([...items, currentItem]);

    setCurrentItem({
      book_id: "",
      quantity: "",
      price: "",
    });
  };

  // xoá item
  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // submit
  const handleSubmit = async () => {
    if (!supplierId) return alert("Chọn nhà cung cấp");
    if (items.length === 0) return alert("Chưa có sản phẩm");

    await dispatch(
      createImport({
        supplier_id: supplierId,
        items,
      })
    );

    onClose();
  };

  return (
    <MyModal
      show={isOpen}
      handleClose={onClose}
      title={"Thêm mới phiếu nhập hàng"}
      size="lg"
    >
      <div>
        <div className="mb-3">
          <label>Nhà cung cấp</label>
          <select
            className="form-control"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">-- Chọn nhà cung cấp --</option>
            {suppliers?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Thêm sản phẩm */}
        <div className="border p-3 mb-3">
          <h6>Thêm sản phẩm</h6>

          <div className="row">
            <div className="col">
              <input
                type="number"
                placeholder="Book ID"
                className="form-control"
                value={currentItem.book_id}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    book_id: e.target.value,
                  })
                }
              />
            </div>

            <div className="col">
              <input
                type="number"
                placeholder="Số lượng"
                className="form-control"
                value={currentItem.quantity}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    quantity: e.target.value,
                  })
                }
              />
            </div>

            <div className="col">
              <input
                type="number"
                placeholder="Giá nhập"
                className="form-control"
                value={currentItem.price}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    price: e.target.value,
                  })
                }
              />
            </div>

            <div className="col">
              <button className="btn btn-primary" onClick={handleAddItem}>
                Thêm
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách đã thêm */}
        <div className="mb-3">
          <h6>Chi tiết phiếu nhập</h6>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.book_id}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit */}
        <div className="text-end">
          <button className="btn btn-success" onClick={handleSubmit}>
            Lưu phiếu nhập
          </button>
        </div>
      </div>
    </MyModal>
  );
};

export default CreateUpdateImportsModal;
