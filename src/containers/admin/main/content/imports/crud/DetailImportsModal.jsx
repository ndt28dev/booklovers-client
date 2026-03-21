import MyModal from "../../../../../../components/mymodal/MyModal";
import { Button, Table } from "react-bootstrap";
import { formatDate } from "../../../../../../utils/format";
import { useRef } from "react";
import API_URL from "../../../../../../config/api";

const DetailImportsModal = ({ isOpen, onClose, dataSelected }) => {
  const printRef = useRef();

  const handlePrint = () => {
    if (!printRef.current) return;

    const logoUrl = `${API_URL}/logo/logo-1.webp`;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Phieu nhap hang #${dataSelected.id}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .invoice-header { text-align: center; margin-bottom: 30px; }
            .invoice-header h2 { margin-bottom: 0; }
            .invoice-header p { margin: 0; }
            .table th, .table td { vertical-align: middle !important; }
            .total-row { font-weight: bold; font-size: 1.1rem; }
            .footer { margin-top: 50px; text-align: right; font-size: 0.9rem; }
            .logo { width: 120px; height: auto; margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <img class="logo" src="${logoUrl}" alt="Logo" />
            <h2>PHIẾU NHẬP HÀNG</h2>
            <p>Mã phiếu: #${dataSelected.id}</p>
            <p>Ngày: ${formatDate(dataSelected.created_at)}</p>
            <p>Nhà cung cấp: ${dataSelected.supplier.name}</p>
          </div>

          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="text-center">STT</th>
                <th>Sản phẩm</th>
                <th class="text-center">Số lượng</th>
                <th class="text-center">Đơn giá</th>
                <th class="text-center">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${
                dataSelected.items && dataSelected.items.length > 0
                  ? dataSelected.items
                      .map(
                        (item, index) => `
                        <tr>
                          <td class="text-center">${index + 1}</td>
                          <td>${item.book_name || item.book_id}</td>
                          <td class="text-center">${item.quantity}</td>
                          <td class="text-center">${Number(
                            item.price
                          ).toLocaleString("vi-VN")}</td>
                          <td class="text-center">${(
                            Number(item.quantity) * Number(item.price)
                          ).toLocaleString("vi-VN")}</td>
                        </tr>
                      `
                      )
                      .join("")
                  : `<tr><td colspan="5" class="text-center">Không có sản phẩm</td></tr>`
              }
              <tr class="total-row">
                <td colspan="4" class="text-end">Tổng tiền:</td>
                <td class="text-center">${(
                  Number(dataSelected.total_amount) || 0
                ).toLocaleString("vi-VN")} VNĐ</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p>Người lập phiếu: ____________________</p>
            <p>Người nhận: ____________________</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (!dataSelected) return null;

  return (
    <MyModal
      show={isOpen}
      handleClose={onClose}
      title={`Chi tiết phiếu nhập #${dataSelected.id}`}
      size="lg"
    >
      <div ref={printRef}>
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
                    {(
                      Number(item.quantity) * Number(item.price)
                    ).toLocaleString("vi-VN")}{" "}
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
        <p className="text-end mb-2">
          <strong>Tổng tiền:</strong>{" "}
          {(Number(dataSelected.total_amount) || 0).toLocaleString("vi-VN")} VNĐ
        </p>
      </div>
      <div className="text-end">
        <Button variant="secondary" onClick={handlePrint} size="sm">
          <i className="bi bi-printer me-2"></i>
          In phiếu
        </Button>
      </div>
    </MyModal>
  );
};

export default DetailImportsModal;
