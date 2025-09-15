import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Dropdown,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  Spinner,
  Pagination,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "./StatisticalTopOrder.scss";
import DetailOrderModal from "../../../../../../components/detailorder/DetailOrder";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderById,
  fetchStatistics,
  fetchTopOrders,
} from "../../../../../../redux/slices/admin/statisticSlice";
import { set } from "date-fns";

const StatisticalTopOrder = () => {
  const dispatch = useDispatch();
  const { currentOrder } = useSelector((state) => state.statistics.orderDetail);
  const {
    topOrders: data,
    loading,
    error,
  } = useSelector((state) => state.statistics.toporder);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [selectedOption, setSelectedOption] = useState("Nổi bật");

  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const now = new Date();

    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    setStartDate(start);
    setEndDate(end);

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    dispatch(
      fetchTopOrders({
        startDate,
        endDate,
        sortType: selectedOption === "Nổi bật" ? "top" : "latest",
      })
    );
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleRefresh = () => {
    const now = new Date();

    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    setCurrentPage(1);
    setStartDate(start);
    setEndDate(end);
    setSelectedOption("Nổi bật");
    dispatch(
      fetchTopOrders({
        startDate,
        endDate,
        sortType: "top",
      })
    );
  };

  const formatDate = (date, isEnd = false) => {
    if (!date) return null;
    const d = new Date(date);

    if (isEnd) {
      d.setHours(23, 59, 59, 999);
    } else {
      d.setHours(0, 0, 0, 0);
    }

    return d.toISOString().split("T")[0];
  };

  const handleFilter = (start, end) => {
    dispatch(
      fetchTopOrders({
        startDate: start,
        endDate: end,
        sortType: selectedOption === "Nổi bật" ? "top" : "latest",
      })
    );
  };

  const handleSelect = (option) => {
    setSelectedOption(option);

    const start = formatDate(startDate);
    const end = formatDate(endDate, true);

    dispatch(
      fetchTopOrders({
        startDate: start,
        endDate: end,
        sortType: option === "Nổi bật" ? "top" : "latest",
      })
    );
  };

  const handleViewDetail = (order) => {
    dispatch(fetchOrderById(order.id));
    setShowDetail(true);
  };

  const setEndOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };

  return (
    <>
      {showDetail && (
        <DetailOrderModal
          show={showDetail}
          handleClose={() => setShowDetail(false)}
          order={currentOrder}
        />
      )}
      <Card
        style={{
          border: "none",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
      >
        <Card.Body>
          <Row className="d-flex  mb-3 align-items-center">
            <Col
              style={{ maxWidth: "220px" }}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="d-flex  align-items-center">
                <h5 className="me-2 mb-0" style={{ color: "#E35765" }}>
                  Đơn hàng
                </h5>
                <span style={{ color: "#777" }}>| {selectedOption}</span>
              </div>
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="div"
                  bsPrefix="custom-toggle"
                  id="dropdown-custom"
                  style={{ color: "#777", cursor: "pointer" }}
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-auto" style={{ minWidth: "100px" }}>
                  <Dropdown.Item onClick={() => handleSelect("Nổi bật")}>
                    Nổi bật
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSelect("Mới nhất")}>
                    Mới nhất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs className="d-flex justify-content-end align-items-center">
              {/* <InputGroup className="me-2" style={{ width: "300px" }}>
                <Form.Control
                  placeholder="Nhập dữ liệu tìm kiếm"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </InputGroup> */}
              <Form.Group className="d-flex align-items-center">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    handleFilter(date, endDate);
                    setCurrentPage(1);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Từ ngày"
                  className="form-control datepicker-input"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  style={{ width: "100px" }}
                />

                <div className="me-2"></div>

                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    const endOfDay = setEndOfDay(date);
                    setEndDate(endOfDay);
                    handleFilter(startDate, endOfDay);
                    setCurrentPage(1);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Đến ngày"
                  className="form-control datepicker-input"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  style={{ width: "100px" }}
                />
              </Form.Group>
              <Button
                className="ms-2"
                variant="outline-primary"
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <i className="bi bi-arrow-clockwise"></i>
                )}
              </Button>
            </Col>
          </Row>
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>Mã đơn hàng</th>
                <th>Họ và tên</th>
                <th>Địa chỉ giao hàng</th>
                <th>Phương thức thanh toán</th>
                <th className="text-center">Ngày đặt</th>
                <th className="text-center">Tổng tiền</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{order.order_code}</td>
                  <td>{order.fullname}</td>
                  <td>{order.location}</td>
                  <td>
                    {order.payment_method === "cod"
                      ? "Thanh toán bằng tiền mặt"
                      : "Thanh toán qua VNPAY"}
                  </td>
                  <td className="text-center">
                    {(() => {
                      const date = new Date(order.order_date);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const year = date.getFullYear();
                      return `${day}-${month}-${year}`;
                    })()}
                  </td>
                  <td className="text-center">
                    {Number(order.total_price).toLocaleString("vi-VN")}
                  </td>
                  <td className="text-center">
                    <Button
                      className="me-2"
                      variant="success"
                      onClick={() => handleViewDetail(order)}
                    >
                      <i className="bi bi-eye"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-end">
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />

            {Array.from(
              { length: Math.ceil(data.length / itemsPerPage) },
              (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              )
            )}

            <Pagination.Next
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(data.length / itemsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
            />
            <Pagination.Last
              onClick={() =>
                setCurrentPage(Math.ceil(data.length / itemsPerPage))
              }
              disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
            />
          </Pagination>
        </Card.Body>
      </Card>
    </>
  );
};

export default StatisticalTopOrder;
