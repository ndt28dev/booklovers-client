import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUser } from "../../../../../redux/slices/userSlice";
import API_URL from "../../../../../config/api";
import CreateUpdateUserModal from "./crud/CreateUpdateUserModal";
import MyDataTable from "../../../../../components/mytable/MyDataTable";
import MyButtonCreate from "../../../../../components/button/MyButtonCreate";
import MyButtonUpdate from "../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../components/button/MyButtonDelete";
import { Badge, Col, Row } from "react-bootstrap";
import { formatDate } from "../../../../../utils/format";
import MyButtonImport from "../../../../../components/button/MyButtonImport";
import MyButtonExport from "../../../../../components/button/MyButtonExport";
import DeleteUserModal from "./crud/DeleteUserModal";
import Select from "react-select";
import ImportUserModal from "./crud/ImportUserModal";
import ExportUserModal from "./crud/ExportUserModal";
import MyLayoutAdmin from "../../../../../components/mylayout/MyLayoutAdmin";
import { set } from "date-fns";

// Tạo options
const roleOptions = [
  { value: "", label: "Tất cả" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

const genderOptions = [
  { value: "", label: "Tất cả" },
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
];

const Users = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [isOpenExport, setIsOpenExport] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);

  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  const { list, error, pagination } = useSelector((state) => state.user.users);

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  // const total = pagination?.total || 0;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  useEffect(() => {
    dispatch(
      fetchAllUser({
        page: currentPage,
        limit: 10,
        role: role,
        search: search,
        phone: phone,
        gender: gender,
      })
    );
  }, [currentPage, role, search, phone, gender]);

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
    { title: "Họ và tên", style: { width: "20%" } },
    { title: "Email", style: { width: "25%" } },
    { title: "SĐT", style: { width: "10%" } },
    { title: "Ngày sinh", style: { width: "10%" } },
    { title: "Giới tính", style: { width: "8%", textAlign: "center" } },
    { title: "Quyền", style: { width: "100px" } },
    { title: "Thao tác", style: { width: "10%", textAlign: "center" } },
  ];

  const renderRow = (user, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{user.id}</td>
      <td className="text-center align-middle">
        {(page - 1) * limit + index + 1}
      </td>

      <td className="text-center align-middle">
        <Image
          src={
            user?.avatar && user.avatar?.startsWith("http")
              ? user.avatar
              : `${API_URL}/avatar/${user?.avatar}`
          }
          style={{ width: "50px", height: "50px" }}
          roundedCircle
        />
      </td>

      <td className="align-middle">{user.fullname}</td>
      <td className="align-middle">{user.email}</td>
      <td className="align-middle">{user.phone}</td>
      <td className="align-middle">{formatDate(user.birthday)}</td>
      <td className="align-middle" style={{ textAlign: "center" }}>
        {user.gender === "MALE" ? "Nam" : "Nữ"}
      </td>
      <td className="align-middle">
        {user.role === "admin" ? (
          <Badge bg="info">Admin</Badge>
        ) : (
          <Badge bg="secondary">User</Badge>
        )}
      </td>

      <td className="text-center align-middle">
        <MyButtonUpdate onClick={() => handleUpdate(user)} />
        <MyButtonDelete onClick={() => handleDelete(user)} />
      </td>
    </tr>
  );

  return (
    <>
      {isOpen && (
        <CreateUpdateUserModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={isCheck ? "Cập nhật người dùng" : "Thêm mới người dùng"}
          isCheck={isCheck}
          dataSelected={dataSelected}
          currentPage={currentPage}
        />
      )}
      {isOpenDelete && (
        <DeleteUserModal
          isOpen={isOpenDelete}
          onClose={() => setIsOpenDelete(false)}
          id={dataSelected?.id}
          currentPage={currentPage}
        />
      )}
      {isOpenImport && (
        <ImportUserModal
          isOpen={isOpenImport}
          onClose={() => setIsOpenImport(false)}
          currentPage={currentPage}
        />
      )}
      {isOpenExport && (
        <ExportUserModal
          isOpen={isOpenExport}
          onClose={() => setIsOpenExport(false)}
          list={list}
        />
      )}
      <MyLayoutAdmin title="Danh sách người dùng">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Col className="d-flex align-items-center  gap-3">
            <MyButtonCreate onClick={handleCreate} />
            <MyButtonImport onClick={handleImport} />
            <MyButtonExport onClick={handleExport} />
          </Col>
          <div className="d-flex align-items-center gap-2">
            <Select
              value={roleOptions.find((option) => option.value === role)}
              onChange={(selectedOption) => {
                setRole(selectedOption.value);
                setCurrentPage(1);
              }}
              options={roleOptions}
              isClearable={false}
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: 110,
                  minHeight: 36,
                }),
              }}
            />

            <Select
              options={genderOptions}
              value={genderOptions.find((opt) => opt.value === gender) || null}
              onChange={(selectedOption) => {
                setGender(selectedOption ? selectedOption.value : "");
                setCurrentPage(1);
              }}
              isClearable={false}
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: 110,
                  minHeight: 36,
                }),
              }}
            />
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="text"
                placeholder="Tìm theo số điện thoại"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setCurrentPage(1);
                }}
              />
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
            data={list}
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

export default Users;
