import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MyDataTable from "../../../../../../../components/mytable/MyDataTable";
import MyLayoutAdmin from "../../../../../../../components/mylayout/MyLayoutAdmin";
import {
  deleteSupplier,
  fetchSuppliers,
  resetDeleteSupplier,
} from "../../../../../../../redux/slices/supplierSlice";
import MyButtonUpdate from "../../../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../../../components/button/MyButtonDelete";
import MyButtonCreate from "../../../../../../../components/button/MyButtonCreate";
import CreateUpdateSupplier from "./crud/CreateUpdateSupplier";

const SettingSupplier = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);

  const { data, pagination } = useSelector((state) => state.supplier.suppliers);
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  const {
    loading: isLoadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.supplier.deleteSupplier);

  useEffect(() => {
    dispatch(
      fetchSuppliers({
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

  const handleUpdate = (dataSelected) => {
    setIsOpen(true);
    setIsCheck(true);
    setDataSelected(dataSelected);
  };

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Nhà cung cấp", style: { width: "20%" } },
    { title: "Email", style: { width: "20%" } },
    { title: "SĐT", style: { width: "10%", textAlign: "center" } },
    { title: "Địa chỉ", style: { width: "30%" } },
    { title: "Thao tác", style: { width: "12%", textAlign: "center" } },
  ];

  const renderRow = (supplier, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{supplier.id}</td>
      <td className="text-center align-middle">
        {(page - 1) * limit + index + 1}
      </td>
      <td className="align-middle">{supplier.name}</td>
      <td className="align-middle">{supplier.email}</td>
      <td className="align-middle text-center">{supplier.phone}</td>
      <td className="align-middle">{supplier.address}</td>
      <td className="text-center align-middle">
        <MyButtonUpdate onClick={() => handleUpdate(supplier)} />
        <MyButtonDelete
          onClick={async () => {
            if (window.confirm("Bạn có chắc muốn xoá?")) {
              await dispatch(deleteSupplier(supplier.id));
            }
          }}
        />
      </td>
    </tr>
  );

  useEffect(() => {
    if (successDelete) {
      toast.success("Xoá nhà cung cấp thành công!");
      dispatch(resetDeleteSupplier());
      dispatch(fetchSuppliers({ page: currentPage, limit: 10 }));
    } else if (errorDelete) {
      toast.error(errorDelete?.message || errorDelete);
    }
  }, [errorDelete, successDelete]);

  return (
    <>
      {isOpen && (
        <CreateUpdateSupplier
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={isCheck ? "Cập nhật nhà cung cấp" : "Thêm mới nhà cung cấp"}
          isCheck={isCheck}
          dataSelected={dataSelected}
          currentPage={currentPage}
        />
      )}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 style={{ color: "#E35765" }}>Danh sách nhà cung cấp</h5>
        <MyButtonCreate onClick={handleCreate} />
      </div>

      <div>
        <MyDataTable
          columns={columns}
          data={data}
          renderRow={renderRow}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};
export default SettingSupplier;
