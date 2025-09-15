import React from "react";
import TableProducts from "./tableProducts/TableProducts";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBtnAddUser = () => {
    // navigate("/admin/users/add");
  };
  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4>Book List</h4>
        <Button variant="primary" onClick={handleBtnAddUser}>
          <i className="bi bi-person-plus-fill me-2"></i>Add new product
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
            <option value="1">All book</option>
            <option value="2">Lập trình</option>
            <option value="3">Tâm lý học</option>
          </Form.Select>

          <div className="d-flex align-items-center">
            <Form.Label className="mb-0 me-2 text-nowrap">Tìm kiếm</Form.Label>
            <Form.Control type="text" placeholder="Nhập từ khóa..." />
          </div>
        </div>
      </div>

      <TableProducts />
    </>
  );
};

export default Products;
