import React, { useEffect, useState } from "react";
import MyLayoutAdmin from "../../../../../components/mylayout/MyLayoutAdmin";
import MyButtonCreate from "../../../../../components/button/MyButtonCreate";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Col, Form, Image } from "react-bootstrap";
import MyButtonUpdate from "../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../components/button/MyButtonDelete";
import { fetchAllUser } from "../../../../../redux/slices/userSlice";
import { formatDate } from "../../../../../utils/format";
import MyDataTable from "../../../../../components/mytable/MyDataTable";
import MyButtonImport from "../../../../../components/button/MyButtonImport";
import MyButtonExport from "../../../../../components/button/MyButtonExport";
import API_URL from "../../../../../config/api";
import { fetchAllBlog } from "../../../../../redux/slices/blogSlice";
import ExportBlogModal from "./crud/ExportBlogModal";
import CreateUpdateBlogModal from "./crud/CreateUpdateBlogModal";
import DeleteBlogModal from "./crud/DeleteBlogModal";

const Blogs = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [isOpenExport, setIsOpenExport] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);

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
      })
    );
  }, [currentPage, featured, search]);

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
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Tiêu đề" },
    { title: "Ngày đăng", style: { width: "10%", textAlign: "center" } },
    { title: "Tác giả", style: { width: "18%" } },
    { title: "Ảnh", style: { width: "15%", textAlign: "center" } },
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
        <Image
          src={
            blog?.image && blog.image?.startsWith("http")
              ? blog.image
              : `${API_URL}/blogs/${blog?.image}`
          }
          style={{ width: "150px", height: "80px" }}
        />
      </td>
      <td className="align-middle text-center">
        {blog.is_featured === 1 ? (
          <Badge bg="success">Nổi bật</Badge>
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
          <div className="d-flex align-items-center" style={{ gap: "20px" }}>
            <Form.Select
              value={featured}
              onChange={(e) => {
                setFeatured(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: "150px", height: "38px" }}
            >
              <option value="">Tất cả</option>
              <option value="1">Nổi bật</option>
              <option value="0">Không nổi bật</option>
            </Form.Select>

            <div className="d-flex align-items-center">
              <Form.Label className="mb-0 me-2 text-nowrap">
                Tìm kiếm
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tiêu đề..."
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
