import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBook } from "../../../../../../redux/slices/bookSlice";
import API_URL from "../../../../../../config/api";
const TableProducts = () => {
  const dispatch = useDispatch();

  const { list, error, pagination } = useSelector(
    (state) => state.book.fetchBook
  );

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const total = pagination?.total || 0;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  useEffect(() => {
    dispatch(fetchAllBook({ page: currentPage, limit: 8 }));
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "5%", textAlign: "center" }}>Id</th>
              <th style={{ width: "10%", textAlign: "center" }}>Image</th>
              <th style={{ width: "20%" }}>Name</th>
              <th style={{ width: "20%" }}>Category</th>
              <th style={{ width: "10%" }}>Size</th>
              <th style={{ width: "10%" }}>Price</th>
              <th style={{ width: "15%", textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {list && list.length > 0 ? (
              list.map((book, index) => (
                <tr key={book.id || index}>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    {book.id}
                  </td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <img
                      src={`${API_URL}/uploads/${book.main_image}`}
                      alt={book.name}
                      style={{
                        width: "50px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td style={{ verticalAlign: "middle" }}>{book.name}</td>
                  <td style={{ verticalAlign: "middle" }}>
                    {book.category_name}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>{book.size}</td>
                  <td style={{ verticalAlign: "middle" }}>{book.price}</td>
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
                <td colSpan="7" className="text-center text-muted">
                  {error}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
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
          <Pagination className="justify-content-end">
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

export default TableProducts;
