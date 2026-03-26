import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
  Tabs,
  Tab,
  Badge,
  Stack,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import ButtonCustom from "../../../../components/button/ButtonCustom";
import "./DetailProduct.scss";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookById } from "../../../../redux/slices/bookSlice";
import { getUserWithAddress } from "../../../../redux/slices/userSlice";
import {
  addItemToCartAsync,
  fetchCartFromServer,
} from "../../../../redux/slices/cartSlice";
import API_URL from "../../../../config/api";
import ReviewsBooks from "../reviewsbook/ReviewsBooks";
import { getReviewsByBookId } from "../../../../redux/slices/reviewSlice";

const DetailProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const bookId = location.state?.bookId;

  const { book, bookDetail, bookImages } = useSelector(
    (state) => state.book.bookDetail
  );

  const { cartItems } = useSelector((state) => state.cart.cart);

  const [quantity, setQuantity] = useState(1);

  const [mainImage, setMainImage] = useState(null);

  const maxQuantity = book ? book.quantity - book.sold : 0;

  const currentCartItem = cartItems?.find((item) => item?.book_id === book?.id);

  const currentQuantityInCart = currentCartItem?.quantity || 0;

  const { data } = useSelector((state) => state.review.bookReviews);

  useEffect(() => {
    if (bookId) {
      dispatch(fetchBookById(bookId));
      dispatch(getReviewsByBookId({ book_id: bookId }));
    }
  }, [dispatch, bookId]);

  useEffect(() => {
    dispatch(getUserWithAddress());
    dispatch(fetchCartFromServer());
  }, [dispatch]);

  useEffect(() => {
    if (bookImages && bookImages.length > 0) {
      const main = bookImages.find((img) => img.is_main === 1);
      setMainImage(main ? `${main.image_url}` : `${bookImages[0].image_url}`);
    }
  }, [bookImages]);

  useEffect(() => {
    if (maxQuantity > 0 && quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity]);

  const handleIncrease = () => {
    setQuantity((prev) => {
      if (prev >= maxQuantity) return maxQuantity;
      return prev + 1;
    });
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Vui lòng đăng nhập trước!");
      return;
    }

    const currentCartItem = cartItems?.find((item) => item.book_id === book.id);

    const currentQuantityInCart = currentCartItem?.quantity || 0;

    // 🚨 check vượt tồn kho
    if (currentQuantityInCart + quantity > maxQuantity) {
      toast.warning(
        `Bạn chỉ có thể mua tối đa ${maxQuantity} sản phẩm. Trong giỏ đã có ${currentQuantityInCart}`,
        {
          autoClose: 2000,
        }
      );
      return;
    }

    try {
      await dispatch(
        addItemToCartAsync({ bookId: book.id, quantity })
      ).unwrap();

      dispatch(fetchCartFromServer());

      toast.success("Đã thêm sản phẩm vào giỏ hàng!", {
        autoClose: 1000,
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Vui lòng đăng nhập trước!");
      return;
    }

    // 🚨 nếu đã full trong giỏ
    if (currentQuantityInCart >= maxQuantity) {
      toast.warning("Sản phẩm đã đạt số lượng tối đa trong giỏ hàng", {
        autoClose: 2000,
      });
      return;
    }

    try {
      await dispatch(
        addItemToCartAsync({ bookId: book.id, quantity })
      ).unwrap();

      navigate("/gio-hang", {
        state: { from: "buyNow", bookId: book.id },
      });
    } catch (error) {
      toast.error("Có lỗi khi thêm sản phẩm vào giỏ hàng", {
        autoClose: 1000,
      });
    }
  };

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Sản phẩm", link: "/san-pham" },
    { label: "Chi tiết sản phẩm" },
    { label: book?.name },
  ];

  return (
    <>
      {book && bookDetail && bookImages.length > 0 && (
        <>
          <Container className="">
            <Breadcrumb items={breadcrumbItems} />

            <Row>
              <Col xs={12} md={5}>
                <Image
                  src={`${API_URL}/uploads/${mainImage}`}
                  alt={book.name}
                  fluid
                  thumbnail
                  style={{
                    width: "100%",
                    height: "600px",
                    padding: "10px",
                  }}
                />
                <div className="d-flex mt-2 gap-2 flex-wrap">
                  {[...bookImages]
                    .sort(
                      (a, b) =>
                        (b.is_main === 1 ? 1 : 0) - (a.is_main === 1 ? 1 : 0)
                    ) // hoặc b.is_main - a.is_main
                    .map((img, index) => {
                      return (
                        <Image
                          key={index}
                          src={`${API_URL}/uploads/${img.image_url}`}
                          thumbnail
                          onClick={() => setMainImage(img.image_url)}
                          style={{
                            width: "60px",
                            height: "70px",
                            cursor: "pointer",
                            border:
                              mainImage === img.image_url
                                ? "2px solid #E66774"
                                : "2px solid #ccc",
                          }}
                        />
                      );
                    })}
                </div>
              </Col>

              <Col xs={12} md={7} className="mt-3 mt-md-0">
                <div className="bg-white p-3 border rounded ">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span
                      className="badge px-2 py-1"
                      style={{
                        fontSize: "12px",
                        backgroundColor: "#FFE880",
                        color: "#156EF8",
                        fontWeight: "bold",
                      }}
                    >
                      <i className="bi bi-box-fill me-1"></i>10 NGÀY ĐỔI TRẢ
                    </span>
                    <span
                      className="badge px-2 py-1"
                      style={{
                        fontSize: "12px",
                        backgroundColor: "#F2F7FF",
                        color: "#156EF8",
                        fontWeight: "bold",
                      }}
                    >
                      <i className="bi bi-check-lg me-1"></i>CHÍNH HÃNG
                    </span>
                  </div>
                  <h4 className=" mb-2">{book.name}</h4>

                  <Row className="mb-2">
                    <Col md={6}>
                      <div className="text-muted">
                        <span style={{ fontSize: "14px" }}>Nhà cung cấp:</span>{" "}
                        <span className="fw-semibold">
                          {bookDetail.supplier_name}
                        </span>
                      </div>
                      <div className="text-muted">
                        <span style={{ fontSize: "14px" }}>Nhà xuất bản:</span>{" "}
                        <span className="fw-semibold">
                          {bookDetail.publisher}
                        </span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-muted">
                        <span style={{ fontSize: "14px" }}>Tác giả:</span>{" "}
                        <span className="fw-semibold">
                          {bookDetail.authors}
                        </span>
                      </div>
                      <div className="text-muted">
                        <span style={{ fontSize: "14px" }}>Hình thức bìa:</span>{" "}
                        <span className="fw-semibold">
                          {bookDetail.cover_type}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  {data?.rating_summary?.total > 0 ? (
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning fw-bold">
                        {data?.rating_summary?.average}★
                      </span>
                      <span className="text-muted">
                        ({data?.rating_summary?.total} đánh giá)
                      </span>
                    </div>
                  ) : null}

                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span
                        className="fw-bold"
                        style={{ color: "#E35765", fontSize: "22px" }}
                      >
                        {Math.round(
                          book.price - book.price * (book.discount / 100)
                        ).toLocaleString("vi-VN")}
                        đ
                      </span>{" "}
                      {book.discount ? (
                        <span
                          className="text-decoration-line-through me-2"
                          style={{ fontSize: "14px", color: "#888" }}
                        >
                          {Number(book.price).toLocaleString("vi-VN")}đ
                        </span>
                      ) : null}
                      {book.discount ? (
                        <span
                          style={{
                            backgroundColor: "#E35765",
                            color: "white",
                            borderRadius: "5px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            padding: "1px 6px 2px 6px",
                          }}
                        >
                          -{book.discount}%
                        </span>
                      ) : null}
                    </div>
                    <span className="fw-semibold text-muted">
                      Đã bán: {book.sold}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white mt-3 border rounded ">
                  {book.quantity <= book.sold ? (
                    <Badge className="mb-3" bg="secondary">
                      Hết hàng
                    </Badge>
                  ) : (
                    <div className="mb-3 d-flex align-items-center">
                      <strong>Số lượng:</strong>
                      <InputGroup className="ipQuantity ms-3 mt-2">
                        <Button
                          className="btnDecrease"
                          onClick={handleDecrease}
                        >
                          <i className="bi bi-dash btnDecrease-icon"></i>
                        </Button>
                        <FormControl
                          value={quantity}
                          onChange={(e) => {
                            let val = parseInt(e.target.value);

                            if (isNaN(val) || val < 1) val = 1;
                            if (val > maxQuantity) val = maxQuantity;

                            setQuantity(val);
                          }}
                          type="text"
                          className="ipQuantity-input"
                        />
                        <Button
                          className="btnIncrease"
                          onClick={handleIncrease}
                        >
                          <i className="bi bi-plus btnIncrease-icon"></i>
                        </Button>
                      </InputGroup>
                      <span className="ms-2 text-success fw-semibold">
                        Còn lại {maxQuantity}
                      </span>
                    </div>
                  )}

                  <div className="d-flex gap-2">
                    <ButtonCustom
                      text="Thêm vào giỏ hàng"
                      border="2px solid #E35765"
                      bgrColor="white"
                      color="#E35765"
                      fontWeight="bold"
                      icon="bi bi-cart-plus"
                      onClick={handleAddCart}
                      disabled={book.quantity <= book.sold}
                    />
                    <ButtonCustom
                      text="Mua ngay"
                      border="2px solid #E35765"
                      bgrColor="#E35765"
                      color="white"
                      fontWeight="bold"
                      icon="bi bi-cart3"
                      onClick={handleBuyNow}
                      disabled={book.quantity <= book.sold}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Tabs
                  defaultActiveKey="description"
                  id="product-tabs"
                  className="mb-3"
                >
                  <Tab eventKey="description" title="Mô tả sản phẩm">
                    <div
                      className="p-3 bg-white "
                      style={{ textAlign: "justify", borderRadius: "10px" }}
                      dangerouslySetInnerHTML={{ __html: book.description }}
                    ></div>
                  </Tab>

                  <Tab eventKey="details" title="Thông tin chi tiết">
                    <div
                      className="p-3 bg-white  "
                      style={{ borderRadius: "10px" }}
                    >
                      <h6 className="fw-bold mb-3">Thông tin chi tiết</h6>

                      {[
                        { label: "Mã hàng", value: bookDetail.barcode || "" },
                        {
                          label: "Tên Nhà Cung Cấp",
                          value: bookDetail.supplier_name || "",
                        },
                        { label: "Tác giả", value: bookDetail.authors || "" },
                        { label: "NXB", value: bookDetail.publisher || "" },
                        {
                          label: "Năm XB",
                          value: bookDetail.published_year || "",
                        },
                        {
                          label: "Ngôn Ngữ",
                          value: bookDetail.language || "",
                        },
                        {
                          label: "Trọng lượng (gr)",
                          value: bookDetail.weight_gram || "",
                        },
                        {
                          label: "Kích Thước Bao Bì",
                          value: bookDetail.dimensions || "",
                        },
                        {
                          label: "Số trang",
                          value: bookDetail.page_count || "",
                        },
                        {
                          label: "Hình thức",
                          value: bookDetail.cover_type || "",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="mb-2 d-flex"
                          style={{ borderBottom: "0.5px solid #F2F4F5" }}
                        >
                          <div className="w-25 text-muted">{item.label}</div>
                          <div className="w-50 ">{item.value}</div>
                        </div>
                      ))}

                      <div
                        className="mt-4"
                        style={{ fontSize: "14px", color: "#555" }}
                      >
                        <p>
                          Giá sản phẩm trên <strong>Booklovers.vn</strong> đã
                          bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào
                          loại sản phẩm, hình thức và địa chỉ giao hàng mà có
                          thể phát sinh thêm chi phí khác như{" "}
                          <em>
                            Phụ phí đóng gói, phí vận chuyển, phụ phí hàng cồng
                            kềnh,...
                          </em>
                        </p>
                        <p style={{ color: "red", marginBottom: "0" }}>
                          Chính sách khuyến mãi trên{" "}
                          <strong>Booklovers.vn</strong> không áp dụng cho hệ
                          thống nhà sách Booklovers toàn quốc
                        </p>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </Col>
            </Row>
            <ReviewsBooks bookId={bookId} />
          </Container>
        </>
      )}
    </>
  );
};

export default DetailProduct;
