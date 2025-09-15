import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import imgbookempty from "../../../../assets/image/imgbookempty.jpg";
import cartempty from "../../../../assets/image/cartempty.png";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import "./CartPage.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartFromServer,
  updateItemQuantity,
  removeItemFromCart,
} from "../../../../redux/slices/cartSlice";
import API_URL from "../../../../config/api";

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Giỏ hàng" },
];

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state;

  const { cartItems } = useSelector((state) => state.cart.cart);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCartFromServer());
  }, [dispatch]);

  useEffect(() => {
    if (state?.from === "buyNow" && state.bookId && cartItems.length > 0) {
      const matchedItem = cartItems.find(
        (item) => item.book_id === state.bookId
      );
      if (matchedItem) {
        setItemSelect([matchedItem]);
      }

      window.history.replaceState({}, document.title);
    }
  }, [state, cartItems]);

  const [itemSelect, setItemSelect] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [localQuantities, setLocalQuantities] = useState({});

  useEffect(() => {
    const total = itemSelect.reduce((sum, item) => {
      const priceAfterDiscount =
        item.discount && item.discount > 0
          ? item.price - (item.price * item.discount) / 100
          : item.price;

      return sum + priceAfterDiscount * item.quantity;
    }, 0);

    setTotalPrice(total);
  }, [itemSelect]);

  const handleCheckAll = () => {
    setIsLoading(true);
    setTimeout(() => {
      const isAllChecked = itemSelect.length === cartItems.length;

      if (isAllChecked) {
        setItemSelect([]);
      } else {
        setItemSelect(cartItems);
      }

      setIsLoading(false);
    }, 500);
  };

  const handleCheckItem = (item) => {
    setIsLoading(true);
    setTimeout(() => {
      setItemSelect((prev) => {
        const exists = prev.some((i) => i.cart_item_id === item.cart_item_id);
        if (exists) {
          return prev.filter((i) => i.cart_item_id !== item.cart_item_id);
        } else {
          return [...prev, item];
        }
      });
      setIsLoading(false);
    }, 500);
  };

  const handleRemoveItem = (cartItemId) => {
    setIsLoading(true);
    setTimeout(() => {
      setItemSelect((prev) =>
        prev.filter((item) => item.cart_item_id !== cartItemId)
      );

      dispatch(removeItemFromCart(cartItemId));
      setIsLoading(false);
    }, 500);
  };

  const updateItemSelectQuantity = (cartItemId, newQuantity) => {
    setItemSelect((prev) =>
      prev.map((item) =>
        item.cart_item_id === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleIncrease = (cartItemId) => {
    setIsLoading(true);
    setTimeout(() => {
      const item = cartItems.find((i) => i.cart_item_id === cartItemId);
      if (!item) return;

      const newQty = item.quantity + 1;

      dispatch(updateItemQuantity({ itemId: cartItemId, quantity: newQty }));

      updateItemSelectQuantity(cartItemId, newQty);

      setIsLoading(false);
    }, 500);
  };

  const handleDecrease = (cartItemId) => {
    setIsLoading(true);
    setTimeout(() => {
      const item = cartItems.find((i) => i.cart_item_id === cartItemId);
      if (!item) return;

      if (item.quantity <= 1) {
        setIsLoading(false);
        return;
      }

      const newQty = item.quantity - 1;

      dispatch(updateItemQuantity({ itemId: cartItemId, quantity: newQty }));

      updateItemSelectQuantity(cartItemId, newQty);

      setIsLoading(false);
    }, 500);
  };

  const handleQuantityInput = (e, cartItemId) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return;

    setLocalQuantities((prev) => ({
      ...prev,
      [cartItemId]: value,
    }));
  };

  const handleQuantityBlur = (cartItemId, currentQuantity) => {
    let quantityRaw = localQuantities[cartItemId];

    let quantity = quantityRaw === "" ? 1 : Math.max(1, parseInt(quantityRaw));

    if (quantity !== currentQuantity) {
      setIsLoading(true);
      setTimeout(() => {
        dispatch(updateItemQuantity({ itemId: cartItemId, quantity })).finally(
          () => {
            updateItemSelectQuantity(cartItemId, quantity);

            setIsLoading(false);
            setLocalQuantities((prev) => {
              const { [cartItemId]: _, ...rest } = prev;
              return rest;
            });
          }
        );
      }, 500);
    }
  };

  const handlepay = () => {
    navigate("/gio-hang/thanh-toan", { state: itemSelect });
  };

  return (
    <>
      {isLoading && (
        <div className="overlay-loading">
          <div className="custom-spinner"></div>
        </div>
      )}
      <Container>
        <Breadcrumb items={breadcrumbItems} />

        {cartItems.length === 0 ? (
          <div
            className="bg-white text-center d-flex justify-content-center align-items-center rounded mb-4"
            style={{ minHeight: "500px" }}
          >
            <div>
              <Image src={cartempty} height={200} />
              <h5 className="mt-3 text-muted">Giỏ hàng của bạn đang trống</h5>
            </div>
          </div>
        ) : (
          <div style={{ minHeight: "500px" }}>
            <h5 className="p-2" style={{ color: "#333" }}>
              GIỎ HÀNG
            </h5>
            <Row className="mb-4">
              <Col md={12} lg={8}>
                <div
                  className="d-flex align-items-center bg-white p-2 text-muted fw-bold mb-3 rounded"
                  style={{ fontSize: "14px" }}
                >
                  <div
                    style={{ flex: "1" }}
                    className="d-flex align-items-center"
                  >
                    <input
                      type="checkbox"
                      checked={
                        itemSelect.length === cartItems.length &&
                        cartItems.length > 0
                      }
                      onChange={handleCheckAll}
                      style={{
                        accentColor: "#dc3545",
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <span className="ms-2">
                      Chọn tất cả ({itemSelect.length}/{cartItems.length} sản
                      phẩm)
                    </span>
                  </div>
                  <div
                    style={{ width: "100px" }}
                    className="text-center d-none d-md-block"
                  >
                    Giá bán
                  </div>
                  <div
                    style={{ width: "100px" }}
                    className="text-center d-none d-md-block ms-lg-3"
                  >
                    Số lượng
                  </div>
                  <div
                    style={{ width: "100px" }}
                    className="text-center d-none d-md-block"
                  >
                    Thành tiền
                  </div>
                  <div style={{ width: "25px" }}></div>
                </div>

                <div className="bg-white p-2 rounded">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className={`d-md-flex d-block align-items-center pt-2 pb-2 ${
                        index !== cartItems.length - 1 ? "border-bottom" : ""
                      }`}
                    >
                      <div
                        style={{ flex: "1" }}
                        className="d-flex align-items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={itemSelect.some(
                            (i) => i.cart_item_id === item.cart_item_id
                          )}
                          onChange={() => handleCheckItem(item)}
                          style={{
                            accentColor: "#dc3545",
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                          }}
                        />
                        <div style={{ minWidth: "70px" }}>
                          <Image
                            src={`${API_URL}/uploads/${item.image}`}
                            width={70}
                            height={90}
                          />
                        </div>
                        <div
                          className="d-flex flex-column justify-content-between"
                          style={{ maxWidth: "200px" }}
                        >
                          <div
                            className="fw-semibold"
                            style={{
                              color: "#333",
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                            }}
                          >
                            {item.name}
                          </div>
                          <div className="mt-1">
                            {item.discount > 0 && (
                              <>
                                <span
                                  className="text-muted me-2"
                                  style={{
                                    textDecoration: "line-through",
                                    fontSize: "14px",
                                  }}
                                >
                                  {parseInt(item.price).toLocaleString("vi-VN")}
                                  đ
                                </span>
                                <span
                                  className="fw-semibold"
                                  style={{
                                    fontSize: "15px",
                                    padding: " 2px 6px",
                                    backgroundColor: "#E35765",
                                    color: "white",
                                    borderRadius: "5px",
                                  }}
                                >
                                  -{item.discount}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex  justify-content-end align-items-center mt-2 mt-md-0">
                          <div
                            style={{ width: "100px" }}
                            className="text-center text-danger fw-bold"
                          >
                            {(
                              item.price -
                              (item.price * item.discount) / 100
                            ).toLocaleString("vi-VN")}
                            đ
                          </div>

                          <div style={{}} className="text-center ms-lg-3">
                            <InputGroup className="ipQuantity1 justify-content-center">
                              <Button
                                className="btnDecrease"
                                onClick={() =>
                                  handleDecrease(item.cart_item_id)
                                }
                              >
                                <i className="bi bi-dash btnDecrease-icon"></i>
                              </Button>
                              <FormControl
                                type="text"
                                min={1}
                                value={
                                  localQuantities[item.cart_item_id] ??
                                  item.quantity
                                }
                                onChange={(e) =>
                                  handleQuantityInput(e, item.cart_item_id)
                                }
                                onBlur={() =>
                                  handleQuantityBlur(
                                    item.cart_item_id,
                                    item.quantity
                                  )
                                }
                                className="ipQuantity-input text-center"
                              />
                              <Button
                                className="btnIncrease"
                                onClick={() =>
                                  handleIncrease(item.cart_item_id)
                                }
                              >
                                <i className="bi bi-plus btnIncrease-icon"></i>
                              </Button>
                            </InputGroup>
                          </div>

                          <div
                            style={{ width: "100px" }}
                            className="text-center text-danger fw-bold "
                          >
                            {(
                              (item.price -
                                (item.price * (item.discount || 0)) / 100) *
                              item.quantity
                            ).toLocaleString("vi-VN")}
                            đ
                          </div>

                          <div
                            style={{ width: "25px" }}
                            className="text-center "
                          >
                            <Button
                              variant="link"
                              className="text-muted p-0 btn-delItem"
                              onClick={() =>
                                handleRemoveItem(item.cart_item_id)
                              }
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Col>

              <Col md={12} lg={4} className="mt-3 mt-lg-0">
                <div className="checkout-box bg-white p-3 rounded shadow-sm">
                  {totalPrice === 0 ? (
                    <div className="d-flex mb-3 align-items-start gap-2 border-bottom pb-2">
                      <div
                        className="rounded border d-flex justify-content-center align-items-center"
                        style={{
                          width: 70,
                          height: 90,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        <Image
                          src={imgbookempty}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          className="mb-2"
                          style={{
                            height: "20px",
                            backgroundColor: "#e0e0e0",
                            borderRadius: "4px",
                            width: "80%",
                          }}
                        ></div>
                        <div
                          style={{
                            height: "16px",
                            backgroundColor: "#e0e0e0",
                            borderRadius: "4px",
                            width: "50%",
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    itemSelect.length > 0 &&
                    itemSelect.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between mb-3 align-items-start  border-bottom pb-2"
                      >
                        <div className="d-flex gap-3" style={{ flex: 1 }}>
                          <Image
                            src={`${API_URL}/uploads/${item.image}`}
                            width={70}
                            height={90}
                            className="rounded border"
                          />
                          <div className="d-flex flex-column justify-content-between">
                            <div
                              className="fw-semibold"
                              style={{ color: "#333" }}
                            >
                              {item.name}
                            </div>

                            <div className="mt-1">
                              {item.discount > 0 ? (
                                <>
                                  <span
                                    className="fw-bold text-danger me-2"
                                    style={{ fontSize: "15px" }}
                                  >
                                    {(
                                      item.price -
                                      (item.price * (item.discount || 0)) / 100
                                    ).toLocaleString("vi-VN")}
                                    đ
                                  </span>
                                  <span
                                    className="text-muted me-2"
                                    style={{
                                      textDecoration: "line-through",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {parseInt(item.price).toLocaleString(
                                      "vi-VN"
                                    )}
                                    đ
                                  </span>
                                  <span
                                    className="fw-semibold"
                                    style={{
                                      fontSize: "14px",
                                      padding: "2px 6px",
                                      backgroundColor: "#E35765",
                                      color: "white",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    -{item.discount}%
                                  </span>
                                </>
                              ) : (
                                <span
                                  className="fw-bold text-danger"
                                  style={{ fontSize: "15px" }}
                                >
                                  {parseInt(item.price).toLocaleString("vi-VN")}
                                  đ
                                </span>
                              )}
                            </div>

                            <div
                              className="text-muted mt-1"
                              style={{ fontSize: "14px" }}
                            >
                              Số lượng: {item.quantity}
                            </div>
                          </div>
                        </div>

                        <div
                          className="fw-bold text-end"
                          style={{ color: "#D14552" }}
                        >
                          {(
                            item.quantity *
                            (item.price -
                              (item.price * (item.discount || 0)) / 100)
                          ).toLocaleString("vi-VN")}
                          đ
                        </div>
                      </div>
                    ))
                  )}

                  <div className="d-flex justify-content-between fw-bold mb-3">
                    <span className="text-dark">Tổng cộng:</span>
                    <span style={{ color: "#D14552" }}>
                      {totalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  <Button
                    className="w-100 fw-bold"
                    style={{
                      backgroundColor: "#E35765",
                      border: "none",
                      opacity: totalPrice === 0 ? 0.5 : 1,
                      pointerEvents: totalPrice === 0 ? "none" : "auto",
                    }}
                    disabled={totalPrice === 0}
                    onClick={handlepay}
                  >
                    Thanh toán
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </>
  );
};

export default CartPage;
