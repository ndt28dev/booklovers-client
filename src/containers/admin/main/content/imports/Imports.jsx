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

const Imports = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [isOpenExport, setIsOpenExport] = useState(false);
  const [isOpenSupplier, setIsOpenSupplier] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);

  const { data, pagination } = useSelector((state) => state.imports.imports);
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  useEffect(() => {
    dispatch(
      fetchImports({
        page: currentPage,
        limit: 10,
      })
    );
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCreate = () => {
    setIsOpen(true);
    setIsCheck(false);
  };

  const handleImport = () => {
    setIsOpenImport(true);
  };

  const handleExport = () => {
    setIsOpenExport(true);
  };

  const handleSupplier = () => {
    setIsOpenSupplier(true);
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
      <td className="align-middle text-center">{imports.total_amount}</td>
      <td className="align-middle text-center">
        {formatDate(imports.created_at)}
      </td>
      <td className="text-center align-middle">
        <MyButtonEye />
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
      {isOpenSupplier && (
        <Supplier
          isOpen={isOpenSupplier}
          onClose={() => setIsOpenSupplier(false)}
          currentPage={currentPage}
        />
      )}
      <MyLayoutAdmin title="Danh sách nhập hàng">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Col className="d-flex align-items-center  gap-3">
            <MyButtonCreate onClick={handleCreate} />
            {/* <MyButtonImport onClick={handleImport} /> */}
            <MyButtonExport onClick={handleExport} />
          </Col>
          <Button variant="secondary" onClick={handleSupplier} size="sm">
            Quản lý nhà cung cấp
          </Button>
          {/* <div className="d-flex align-items-center" style={{ gap: "20px" }}>
              <Form.Select
                value={discountType}
                onChange={(e) => {
                  setDiscountType(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ width: "170px", height: "38px" }}
              >
                <option value="">Tất cả loại</option>
                <option value="percent">Phần trăm (%)</option>
                <option value="amount">Số tiền (VNĐ)</option>
              </Form.Select>
    
              <div className="d-flex align-items-center">
                <Form.Label className="mb-0 me-2 text-nowrap">Tìm kiếm</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập code hoặc mô tả..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ width: "220px" }}
                />
              </div>
            </div> */}
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
