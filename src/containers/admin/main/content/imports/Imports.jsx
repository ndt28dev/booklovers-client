import { useDispatch, useSelector } from "react-redux";
import MyLayoutAdmin from "../../../../../components/mylayout/MyLayoutAdmin";
import MyDataTable from "../../../../../components/mytable/MyDataTable";
import { useEffect, useState } from "react";
import { fetchImports } from "../../../../../redux/slices/importSlice";
import { formatDate } from "../../../../../utils/format";
import MyButtonEye from "../../../../../components/button/MyButtonEye";
import { Button, Col, Form } from "react-bootstrap";
import MyButtonCreate from "../../../../../components/button/MyButtonCreate";
import MyButtonImport from "../../../../../components/button/MyButtonImport";
import MyButtonExport from "../../../../../components/button/MyButtonExport";
import CreateUpdateImportsModal from "./crud/CreateUpdateImportsModal";
import Supplier from "./supplier/Supplier";
import MyButtonPrint from "../../../../../components/button/MyButtonPrint";
import DetailImportsModal from "./crud/DetailImportsModal";
import API_URL from "../../../../../config/api";
import { fetchSuppliersAll } from "../../../../../redux/slices/supplierSlice";

const Imports = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);

  const { data: suppliers } = useSelector(
    (state) => state.supplier.suppliersAll
  );

  // data search
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, pagination } = useSelector((state) => state.imports.imports);
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSupplierId, startDate, endDate]);

  useEffect(() => {
    dispatch(
      fetchImports({
        page: currentPage,
        limit,
        supplierId: selectedSupplierId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })
    );
    dispatch(fetchSuppliersAll());
  }, [currentPage, selectedSupplierId, startDate, endDate]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCreate = () => {
    setIsOpen(true);
    setIsCheck(false);
  };

  const handleDetail = (dataSelected) => {
    setIsOpenDetail(true);
    setDataSelected(dataSelected);
  };

  const handlePrint = (dataSelected) => {
    if (!dataSelected) return;

    const logoUrl = `${API_URL}/logo/logo-1.webp`;
    const printWindow = window.open("", "_blank");
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

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Nhà cung cấp" },
    { title: "Tổng tiền", style: { width: "20%", textAlign: "center" } },
    { title: "Ngày nhập", style: { width: "20%", textAlign: "center" } },
    { title: "Thao tác", style: { width: "10%", textAlign: "center" } },
  ];

  const renderRow = (imports, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{imports.id}</td>
      <td className="text-center align-middle">
        {(page - 1) * limit + index + 1}
      </td>
      <td className="align-middle">{imports.supplier.name}</td>
      <td className="align-middle text-center">
        {imports.total_amount.toLocaleString("vi-VN")}
      </td>
      <td className="align-middle text-center">
        {formatDate(imports.created_at)}
      </td>
      <td className="text-center align-middle">
        <MyButtonEye onClick={() => handleDetail(imports)} />
        <MyButtonPrint onClick={() => handlePrint(imports)} />
      </td>
    </tr>
  );

  return (
    <>
      {isOpen && (
        <CreateUpdateImportsModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          currentPage={currentPage}
        />
      )}
      {isOpenDetail && (
        <DetailImportsModal
          isOpen={isOpenDetail}
          onClose={() => setIsOpenDetail(false)}
          dataSelected={dataSelected}
        />
      )}
      <MyLayoutAdmin title="Danh sách nhập hàng">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Col className="d-flex align-items-center  gap-3">
            <MyButtonCreate onClick={handleCreate} />
          </Col>
          <div className="d-flex gap-2 mb-2">
            <Form.Select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              style={{ width: "200px" }}
            >
              <option value="">Tất cả nhà cung cấp</option>
              {suppliers?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control
              type="date"
              placeholder="Từ ngày"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: "150px" }}
            />
            <Form.Control
              type="date"
              placeholder="Đến ngày"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: "150px" }}
            />
          </div>
        </div>
        <div style={{ minHeight: "722px" }}>
          <MyDataTable
            columns={columns}
            data={data}
            renderRow={renderRow}
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </MyLayoutAdmin>
    </>
  );
};
export default Imports;
