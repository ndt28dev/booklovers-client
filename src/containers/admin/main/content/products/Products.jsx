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
import DeleteBookModal from "./crud/DeleteBookModal";
import { fetchCategoriesWithSub } from "../../../../../redux/slices/categorySlice";
import ExportBookModal from "./crud/ExportBookModal";
import Select from "react-select";

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

  const { categories: categoriesAll } = useSelector((state) => state.category);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchCategoriesWithSub());
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllBook({
        page: currentPage,
        limit: 10,
        search: search,
        categoryId: categoryFilter,
        subcategoryId: subcategoryFilter,
      })
    );
  }, [currentPage, search, categoryFilter, subcategoryFilter]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setCategoryFilter(value);
    setSubcategoryFilter("");

    const selectedCategory = categoriesAll.find(
      (cat) => cat.id === Number(value)
    );

    setSubcategories(selectedCategory?.subcategories || []);
  };

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
    { title: "Giá bán", style: { width: "10%", textAlign: "center" } },
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
      <td className="align-middle text-center">
        {book.price.toLocaleString("vi-VN")}
      </td>
      <td className="align-middle text-center">{book.discount}</td>
      <td className="align-middle text-center">{book.quantity}</td>
      <td className="align-middle text-center">{book.sold}</td>
      <td className="text-center align-middle">
        <MyButtonUpdate onClick={() => handleUpdate(book)} />
        <MyButtonDelete onClick={() => handleDelete(book)} />
      </td>
    </tr>
  );

  const categoryOptions = [
    { value: "", label: "Tất cả danh mục" },
    ...categoriesAll.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  const subcategoryOptions = [
    { value: "", label: "Tất cả thể loại" },
    ...subcategories.map((sub) => ({
      value: sub.id,
      label: sub.name,
    })),
  ];

  return (
    <>
      {isOpen && (
        <CreateUpdateBookModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={isCheck ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
          isCheck={isCheck}
          dataSelected={dataSelected}
          currentPage={currentPage}
        />
      )}
      {isOpenDelete && (
        <DeleteBookModal
          isOpen={isOpenDelete}
          onClose={() => setIsOpenDelete(false)}
          id={dataSelected?.id}
          currentPage={currentPage}
        />
      )}
      {isOpenExport && (
        <ExportBookModal
          isOpen={isOpenExport}
          onClose={() => setIsOpenExport(false)}
          list={listBook}
        />
      )}
      <MyLayoutAdmin title="Danh sách sản phẩm">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Col className="d-flex align-items-center  gap-3">
            <MyButtonCreate onClick={handleCreate} />
            {/* <MyButtonImport onClick={handleImport} /> */}
            <MyButtonExport onClick={handleExport} />
          </Col>
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <Select
                value={categoryOptions.find((o) => o.value === categoryFilter)}
                onChange={(selected) => {
                  handleCategoryChange({ target: { value: selected.value } });
                }}
                options={categoryOptions}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: 38,
                    width: 220,
                  }),
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
              />

              <Select
                value={subcategoryOptions.find(
                  (o) => o.value === subcategoryFilter
                )}
                onChange={(selected) => setSubcategoryFilter(selected.value)}
                options={subcategoryOptions}
                isDisabled={!categoryFilter}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: 38,
                    width: 220,
                  }),
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
              />
            </div>
            <div className="d-flex align-items-center">
              <Form.Control
                type="text"
                placeholder="Nhập từ khóa..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
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
