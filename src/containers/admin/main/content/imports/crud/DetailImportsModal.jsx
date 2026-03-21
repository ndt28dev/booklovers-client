import MyModal from "../../../../../../components/mymodal/MyModal";
import { Table } from "react-bootstrap";
import { formatDate } from "../../../../../../utils/format";

const DetailImportsModal = ({ isOpen, onClose, dataSelected }) => {
  if (!dataSelected) return null;

  return (
    <MyModal
      show={isOpen}
      handleClose={onClose}
      title={`Chi tiết phiếu nhập #${dataSelected.id}`}
      size="lg"
    >
      <div className="mb-3">
        <p>
          <strong>Nhà cung cấp:</strong> {dataSelected.supplier.name}
        </p>
        <p>
          <strong>Ngày tạo:</strong> {formatDate(dataSelected.created_at)}
        </p>
      </div>

      <strong>Chi tiết sản phẩm</strong>
      <Table bordered size="sm">
        <thead>
          <tr>
            <th className="text-center">STT</th>
            <th>Sản phẩm</th>
            <th className="text-center">Số lượng</th>
            <th className="text-center">Giá</th>
            <th className="text-center">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {dataSelected.items && dataSelected.items.length > 0 ? (
            dataSelected.items.map((item, index) => (
              <tr key={item.book_id}>
                <td className="text-center">{index + 1}</td>
                <td>{item.book_name || item.book_id}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-center">
                  {Number(item.price).toLocaleString("vi-VN")}
                </td>
                <td className="text-center">
                  {(Number(item.quantity) * Number(item.price)).toLocaleString(
                    "vi-VN"
                  )}{" "}
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
      <p className="text-end mb-0">
        <strong>Tổng tiền:</strong>{" "}
        {(Number(dataSelected.total_amount) || 0).toLocaleString("vi-VN")} VNĐ
      </p>
    </MyModal>
  );
};

export default DetailImportsModal;
