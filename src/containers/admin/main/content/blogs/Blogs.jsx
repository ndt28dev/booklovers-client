import React, { useEffect, useState } from "react";
import MyLayoutAdmin from "../../../../../components/mylayout/MyLayoutAdmin";
import MyButtonCreate from "../../../../../components/button/MyButtonCreate";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Col, Form, Image } from "react-bootstrap";
import MyButtonUpdate from "../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../components/button/MyButtonDelete";
import { formatDate } from "../../../../../utils/format";
import MyDataTable from "../../../../../components/mytable/MyDataTable";
import MyButtonExport from "../../../../../components/button/MyButtonExport";
import API_URL from "../../../../../config/api";
import { fetchAllBlog } from "../../../../../redux/slices/blogSlice";
import ExportBlogModal from "./crud/ExportBlogModal";
import CreateUpdateBlogModal from "./crud/CreateUpdateBlogModal";
import DeleteBlogModal from "./crud/DeleteBlogModal";
import Select from "react-select";

const featuredOptions = [
  { value: "", label: "Tất cả" },
  { value: "1", label: "Nổi bật" },
  { value: "0", label: "Không nổi bật" },
];

const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "DRAFT", label: "Bản nháp" },
  { value: "PUBLISHED", label: "Đã công khai" },
  { value: "ARCHIVED", label: "Đã ẩn" },
];

const Blogs = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenExport, setIsOpenExport] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);

  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");
  const [search, setSearch] = useState("");

  const { listBlog, error, pagination } = useSelector(
    (state) => state.blog.listState
  );

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  useEffect(() => {
    dispatch(
      fetchAllBlog({
        page: currentPage,
        limit: 10,
        is_featured: featured,
        search: search,
        status,
      })
    );
  }, [currentPage, featured, search, status]);

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

  const handleExport = () => {
    setIsOpenExport(true);
  };

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Tiêu đề" },
    { title: "Ngày đăng", style: { width: "10%", textAlign: "center" } },
    { title: "Tác giả", style: { width: "12%" } },
    { title: "Ảnh", style: { width: "15%", textAlign: "center" } },
    { title: "Trạng thái", style: { width: "15%", textAlign: "center" } },
    { title: "Nổi bật", style: { width: "10%", textAlign: "center" } },
    { title: "Thao tác", style: { width: "10%", textAlign: "center" } },
  ];

  const renderRow = (blog, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{blog.id}</td>
      <td className="text-center align-middle">
        {(page - 1) * limit + index + 1}
      </td>
      <td className="align-middle">{blog.title}</td>
      <td className="align-middle text-center">{formatDate(blog.date)}</td>
      <td className="align-middle">{blog.author}</td>
      <td className="text-center align-middle">
        {blog?.image ? (
          <Image
            src={
              blog.image.startsWith("http")
                ? blog.image
                : `${API_URL}/blogs/${blog.image}`
            }
            style={{ width: "150px", height: "80px" }}
          />
        ) : null}
      </td>
      <td className="align-middle text-center">
        {blog.status === "DRAFT" ? (
          <Badge bg="secondary">Bản nháp</Badge>
        ) : blog.status === "PUBLISHED" ? (
          <Badge bg="success">Đã công khai</Badge>
        ) : (
          blog.status === "ARCHIVED" && <Badge bg="warning">Đã ẩn</Badge>
        )}
      </td>
      <td className="align-middle text-center">
        {blog.is_featured === 1 ? (
          <Badge bg="primary">Nổi bật</Badge>
        ) : (
          <Badge bg="secondary">Không</Badge>
        )}
      </td>

      <td className="text-center align-middle">
        <MyButtonUpdate onClick={() => handleUpdate(blog)} />
        <MyButtonDelete onClick={() => handleDelete(blog)} />
      </td>
    </tr>
  );

  return (
    <>
      {isOpen && (
        <CreateUpdateBlogModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={isCheck ? "Cập nhật bài viết" : "Thêm mới bài viết"}
          isCheck={isCheck}
          dataSelected={dataSelected}
          currentPage={currentPage}
        />
      )}
      {isOpenDelete && (
        <DeleteBlogModal
          isOpen={isOpenDelete}
          onClose={() => setIsOpenDelete(false)}
          id={dataSelected?.id}
          currentPage={currentPage}
        />
      )}
      {isOpenExport && (
        <ExportBlogModal
          isOpen={isOpenExport}
          onClose={() => setIsOpenExport(false)}
          list={listBlog}
        />
      )}
      <MyLayoutAdmin title="Danh sách bài viết">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Col className="d-flex align-items-center  gap-3">
            <MyButtonCreate onClick={handleCreate} />
            {/* <MyButtonImport onClick={handleImport} /> */}
            <MyButtonExport onClick={handleExport} />
          </Col>
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            <Select
              options={statusOptions}
              value={statusOptions.find((option) => option.value === status)}
              onChange={(selectedOption) => {
                setStatus(selectedOption.value);
                setCurrentPage(1);
              }}
              placeholder="Chọn trạng thái"
              isClearable={false}
              styles={{
                control: (provided) => ({
                  ...provided,
                  minWidth: 200,
                  height: 36,
                }),
              }}
            />
            <Select
              value={featuredOptions.find(
                (option) => option.value === featured
              )}
              onChange={(selectedOption) => {
                setFeatured(selectedOption.value);
                setCurrentPage(1);
              }}
              options={featuredOptions}
              isClearable={false}
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: 38,
                  width: 150,
                }),
                menu: (provided) => ({ ...provided, zIndex: 9999 }),
              }}
            />

            <div className="d-flex align-items-center">
              <Form.Control
                type="text"
                placeholder="Nhập tiêu đề hoặc tác giả..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ width: "230px" }}
              />
            </div>
          </div>
        </div>
        <div style={{ minHeight: "722px" }}>
          <MyDataTable
            columns={columns}
            data={listBlog}
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

export default Blogs;
