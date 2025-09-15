import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";
import Pagination from "react-bootstrap/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUser } from "../../../../../redux/slices/userSlice";
import API_URL from "../../../../../config/api";

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list, error, pagination } = useSelector((state) => state.user.users);

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const total = pagination?.total || 0;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  useEffect(() => {
    dispatch(fetchAllUser({ page: currentPage, limit: 10 }));
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleBtnAddUser = () => {
    navigate("/admin/users/add");
  };
  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4>User List</h4>
        <Button variant="primary" onClick={handleBtnAddUser}>
          <i className="bi bi-person-plus-fill me-2"></i>Add new user
        </Button>
      </div>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center ">
          <span>Show</span>
          <Form.Select
            aria-label="Default select example"
            style={{ width: "68px", height: "38px" }}
            className="ms-2 me-2"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </Form.Select>
          <span>row</span>
        </div>
        <div className="d-flex align-items-center" style={{ gap: "20px" }}>
          <Form.Select
            aria-label="Default select example"
            style={{ width: "110px", height: "38px" }}
          >
            <option value="1">All User</option>
            <option value="2">Admin</option>
            <option value="3">User</option>
          </Form.Select>

          <div className="d-flex align-items-center">
            <Form.Label className="mb-0 me-2 text-nowrap">Tìm kiếm</Form.Label>
            <Form.Control type="text" placeholder="Nhập từ khóa..." />
          </div>
        </div>
      </div>

      <div style={{ minHeight: "722px" }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "5%", textAlign: "center" }}>Id</th>
              <th style={{ width: "10%", textAlign: "center" }}>Avatar</th>
              <th style={{ width: "25%" }}>Fullname</th>
              <th style={{ width: "25%" }}>Email</th>
              <th style={{ width: "15%" }}>Role</th>
              <th style={{ width: "15%", textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {list && list.length > 0 ? (
              list.map((user, index) => (
                <tr key={index}>
                  <td
                    style={{
                      width: "5%",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    {user.id}
                  </td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
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
                  <td style={{ verticalAlign: "middle" }}>{user.fullname}</td>
                  <td style={{ verticalAlign: "middle" }}>{user.email}</td>
                  <td style={{ verticalAlign: "middle" }}>{user.role}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <Button className="me-2" variant="success">
                      <i className="bi bi-eye"></i>
                    </Button>
                    <Button className="me-2" variant="warning">
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button variant="danger">
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  {error}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <span>
            Showing {total === 0 ? 0 : (page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, total)} of {total} results
          </span>
        </div>
        {totalPages < 1 && (
          <div className="d-flex justify-content-end">
            <Pagination>...</Pagination>
          </div>
        )}
        {totalPages > 1 && (
          <Pagination
            className={`justify-content-end ${
              isTheme ? "pagination-dark" : "pagination-light"
            }`}
          >
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {[...Array(totalPages).keys()].map((num) => (
              <Pagination.Item
                key={num + 1}
                active={num + 1 === currentPage}
                onClick={() => handlePageChange(num + 1)}
              >
                {num + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        )}
      </div>
    </>
  );
};

export default Users;
