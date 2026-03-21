import MyModal from "../../../../../../components/mymodal/MyModal";
import { Table, Button } from "react-bootstrap";
import { useRef } from "react";

const PrintImportsModal = ({ isOpen, onClose, dataSelected }) => {
  const printRef = useRef();

  if (!dataSelected) return null;

  const { id, supplier_name, total_amount, created_at, items } = dataSelected;

  const handlePrint = () => {
    // Mở cửa sổ in
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload lại trang để render lại React
  };

  return (
    <MyModal
      show={isOpen}
      handleClose={onClose}
      title={`In phiếu nhập #${id}`}
      size="lg"
    >
      <div ref={printRef}>
        <h5 className="mb-3">Phiếu nhập hàng</h5>
        <p>
          <strong>Nhà cung cấp:</strong> {supplier_name}
        </p>
        <p>
          <strong>Ngày tạo:</strong> {new Date(created_at).toLocaleString()}
        </p>

        <Table bordered>
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.book_id}>
                  <td>{index + 1}</td>
                  <td>{item.book_name || item.book_id}</td>
                  <td>{item.quantity}</td>
                  <td>{Number(item.price).toLocaleString("vi-VN")} ₫</td>
                  <td>
                    {(
                      Number(item.quantity) * Number(item.price)
                    ).toLocaleString("vi-VN")}{" "}
                    ₫
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  Không có sản phẩm
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <p className="text-end">
          <strong>Tổng tiền: </strong>
          {(Number(total_amount) || 0).toLocaleString("vi-VN")} ₫
        </p>
      </div>

      <div className="text-end">
        <Button variant="primary" onClick={handlePrint}>
          In phiếu
        </Button>
      </div>
    </MyModal>
  );
};

export default PrintImportsModal;
