import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Col, Image } from "react-bootstrap";
import MyButtonCreate from "../../../../../components/button/MyButtonCreate";
import MyButtonImport from "../../../../../components/button/MyButtonImport";
import MyButtonExport from "../../../../../components/button/MyButtonExport";
import MyLayoutAdmin from "../../../../../components/mylayout/MyLayoutAdmin";
import MyDataTable from "../../../../../components/mytable/MyDataTable";
import MyButtonUpdate from "../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../components/button/MyButtonDelete";
import { fetchAllBook } from "../../../../../redux/slices/bookSlice";
import API_URL from "../../../../../config/api";
import CreateUpdateBookModal from "./crud/CreateUpdateBookModal";
const Products = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [isOpenExport, setIsOpenExport] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);

  const { listBook, error, pagination } = useSelector(
    (state) => state.book.fetchBook
  );

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const total = pagination?.total || 0;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  useEffect(() => {
    dispatch(
      fetchAllBook({
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

  const handleDelete = (dataSelected) => {
    setIsOpenDelete(true);
    setDataSelected(dataSelected);
  };

  const handleImport = () => {
    setIsOpenImport(true);
  };

  const handleExport = () => {
    setIsOpenExport(true);
  };

  const columns = [
    { title: "STT", style: { width: "40px", textAlign: "center" } },
    { title: "Ảnh", style: { width: "100px", textAlign: "center" } },
    { title: "Tên sản phẩm", style: { width: "20%" } },
    { title: "Danh mục", style: { width: "12%" } },
    { title: "Thể loại", style: { width: "20%" } },
    { title: "Giá bán", style: { width: "10%" } },
    { title: "% giảm", style: { width: "7%", textAlign: "center" } },
    { title: "SL", style: { width: "5%", textAlign: "center" } },
    { title: "SLĐB", style: { width: "5%", textAlign: "center" } },
    { title: "Thao tác", style: { width: "10%", textAlign: "center" } },
  ];

  const renderRow = (book, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{book.id}</td>
      <td className="text-center align-middle">
        {(page - 1) * limit + index + 1}
      </td>

      <td className="text-center align-middle">
        <Image
          src={
            book?.main_image && book.main_image?.startsWith("http")
              ? book.main_image
              : `${API_URL}/uploads/${book?.main_image}`
          }
          style={{ width: "40px", height: "60px" }}
        />
      </td>

      <td className="align-middle">{book.name}</td>
      <td className="align-middle">{book.category.name}</td>
      <td className="align-middle">{book.subcategory.name}</td>
      <td className="align-middle">{book.price.toLocaleString("vi-VN")} ₫</td>
      <td className="align-middle text-center">{book.discount}</td>
      <td className="align-middle text-center">{book.quantity}</td>
      <td className="align-middle text-center">{book.sold}</td>
      <td className="text-center align-middle">
        <MyButtonUpdate onClick={() => handleUpdate(book)} />
        <MyButtonDelete onClick={() => handleDelete(book)} />
      </td>
    </tr>
  );

  return (
    <>
      {isOpen && (
        <CreateUpdateBookModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={"Thêm sản phẩm mới"}
          isCheck={isCheck}
          dataSelected={dataSelected}
          currentPage={currentPage}
        />
      )}
      <MyLayoutAdmin title="Danh sách sản phẩm">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Col className="d-flex align-items-center  gap-3">
            <MyButtonCreate onClick={handleCreate} />
            <MyButtonImport onClick={handleImport} />
            <MyButtonExport onClick={handleExport} />
          </Col>
          <div className="d-flex align-items-center" style={{ gap: "20px" }}>
            <Form.Select
              aria-label="Default select example"
              style={{ width: "110px", height: "38px" }}
            >
              <option value="1">Tất cả</option>
              <option value="2">Lập trình</option>
              <option value="3">Tâm lý học</option>
            </Form.Select>
            <div className="d-flex align-items-center">
              <Form.Label className="mb-0 me-2 text-nowrap">
                Tìm kiếm
              </Form.Label>
              <Form.Control type="text" placeholder="Nhập từ khóa..." />
            </div>
          </div>
        </div>
        <div style={{ minHeight: "722px" }}>
          <MyDataTable
            columns={columns}
            data={listBook}
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

export default Products;
