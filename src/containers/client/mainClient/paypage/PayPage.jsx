import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Spinner,
  FloatingLabel,
} from "react-bootstrap";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import "./PayPage.scss";
import ButtonCustom from "../../../../components/button/ButtonCustom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  applyPromotionCode,
  resetApplyPro,
  fetchCartFromServer,
} from "../../../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddLocation from "../../../../components/addlocation/AddLocation";
import AddressUser from "../../../../components/addressuser/AddressUser";
import { getUserWithAddress } from "../../../../redux/slices/userSlice";
import { createOrder } from "../../../../redux/slices/orderSlice";
import { useMemo } from "react";
import cod from "../../../../assets/image/bank/cod.png";
import bank from "../../../../assets/image/bank/bank.png";
import vnpay from "../../../../assets/image/bank/vnpay.png";
import momo from "../../../../assets/image/bank/momo.png";
import { createVnpayPayment } from "../../../../redux/slices/vnpaySlice";
import API_URL from "../../../../config/api";

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Giỏ hàng", link: "/gio-hang" },
  { label: "Thanh toán" },
];

const PayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const itemSelect = location.state || [];

  useEffect(() => {
    if (!location.state || itemSelect.length === 0) {
      navigate("/gio-hang");
    }
  }, [location.state, itemSelect.length, navigate]);

  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState("cod");
  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState([]);
  const [ortherInfo, seOrtherInfo] = useState("");

  const {
    loading: loadingCreateOrder,
    successMessage,
    error,
  } = useSelector((state) => state.order.create);

  const { cartItems } = useSelector((state) => state.cart.cart);

  const [fakeLoading, setFakeLoading] = useState(false);

  const subtotal = itemSelect.reduce(
    (acc, item) =>
      acc + (item.price - item.price * (item.discount / 100)) * item.quantity,
    0
  );

  const shippingFee = subtotal >= 300000 ? 0 : 30000;
  const [total, setTotal] = useState(subtotal + shippingFee);

  const { addresses, user } = useSelector((state) => state.user.profile);

  useEffect(() => {
    dispatch(getUserWithAddress());
    dispatch(fetchCartFromServer());
  }, []);

  // useEffect(() => {
  //   if (cartItems.length > 0 && itemSelect.length > 0) {
  //     const isValidSelection = itemSelect.every((selectedItem) =>
  //       cartItems.some((cartItem) => cartItem.book_id === selectedItem.book_id)
  //     );

  //     if (!isValidSelection) {
  //       toast.error("Sản phẩm bạn chọn không còn trong giỏ hàng.");
  //       navigate("/gio-hang");
  //     }
  //   }
  // }, [cartItems, itemSelect]);

  const [itemAddress, setItemAddress] = useState({});
  const [itemUpAddress, setItemUpAddress] = useState({});

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find((addr) => addr.is_default === 1);
      setItemAddress(defaultAddr || addresses[0]);
    }
  }, [addresses]);

  const {
    loading,
    promotion,
    error: errorMessApply,
  } = useSelector((state) => state.cart.applyPro);

  useEffect(() => {
    if (promotion) {
      toast.success(`Áp dụng mã ${discountCode.trim()} thành công!`);
      setDiscountValue(promotion);
    }

    if (errorMessApply) {
      toast.error(errorMessApply);
      setDiscountValue([]);
    }

    return () => {
      dispatch(resetApplyPro());
    };
  }, [promotion, errorMessApply]);

  useEffect(() => {
    const total = subtotal + shippingFee;
    if (discountValue.discount_type === "percent") {
      setTotal(total - total * (discountValue.discount_value / 100));
    }
    if (discountValue.discount_type === "amount") {
      setTotal(total - discountValue.discount_value);
    }
  }, [promotion]);

  const {
    paymentUrl,
    loading: loadingVnpay,
    error: errorVnpay,
  } = useSelector((state) => state.vnpay);

  const { orderId, orderCode } = useSelector((state) => state.order.create);

  useEffect(() => {
    if (selectedMethod === "vnpay" && orderId) {
      dispatch(
        createVnpayPayment({
          amount: total,
          orderId: orderCode,
        })
      );
    }
  }, [orderId, orderCode]);

  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  const handleApplyDiscount = () => {
    dispatch(applyPromotionCode(discountCode));
  };

  const handleShowLocation = () => {
    setShowLocationForm(!showLocationForm);
    setShowAddForm(false);
  };

  const handleConfirm = (item) => {
    setItemAddress(item);
    setShowLocationForm(!showLocationForm);
    setShowAddForm(false);
  };

  const handleAddLocation = () => {
    setShowAddForm(!showAddForm);
    setShowLocationForm(false);
    setItemUpAddress({});
  };

  const handleUpAddress = (item) => {
    setShowAddForm(!showAddForm);
    setShowLocationForm(false);
    setItemUpAddress(item);
  };
  const isAddressEmpty = !itemAddress || Object.keys(itemAddress).length === 0;

  const handleOrder = async () => {
    if (!isAddressEmpty) {
      setFakeLoading(true);

      if (itemSelect)
        setTimeout(async () => {
          const finalTotalPrice = Math.max(0, total);

          const orderData = {
            cartItems: itemSelect,
            totalPrice: finalTotalPrice,
            paymentMethod: selectedMethod,
            note: ortherInfo,
            location: itemAddress.address,
            phone: itemAddress.phone,
            fullname: itemAddress.fullname,
            promotionId: discountValue?.id || null,
            shippingFee: shippingFee,
          };

          const result = await dispatch(createOrder(orderData));
          setFakeLoading(false);

          if (createOrder.fulfilled.match(result)) {
            dispatch(fetchCartFromServer());
            if (selectedMethod === "cod" || finalTotalPrice === 0) {
              navigate("/dat-hang-thanh-cong");
            }
            // else if (selectedMethod === "vnpay") {
            //   dispatch(
            //     createVnpayPayment({
            //       amount: finalTotalPrice,
            //       orderId: result.payload.id,
            //     })
            //   );
            // }
          } else {
            toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
          }
        }, 2000);
    } else {
      toast.error("Vui lòng thiết lập địa chỉ giao hàng trước khi đặt hàng.");
    }
  };

  const shippingInfo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);

    const weekdays = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const weekday = weekdays[date.getDay()];

    return {
      dateString: `${day}/${month}`,
      weekday,
    };
  }, []);

  return (
    <>
      {showAddForm && showAddForm === true && (
        <AddLocation
          show={showAddForm}
          handleClose={handleShowLocation}
          user={user}
          itemUpAddress={itemUpAddress}
        />
      )}
      {showLocationForm && showLocationForm === true && (
        <AddressUser
          onClose={handleShowLocation}
          onConfirm={handleConfirm}
          addresses={addresses}
          itemAddress={itemAddress}
          onClickAdd={handleAddLocation}
          onClickUp={handleUpAddress}
        />
      )}
      <Container>
        <Breadcrumb items={breadcrumbItems} />

        <Row className="mb-4">
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Thông tin vận chuyển</Card.Title>

                {!isAddressEmpty ? (
                  <>
                    <div>
                      Người nhận <strong>{itemAddress.fullname}</strong>
                    </div>
                    <div>
                      Số điện thoại <strong>{itemAddress.phone}</strong>
                    </div>
                    <div>
                      Giao hàng đến <strong>{itemAddress.address}</strong>
                      <span
                        className="text-primary ms-2 text-decoration-underline"
                        style={{ cursor: "pointer" }}
                        onClick={handleShowLocation}
                      >
                        Thay đổi
                      </span>
                    </div>
                    <div className="mt-2">
                      <i className="bi bi-truck text-success"></i> Giao{" "}
                      {shippingInfo.weekday} –{" "}
                      {shippingFee === 30000 ? (
                        <>
                          <strong>{shippingInfo.dateString}</strong> |{" "}
                          <span>
                            {Number(shippingFee).toLocaleString("vi-VN")}đ
                          </span>
                        </>
                      ) : (
                        <>
                          <strong>{shippingInfo.dateString}</strong> |{" "}
                          <del>{Number(30000).toLocaleString("vi-VN")}đ</del>
                          <span className="ms-2 badge bg-success mb-1">
                            Freeship
                          </span>
                        </>
                      )}
                      <div className="text-muted small">
                        Freeship cho đơn hàng từ 300k
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-danger">
                    Vui lòng thiết lập địa chỉ giao hàng{" "}
                    <span
                      className="text-primary text-decoration-underline"
                      style={{ cursor: "pointer" }}
                      onClick={handleShowLocation}
                    >
                      tại đây
                    </span>
                    .
                  </div>
                )}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Phương thức thanh toán</Card.Title>
                <Form>
                  {[
                    {
                      value: "cod",
                      label: "Thanh toán khi giao hàng (COD)",
                      icon: cod,
                    },
                    {
                      value: "vnpay",
                      label: "Thanh toán qua VNPAY",
                      icon: vnpay,
                    },
                    {
                      value: "bank",
                      label: "Chuyển khoản qua ngân hàng",
                      icon: bank,
                      disabled: true,
                    },
                    {
                      value: "momo",
                      label: "Ví MoMo",
                      icon: momo,
                      disabled: true,
                    },
                  ].map((method) => (
                    <div
                      key={method.value}
                      className={`form-method d-flex align-items-center mb-2 p-2 rounded border ${
                        selectedMethod === method.value ? "border-primary" : ""
                      } ${method.disabled ? "bg-light text-muted" : ""}`}
                      style={{
                        cursor: method.disabled ? "not-allowed" : "pointer",
                      }}
                      onClick={() => {
                        if (!method.disabled) setSelectedMethod(method.value);
                      }}
                    >
                      <Form.Check
                        type="radio"
                        id={method.value}
                        name="paymentMethod"
                        value={method.value}
                        disabled={method.disabled}
                        checked={selectedMethod === method.value}
                        onChange={() => {}}
                        label={
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={method.icon}
                              alt={method.label}
                              width={24}
                              height={24}
                              style={{ objectFit: "contain" }}
                              onError={(e) => (e.target.style.display = "none")}
                            />
                            <span>{method.label}</span>
                          </div>
                        }
                      />
                    </div>
                  ))}
                </Form>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Card.Title>Thông tin khác</Card.Title>
                <Form.Group controlId="note">
                  <Form.Label>Ghi chú cho Booklovers</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Thông tin ghi chú"
                    value={ortherInfo}
                    onChange={(e) => seOrtherInfo(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Đơn hàng ({itemSelect.length} sản phẩm)</Card.Title>

                {itemSelect.map((item, index) => (
                  <div className="d-flex mb-3 border-bottom pb-2" key={index}>
                    <Image
                      src={`${API_URL}/uploads/${item.image}`}
                      width={50}
                      height={60}
                      rounded
                      className="me-2"
                    />
                    <div>
                      <strong>{item.name}</strong>
                      <div>
                        <span style={{ color: "#E35765", fontWeight: "600" }}>
                          {(
                            (item.price -
                              (item.price * (item.discount || 0)) / 100) *
                            item.quantity
                          ).toLocaleString("vi-VN")}
                          đ
                        </span>
                        <span className="ms-3" style={{ fontSize: "14px" }}>
                          Số lượng: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Form.Group className="mb-3 d-flex" style={{ gap: "8px" }}>
                  <FloatingLabel
                    controlId="discountCode"
                    label="Nhập mã giảm giá"
                    style={{ flex: 1 }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                  </FloatingLabel>

                  <Button
                    variant="primary"
                    className="px-4 d-flex align-items-center justify-content-center"
                    onClick={handleApplyDiscount}
                    disabled={!discountCode.trim() || loading}
                    style={{ minWidth: "110px" }}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                      </>
                    ) : (
                      "Áp dụng"
                    )}
                  </Button>
                </Form.Group>

                <div className="d-flex justify-content-between mb-1">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
                </div>
                {discountValue && discountValue.description ? (
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ color: "#E66774" }}
                  >
                    <span>{discountValue.description}</span>
                    {discountValue.discount_type === "percent" ? (
                      <span>-{discountValue.discount_value}%</span>
                    ) : (
                      <span>
                        -
                        {Number(discountValue.discount_value).toLocaleString(
                          "vi-VN"
                        )}
                        ₫
                      </span>
                    )}
                  </div>
                ) : null}
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Tổng cộng</span>
                  <span>
                    {Number(total) > 0
                      ? Number(total).toLocaleString("vi-VN")
                      : "0"}
                    ₫
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Link to="/gio-hang" className="text-decoration-none">
                    &lt; Quay về giỏ hàng
                  </Link>

                  <Button
                    className="d-flex align-items-center justify-content-center"
                    onClick={handleOrder}
                    disabled={fakeLoading}
                    style={{
                      minWidth: "80px",
                      backgroundColor: "#E35765",
                      borderColor: "#E35765",
                    }}
                  >
                    {fakeLoading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Đang xử lý
                      </>
                    ) : (
                      "Đặt hàng"
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PayPage;
