import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
  Pagination,
  Badge,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "./Orders.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  updateOrderStatus,
  resetUpdateStatus,
} from "../../../../../redux/slices/admin/orderSlice";
import { fetchOrderById } from "../../../../../redux/slices/admin/statisticSlice";
import DetailOrderModal from "../../../../../components/detailorder/DetailOrder";
import StatusModal from "../../../../../components/statusmodal/StatusModal";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Orders = () => {
  const dispatch = useDispatch();
  const { list, error } = useSelector((state) => state.adminOrder.listOrders);
  const { currentOrder } = useSelector((state) => state.statistics.orderDetail);
  const { success, error: errorUp } = useSelector(
    (state) => state.adminOrder.updateStatus
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const printRef = useRef();

  useEffect(() => {
    if (resetting) return;

    dispatch(
      fetchOrders({
        page,
        limit,
        search,
        paymentMethod,
        status,
        priceFilter,
        fromDate: fromDate ? formatDateTime(fromDate, true) : "",
        toDate: toDate ? formatDateTime(toDate, false) : "",
      })
    );
  }, [
    dispatch,
    page,
    search,
    paymentMethod,
    status,
    priceFilter,
    fromDate,
    toDate,
    resetting,
    limit,
  ]);

  useEffect(() => {
    if (success) {
      toast.success("Cập nhật trạng thái thành công!");
      dispatch(fetchOrders({ page }));
      dispatch(resetUpdateStatus());
    }

    if (errorUp) {
      toast.error(error);
      dispatch(resetUpdateStatus());
    }
  }, [success, errorUp]);

  const handleResetAndLoad = () => {
    setResetting(true);
    setLoading(true);

    setTimeout(() => {
      setSearch("");
      setPaymentMethod("");
      setStatus("");
      setPriceFilter("");
      setFromDate(null);
      setToDate(null);
      setPage(1);

      setLoading(false);
      setResetting(false);
    }, 1200);
  };

  const handleViewDetail = (order) => {
    setShowDetailModal(true);
    dispatch(fetchOrderById(order.id));
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedOrder || !newStatus) return;
    dispatch(
      updateOrderStatus({ orderId: selectedOrder.id, status: newStatus })
    );
    setShowStatusModal(false);
  };

  const handleCancelOrder = (orderId) => {
    dispatch(updateOrderStatus({ orderId, status: "cancelled" }));
  };

  const handleReturnOrder = (orderId) => {
    dispatch(updateOrderStatus({ orderId, status: "returned" }));
  };

  const handleExportPDF = async () => {
    try {
      const response = await dispatch(
        fetchOrders({
          page: 1,
          limit: 100000,
          search,
          paymentMethod,
          status,
          priceFilter,
          fromDate: fromDate ? formatDateTime(fromDate, true) : "",
          toDate: toDate ? formatDateTime(toDate, false) : "",
        })
      ).unwrap();

      const ordersData = response?.orders || [];

      if (ordersData.length === 0) {
        toast.info("Không có dữ liệu để xuất PDF");
        return;
      }

      const content = document.createElement("div");
      content.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px;">Danh sách đơn hàng</h3>
        <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; font-size: 12px;">
          <thead>
            <tr>
              <th>#</th>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            ${ordersData
              .map(
                (order, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${order.order_code}</td>
                  <td>${order.fullname || ""}</td>
                  <td>${new Date(order.order_date).toLocaleDateString(
                    "vi-VN"
                  )}</td>
                  <td>${getLabel(order.status)}</td>
                  <td>${
                    order.payment_method === "cod"
                      ? "Thanh toán bằng tiền mặt"
                      : "Thanh toán qua VNPAY"
                  }</td>
                  <td>${order.total_price?.toLocaleString("vi-VN")}₫</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      `;

      html2pdf()
        .set({
          margin: 10,
          filename: `don-hang-${Date.now()}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(content)
        .save();
    } catch (error) {
      console.error("Export PDF Error:", error);
      toast.error("Xuất PDF thất bại!");
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await dispatch(
        fetchOrders({
          page: 1,
          limit: 100000,
          search,
          paymentMethod,
          status,
          priceFilter,
          fromDate: fromDate ? formatDateTime(fromDate, true) : "",
          toDate: toDate ? formatDateTime(toDate, false) : "",
        })
      ).unwrap();

      const ordersData = response?.orders || [];

      if (ordersData.length === 0) {
        toast.info("Không có dữ liệu để xuất Excel");
        return;
      }

      const excelData = ordersData.map((order, index) => ({
        STT: index + 1,
        "Mã đơn": order.order_code,
        "Khách hàng": order.fullname || "",
        "Ngày đặt": new Date(order.order_date).toLocaleDateString("vi-VN"),
        "Trạng thái": getLabel(order.status),
        "Thanh toán":
          order.payment_method === "cod"
            ? "Thanh toán bằng tiền mặt"
            : "Thanh toán qua VNPAY",
        "Tổng tiền": order.total_price?.toLocaleString("vi-VN") + "₫",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "DonHang");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, `don-hang-${Date.now()}.xlsx`);
    } catch (error) {
      console.error("Export Excel Error:", error);
      toast.error("Xuất Excel thất bại!");
    }
  };

  const getLabel = (key) => {
    switch (key) {
      case "pending":
        return "Đang chờ xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "shipping":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã huỷ";
      case "returned":
        return "Đã trả hàng";
      default:
        return key;
    }
  };

  const statusMap = {
    pending: { text: "Đang chờ xử lý", variant: "warning" },
    confirmed: { text: "Đã xác nhận", variant: "info" },
    shipping: { text: "Đang giao hàng", variant: "primary" },
    delivered: { text: "Đã giao hàng", variant: "success" },
    cancelled: { text: "Đã huỷ", variant: "danger" },
    returned: { text: "Đã trả hàng", variant: "secondary" },
  };

  const formatDateTime = (date, isStart) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const time = isStart ? "00:00:00" : "23:59:59";
    return `${year}-${month}-${day} ${time}`;
  };

  return (
    <>
      <StatusModal
        show={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onSubmit={handleUpdateStatus}
        order={selectedOrder}
      />
      {showDetailModal && (
        <DetailOrderModal
          show={showDetailModal}
          handleClose={() => setShowDetailModal(false)}
          order={currentOrder}
        />
      )}
      <Row className="justify-content-between mb-2">
        <Col xs="auto">
          <h4 className="fw-bold" style={{ color: "#E35765" }}>
            Đơn hàng
          </h4>
        </Col>
        <Col>
          <Row className="justify-content-end ">
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Tìm tên, mã đơn hàng, địa chỉ"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </Col>
            <Col xs="auto">
              <Form.Select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Phương thức thanh toán</option>
                <option value="cod">Thanh toán bằng tiền mặt</option>
                <option value="vnpay">Thanh toán qua VNPAY</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Trạng thái đơn</option>
                <option value="pending">Đang chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipping">Đang giao hàng</option>
                <option value="delivered">Đã giao hàng</option>
                <option value="cancelled">Đã huỷ</option>
                <option value="returned">Đã trả hàng</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={priceFilter}
                onChange={(e) => {
                  setPriceFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Giá tiền</option>
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
                <option value="lt500">Dưới 500.000đ</option>
                <option value="500to1000">Từ 500.000đ - 1.000.000đ</option>
                <option value="gt1000">Trên 1.000.000đ</option>
              </Form.Select>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mb-2 justify-content-between align-items-center">
        {/* Bên trái: Show X rows */}
        <Col xs="auto">
          <div className="d-flex align-items-center">
            <span>Hiển thị</span>
            <Form.Select
              aria-label="Select rows per page"
              style={{ width: "68px", height: "38px" }}
              className="ms-2 me-2"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </Form.Select>
            <span>hàng</span>
          </div>
        </Col>

        {/* Bên phải: Nút xuất file và lọc ngày */}
        <Col className="d-flex flex-wrap gap-2 justify-content-end" xs="auto">
          <Button variant="success" onClick={handleExportPDF}>
            <i className="bi bi-file-earmark-pdf me-1"></i>
            Xuất PDF
          </Button>

          <Button variant="primary" onClick={handleExportExcel}>
            <i className="bi bi-file-earmark-excel me-1"></i>
            Xuất Excel
          </Button>

          <DatePicker
            selected={fromDate}
            onChange={(date) => {
              setFromDate(date);
              setPage(1);
            }}
            className="form-control custom-datepicker"
            dateFormat="dd-MM-yyyy"
            placeholderText="Từ ngày"
          />
          <DatePicker
            selected={toDate}
            onChange={(date) => {
              setToDate(date);
              setPage(1);
            }}
            className="form-control custom-datepicker"
            dateFormat="dd-MM-yyyy"
            placeholderText="Đến ngày"
          />
          <Button
            variant="outline-primary"
            onClick={handleResetAndLoad}
            disabled={loading}
            style={{ width: "42px", height: "38px" }}
          >
            {loading ? (
              <span className="d-flex align-items-center gap-2">
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </span>
            ) : (
              <i className="bi bi-arrow-clockwise"></i>
            )}
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive className="table-orders">
        <thead>
          <tr className="align-middle">
            <th className="text-center">#</th>
            <th className="text-center">Mã đơn hàng</th>
            <th>Họ và tên</th>
            <th>Địa chỉ giao hàng</th>
            <th>Phương thức thanh toán</th>
            <th className="text-center">Ngày đặt</th>
            <th className="text-center">Trạng thái đơn</th>
            <th className="text-center">Tổng tiền</th>
            <th className="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {(list?.orders || []).map((order, idx) => (
            <tr key={order.id} className="align-middle">
              <td className="text-center">{(page - 1) * limit + idx + 1}</td>
              <td className="text-center">{order.order_code}</td>
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
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const year = date.getFullYear();
                  return `${day}-${month}-${year}`;
                })()}
              </td>
              <td className="text-center">
                <Badge bg={statusMap[order.status]?.variant || "light"}>
                  {statusMap[order.status]?.text || order.status}
                </Badge>
              </td>
              <td className="text-center">
                {Number(order.total_price).toLocaleString("vi-VN")}
              </td>
              <td className="">
                <Button
                  className="me-2"
                  variant="success"
                  onClick={() => handleViewDetail(order)}
                >
                  <i className="bi bi-eye"></i>
                </Button>
                {order.status !== "delivered" &&
                  order.status !== "cancelled" &&
                  order.status !== "returned" && (
                    <Button
                      className="me-2"
                      variant="warning"
                      onClick={() => handleOpenStatusModal(order)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  )}
                {(order.status === "pending" ||
                  order.status === "confirmed") && (
                  <OverlayTrigger
                    trigger="click"
                    placement="top"
                    rootClose
                    overlay={
                      <Popover id="popover-cancel-confirm">
                        <Popover.Body className="text-center">
                          <div>Bạn có chắc muốn hủy đơn?</div>
                          <div className="d-flex justify-content-between mt-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => document.body.click()}
                            >
                              Không
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Có
                            </Button>
                          </div>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <Button className="me-2" variant="danger">
                      <i className="bi bi-x-circle"></i>
                    </Button>
                  </OverlayTrigger>
                )}
                {order.status === "delivered" && (
                  <OverlayTrigger
                    trigger="click"
                    placement="top"
                    rootClose
                    overlay={
                      <Popover id="popover-return-confirm">
                        <Popover.Body className="text-center">
                          <div>Xác nhận người dùng trả hàng?</div>
                          <div className="d-flex justify-content-between mt-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => document.body.click()}
                            >
                              Không
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleReturnOrder(order.id)}
                            >
                              Có
                            </Button>
                          </div>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <Button className="me-2" variant="secondary">
                      <i className="bi bi-box-arrow-in-left"></i>
                    </Button>
                  </OverlayTrigger>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center ">
        <span className="ms-2">
          Hiển thị {list?.totalPages === 0 ? 0 : (page - 1) * limit + 1} đến{" "}
          {Math.min(page * limit, list?.total)} của {list?.total} kết quả
        </span>

        <Pagination className="mb-0">
          <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          />

          {Array.from({ length: list?.totalPages || 1 }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={page === i + 1}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next
            disabled={page === list?.totalPages}
            onClick={() => setPage(page + 1)}
          />
          <Pagination.Last
            disabled={page === list?.totalPages}
            onClick={() => setPage(list?.totalPages)}
          />
        </Pagination>
      </div>
    </>
  );
};

export default Orders;
