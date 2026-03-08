import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";

const MyDataTable = ({
  columns = [],
  data = [],
  renderRow,
  pagination,
  currentPage,
  onPageChange,
}) => {
  const totalPages = pagination?.totalPages || 0;
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const total = pagination?.total || 10;

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={col.style}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between">
        {pagination && (
          <div>
            <span>
              Đang hiển thị {total === 0 ? 0 : (page - 1) * limit + 1} từ{" "}
              {Math.min(page * limit, total)} đến {total} kết quả
            </span>
          </div>
        )}
        {totalPages > 1 && (
          <Pagination className="justify-content-end">
            <Pagination.Prev
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {[...Array(totalPages).keys()].map((num) => (
              <Pagination.Item
                key={num}
                active={num + 1 === currentPage}
                onClick={() => onPageChange(num + 1)}
              >
                {num + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        )}
      </div>
    </>
  );
};

export default MyDataTable;
