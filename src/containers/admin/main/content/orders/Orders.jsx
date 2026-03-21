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
import Select from "react-select";
import MyLayoutAdmin from "../../../../../components/mylayout/MyLayoutAdmin";
import MyButtonCreate from "../../../../../components/button/MyButtonCreate";
import MyDataTable from "../../../../../components/mytable/MyDataTable";
import { formatDate } from "../../../../../utils/format";
import MyButtonExport from "../../../../../components/button/MyButtonExport";

const paymentOptions = [
  { value: "", label: "Phương thức thanh toán" },
  { value: "cod", label: "Thanh toán bằng tiền mặt" },
  { value: "vnpay", label: "Thanh toán qua VNPAY" },
];

const statusOptions = [
  { value: "", label: "Trạng thái đơn" },
  { value: "pending", label: "Đang chờ xử lý" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao hàng" },
  { value: "delivered", label: "Đã giao hàng" },
  { value: "cancelled", label: "Đã huỷ" },
  { value: "returned", label: "Đã trả hàng" },
];

const priceOptions = [
  { value: "", label: "Giá tiền" },
  { value: "asc", label: "Tăng dần" },
  { value: "desc", label: "Giảm dần" },
  { value: "lt500", label: "Dưới 500.000đ" },
  { value: "500to1000", label: "500.000đ - 1.000.000đ" },
  { value: "gt1000", label: "Trên 1.000.000đ" },
];

const Orders = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const { list: data, pagination } = useSelector(
    (state) => state.adminOrder.listOrders
  );

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  const { success, error: errorUp } = useSelector(
    (state) => state.adminOrder.updateStatus
  );

  const { currentOrder } = useSelector((state) => state.statistics.orderDetail);

  useEffect(() => {
    dispatch(
      fetchOrders({
        page: currentPage,
        limit: 10,
        search,
        paymentMethod,
        status,
        priceFilter,
        fromDate: fromDate ? formatDateTime(fromDate, true) : "",
        toDate: toDate ? formatDateTime(toDate, false) : "",
      })
    );
  }, [
    currentPage,
    search,
    paymentMethod,
    status,
    priceFilter,
    fromDate,
    toDate,
    limit,
  ]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Mã đơn", style: { width: "6%", textAlign: "center" } },
    { title: "Họ và tên", style: { width: "15%" } },
    {
      title: "Địa chỉ giao hàng",
      style: { width: "25%" },
    },
    {
      title: "Thanh toán",
      style: { width: "10%", textAlign: "center" },
    },
    { title: "Ngày đặt", style: { width: "6%", textAlign: "center" } },
    { title: "Tổng tiền", style: { width: "9%", textAlign: "center" } },
    { title: "Trạng thái", style: { width: "8%", textAlign: "center" } },
    { title: "Thao tác", style: { width: "15%", textAlign: "center" } },
  ];

  const renderRow = (order, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{order.id}</td>
      <td className="text-center align-middle">
        {(page - 1) * limit + index + 1}
      </td>
      <td className="align-middle text-center">{order.order_code}</td>
      <td className="align-middle">{order.fullname}</td>
      <td>{order.location}</td>
      <td className="align-middle text-center">
        {order.payment_method === "cod" ? (
          <Badge bg="secondary">Tiền mặt</Badge>
        ) : (
          <Badge bg="success">VNPAY</Badge>
        )}
      </td>
      <td className="align-middle text-center">
        {formatDate(order.order_date)}
      </td>
      <td className="align-middle text-center">
        {Number(order.total_price).toLocaleString("vi-VN")}
      </td>
      <td className=" align-middle text-center">
        <Badge bg={statusMap[order.status]?.variant || "light"}>
          {statusMap[order.status]?.text || order.status}
        </Badge>
      </td>

      <td className="align-middle text-center">
        <Button
          className="me-2"
          variant="success"
          onClick={() => handleViewDetail(order)}
          size="sm"
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
              size="sm"
            >
              <i className="bi bi-pencil-square"></i>
            </Button>
          )}
        {(order.status === "pending" || order.status === "confirmed") && (
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
            <Button className="me-2" variant="danger" size="sm">
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
            <Button className="me-2" variant="secondary" size="sm">
              <i className="bi bi-box-arrow-in-left"></i>
            </Button>
          </OverlayTrigger>
        )}
      </td>
    </tr>
  );

  useEffect(() => {
    if (success) {
      toast.success("Cập nhật trạng thái thành công!");
      dispatch(fetchOrders({ page }));
      dispatch(resetUpdateStatus());
    }

    if (errorUp) {
      toast.error(errorUp);
      dispatch(resetUpdateStatus());
    }
  }, [success, errorUp]);

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

      setLoading(false);
      setResetting(false);
    }, 1200);
  };

  const handleReturnOrder = (orderId) => {
    dispatch(updateOrderStatus({ orderId, status: "returned" }));
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

      console.log(response);

      const data = response?.data || [];

      if (data.length === 0) {
        toast.info("Không có dữ liệu để xuất Excel");
        return;
      }

      const excelData = data.map((order, index) => ({
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

      <MyLayoutAdmin title="Danh sách đơn hàng">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Col className="d-flex align-items-center">
            <MyButtonExport onClick={handleExportExcel} />
          </Col>
          <div className="d-flex flex-column flex-grow-1">
            <Row className="g-2 mb-2">
              <Col>
                <Select
                  value={paymentOptions.find((o) => o.value === paymentMethod)}
                  onChange={(selected) => {
                    setPaymentMethod(selected.value);
                    setPage(1);
                  }}
                  options={paymentOptions}
                  placeholder="Phương thức thanh toán"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: 38,
                    }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </Col>

              <Col>
                <Select
                  value={statusOptions.find((o) => o.value === status)}
                  onChange={(selected) => {
                    setStatus(selected.value);
                    setPage(1);
                  }}
                  options={statusOptions}
                  placeholder="Trạng thái đơn"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: 38,
                    }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </Col>

              <Col>
                <Select
                  value={priceOptions.find((o) => o.value === priceFilter)}
                  onChange={(selected) => {
                    setPriceFilter(selected.value);
                    setPage(1);
                  }}
                  options={priceOptions}
                  placeholder="Giá tiền"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: 38,
                    }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </Col>
            </Row>
            <Row className="g-2">
              <Col>
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
              <Col
                className="d-flex flex-wrap gap-2 justify-content-end"
                xs="auto"
              >
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
                  style={{ width: "34px", height: "34px" }}
                  size="sm"
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
          </div>
        </div>
        <div style={{ minHeight: "722px" }}>
          <MyDataTable
            columns={columns}
            data={data}
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

export default Orders;
