import React, { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Tab,
  InputGroup,
  FormControl,
  Button,
  Row,
  Col,
  Image,
  Modal,
} from "react-bootstrap";
import emptyImage from "../../../../../assets/image/sp/empty-order.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserOrders,
  cancelOrder,
} from "../../../../../redux/slices/orderSlice";
import { toast } from "react-toastify";
import DetailOrderModal from "../../../../../components/detailorder/DetailOrder";
import API_URL from "../../../../../config/api";
const OrderPage = () => {
  const dispatch = useDispatch();
  const { loading: loadingGetOrder, orders } = useSelector(
    (state) => state.order.list
  );

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [visibleOrders, setVisibleOrders] = useState(3);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const toggleExpand = (index) => {
    setExpandedOrders((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      activeTab === "all" ||
      order.status.toLowerCase() === activeTab.toLowerCase();

    const matchesSearch =
      order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.book_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });

  const ordersToDisplay = filteredOrders.slice(0, visibleOrders);

  const loadMoreOrders = () => {
    if (visibleOrders >= filteredOrders.length) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleOrders((prev) => prev + 3);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 400 && !loading) {
        loadMoreOrders();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, visibleOrders, filteredOrders]);

  useEffect(() => {
    setVisibleOrders(3);
  }, [activeTab, searchTerm]);

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Đang chờ xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "shipping":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      case "returned":
        return "Đã trả hàng";
      default:
        return "Không xác định";
    }
  };

  const openConfirmModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await dispatch(cancelOrder(selectedOrderId)).unwrap();
      dispatch(getUserOrders());
      setShowConfirmModal(false);
      toast.success("Huỷ đơn hàng thành công");
    } catch (error) {
      console.error("Huỷ đơn hàng thất bại:", error);
    }
  };

  const handleShow = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <Card className="p-3 border-0" style={{ borderRadius: "5px" }}>
        <h5 className="mb-3">Đơn hàng của tôi</h5>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="all" title="Tất cả đơn" />
          <Tab eventKey="pending" title="Đang chờ xử lý" />
          <Tab eventKey="confirmed" title="Đã xác nhận" />
          <Tab eventKey="shipping" title="Đang giao hàng" />
          <Tab eventKey="delivered" title="Đã giao hàng" />
          <Tab eventKey="cancelled" title="Đã huỷ" />
          <Tab eventKey="returned" title="Đã trả hàng" />
        </Tabs>

        <InputGroup className="mb-3">
          <FormControl
            placeholder="Tìm đơn hàng theo mã, tên sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-5">
            <Image src={emptyImage} height={150} className="mb-3" />
            <div>Không có đơn hàng phù hợp</div>
          </div>
        ) : (
          ordersToDisplay.map((order, index) => {
            const isExpanded = expandedOrders[index];
            const itemsToShow = isExpanded
              ? order.items
              : order.items.slice(0, 1);

            return (
              <Card key={index} className="mb-3">
                <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                  <div>
                    <strong>Mã đơn:</strong>{" "}
                    <span style={{ userSelect: "text" }}>
                      {order.order_code}
                    </span>{" "}
                    &nbsp;|&nbsp;
                    <strong>Ngày:</strong>{" "}
                    {new Date(order.order_date).toLocaleDateString("vi-VN")}
                  </div>
                  <span
                    className={`fw-bold ${
                      order.status === "pending"
                        ? "text-warning"
                        : order.status === "confirmed"
                        ? "text-info"
                        : order.status === "shipping"
                        ? "text-primary"
                        : order.status === "delivered"
                        ? "text-success"
                        : order.status === "cancelled"
                        ? "text-danger"
                        : "text-muted"
                    }`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </Card.Header>
                <Card.Body>
                  {itemsToShow.map((item, idx) => (
                    <Row key={idx} className="align-items-center mb-2">
                      <Col xs="auto" className="d-flex justify-content-center">
                        <Image
                          src={`${API_URL}/uploads/${item.book_image}`}
                          style={{ width: "50px", height: "70px" }}
                          rounded
                        />
                      </Col>
                      <Col style={{ flex: "1" }}>
                        <div style={{ fontSize: "16px", fontWeight: "600" }}>
                          {item.book_name}
                        </div>
                        <div style={{ fontSize: "14px" }}>
                          Số lượng: {item.quantity}
                        </div>
                      </Col>
                      <Col xs="auto" className="text-end fw-bold">
                        {(item.unit_price * item.quantity).toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </Col>
                    </Row>
                  ))}

                  {order.items.length > 1 && (
                    <div className="text-center">
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none"
                        onClick={() => toggleExpand(index)}
                      >
                        {isExpanded
                          ? "Ẩn bớt"
                          : `Xem thêm (${order.items.length - 1}) sản phẩm`}
                      </Button>
                    </div>
                  )}

                  <hr style={{ margin: "8px 0" }} />
                  <div
                    className="text-end fw-bold"
                    style={{ color: "#E35765" }}
                  >
                    Tổng cộng:{" "}
                    {parseInt(order.total_price).toLocaleString("vi-VN")}₫
                  </div>
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShow(order)}
                    >
                      Xem chi tiết
                    </Button>

                    {order.status === "pending" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openConfirmModal(order.id)}
                      >
                        Huỷ đơn
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            );
          })
        )}

        {loading && (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải</span>
            </div>
          </div>
        )}
      </Card>

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận huỷ đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn huỷ đơn hàng này không?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Không
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Có, huỷ ngay
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal chi tiết đơn */}
      <DetailOrderModal
        show={showModal}
        handleClose={handleClose}
        order={selectedOrder}
      />
    </>
  );
};

export default OrderPage;
