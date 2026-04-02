import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
  Pagination,
  Image,
} from "react-bootstrap";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import imgbook from "../../../../assets/image/imgbook.jpg";
import imgnav from "../../../../assets/image/imgnav.png";
import "./ProductPage.scss";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllBook } from "../../../../redux/slices/bookSlice";
import { useDispatch, useSelector } from "react-redux";
import slugify from "slugify";
import { fetchCategoriesWithSub } from "../../../../redux/slices/categorySlice";
import { NavLink } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import API_URL from "../../../../config/api";
import Select from "react-select";

const priceOptions = [
  { label: "Dưới 100,000₫", value: "under-100" },
  { label: "100,000₫ - 400,000₫", value: "100-400" },
  { label: "400,000₫ - 800,000₫", value: "400-800" },
  { label: "Trên 800,000₫", value: "above-800" },
];

const sortOptions = [
  { value: "", label: "Mặc định" },
  { value: "newest", label: "Sách mới" },
  { value: "discount-desc", label: "Giảm giá" },
  { value: "price-asc", label: "Giá: tăng dần" },
  { value: "price-desc", label: "Giá: giảm dần" },
];

const ProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { categorySlug, subcategorySlug } = useParams();
  const { categories } = useSelector((state) => state.category);

  const { id, name } = location.state || {};
  const { idSub, nameSub, tempCateSlug } = location.state || {};

  let parentCategory = null;

  if (idSub && categories.length > 0) {
    categories.forEach((cat) => {
      if (cat.subcategories.some((sub) => sub.id === idSub)) {
        parentCategory = cat;
      }
    });
  }

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },

    ...(id || idSub
      ? [{ label: "Sản phẩm", link: "/san-pham" }]
      : [{ label: "Sản phẩm" }]),

    ...(id ? [{ label: `${name}` }] : []),

    ...(idSub && parentCategory
      ? [
          {
            label: `${parentCategory.name}`,
          },
          {
            label: `${nameSub}`,
          },
        ]
      : []),
  ];

  const [sort, setSort] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [tempSearch, setTempSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [activeCategory, setActiveCategory] = useState(null);
  const [checkedswitch, setCheckedswitch] = useState(true);

  const [selectedPrices, setSelectedPrices] = useState([]);

  const limit = checkedswitch ? 12 : 12;

  const { listBook } = useSelector((state) => state.book.fetchBook);
  const totalPages = useSelector((state) => {
    const value = state.book.fetchBook.pagination?.totalPages;
    return value !== undefined ? value : 0;
  });

  const total = useSelector((state) => {
    const value = state.book.fetchBook.pagination?.total;
    return value !== undefined ? value : 0;
  });

  useEffect(() => {
    dispatch(fetchCategoriesWithSub());
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllBook({
        page: currentPage,
        limit,
        sort,
        search: searchKeyword,
        prices: selectedPrices,
        categoryId: id,
        subcategoryId: idSub,
      })
    );
  }, [
    dispatch,
    currentPage,
    checkedswitch,
    sort,
    searchKeyword,
    selectedPrices,
    id,
    idSub,
  ]);

  const handlePriceChange = (priceValue) => {
    setSelectedPrices((prev) =>
      prev.includes(priceValue)
        ? prev.filter((item) => item !== priceValue)
        : [...prev, priceValue]
    );
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedPrices((prev) => prev.filter((item) => item !== tagToRemove));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDetailProduct = (book) => {
    const slug = slugify(book.name, {
      lower: true,
      locale: "vi",
    });
    navigate(`/san-pham/chi-tiet-san-pham/${slug}`, {
      state: {
        bookId: book.id,
      },
    });
  };

  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />

      <Row className="mb-4">
        <Col
          md={3}
          className={checkedswitch ? "d-block" : "d-none"}
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            padding: "10px 0",
          }}
        >
          {!categorySlug && !subcategorySlug && (
            <div className="filter-section d-none d-md-block">
              <h5 className="filter-section-title mb-2 fw-bold">Danh mục</h5>
              <ul className="list-unstyled px-3">
                {categories.map((cat, idx) => (
                  <li key={cat.id}>
                    <NavLink
                      to={`/san-pham/danh-muc/${slugify(cat.name, {
                        lower: true,
                        locale: "vi",
                      })}`}
                      state={{
                        id: cat.id,
                        name: cat.name,
                      }}
                      className="dropdown-item flex-grow-1 py-2 px-3 filter-section-li d-flex justify-content-between align-items-center"
                    >
                      <span>{cat.name}</span>
                      <i className="bi bi-chevron-right category-item-icon"></i>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!categorySlug && subcategorySlug && (
            <div className="filter-section">
              <h5 className="filter-section-title mb-2 fw-bold">Thể loại</h5>
              <ul className="list-unstyled px-3">
                {categories
                  .filter(
                    (cat) =>
                      slugify(cat.name, { lower: true, locale: "vi" }) ===
                      tempCateSlug
                  )
                  .flatMap((cat) =>
                    cat.subcategories.map((sub) => (
                      <li key={sub.id} className="category-item mb-2">
                        <NavLink
                          to={`/san-pham/danh-muc-con/${slugify(sub.name, {
                            lower: true,
                            locale: "vi",
                          })}`}
                          state={{
                            idSub: sub.id,
                            nameSub: sub.name,
                            tempCateSlug: categorySlug || tempCateSlug,
                          }}
                          className={`dropdown-item filter-section-li py-2 px-3  ${
                            slugify(sub.name, { lower: true, locale: "vi" }) ===
                            subcategorySlug
                              ? "active-sub"
                              : ""
                          }`}
                        >
                          {sub.name}
                        </NavLink>
                      </li>
                    ))
                  )}
              </ul>
            </div>
          )}
          {categorySlug && (
            <div className="filter-section">
              <h5 className="filter-section-title mb-2 fw-bold">Thể loại</h5>
              <ul className="list-unstyled px-3">
                {categories
                  .filter(
                    (cat) =>
                      slugify(cat.name, { lower: true, locale: "vi" }) ===
                      categorySlug
                  )
                  .flatMap((cat) =>
                    cat.subcategories.map((sub) => (
                      <li key={sub.id} className="category-item mb-2">
                        <NavLink
                          to={`/san-pham/danh-muc-con/${slugify(sub.name, {
                            lower: true,
                            locale: "vi",
                          })}`}
                          state={{
                            idSub: sub.id,
                            nameSub: sub.name,
                            tempCateSlug: categorySlug,
                          }}
                          className="dropdown-item py-2 px-3 filter-section-li"
                        >
                          {sub.name}
                        </NavLink>
                      </li>
                    ))
                  )}
              </ul>
            </div>
          )}
          <div className="filter-section">
            <h5 className="mb-2 fw-bold filter-section-title">Giá sản phẩm</h5>
            <Form className="filter-section-form">
              {priceOptions.map((range, idx) => (
                <Form.Check
                  key={idx}
                  type="checkbox"
                  id={`price-range-${idx}`}
                  label={range.label}
                  value={range.value}
                  className="mb-2 filter-section-form-check"
                  checked={selectedPrices.includes(range.value)}
                  onChange={() => handlePriceChange(range.value)}
                />
              ))}
            </Form>
          </div>
          <div className="p-2 d-none d-md-block">
            <Image src={imgnav} fluid />
          </div>
        </Col>

        <Col md={checkedswitch === true ? 9 : 12}>
          <Container>
            <Row className="align-items-center mb-2">
              <Col
                className="d-none d-md-block"
                md={checkedswitch === true ? 2 : 4}
              >
                <Form>
                  <Form.Check
                    type="switch"
                    id="filter-toggle"
                    label={`${checkedswitch ? "Ẩn" : "Hiện"}`}
                    checked={checkedswitch}
                    onChange={(e) => setCheckedswitch(e.target.checked)}
                  />
                </Form>
              </Col>
              <Col md={checkedswitch === true ? 6 : 5} className="mt-3 mt-md-0">
                <InputGroup className="d-flex- justify-content-end">
                  <FormControl
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value.trim())}
                  />
                </InputGroup>
              </Col>
              <Col md={checkedswitch === true ? 4 : 3} className="mt-2 mt-md-0">
                <Select
                  options={sortOptions}
                  value={sortOptions.find((opt) => opt.value === sort)}
                  onChange={(selected) => {
                    setSort(selected.value);
                    setCurrentPage(1); // reset trang
                  }}
                  placeholder="Chọn sắp xếp"
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <div className="filter-result ">
                <span
                  className="result-count mt-2 mb-2 mt-md-0 mb-md-0"
                  style={{ color: "#888" }}
                >
                  {total && total} kết quả
                </span>
                {selectedPrices.map((value, index) => {
                  const matched = priceOptions.find((p) => p.value === value);
                  return (
                    <div
                      key={index}
                      className="filter-tag d-flex align-items-center"
                    >
                      <span style={{ fontSize: "14px" }}>
                        {matched?.label || value}
                      </span>
                      <span
                        className="remove-tag ms-1"
                        onClick={() => handleRemoveTag(value)}
                      >
                        ×
                      </span>
                    </div>
                  );
                })}
              </div>
            </Row>

            <Row>
              {listBook && listBook.length > 0 ? (
                listBook.map((book, idx) => (
                  <Col
                    xs={6}
                    md={checkedswitch === true ? 6 : 3}
                    lg={checkedswitch === true ? 3 : 2}
                    key={idx}
                    className="mb-4"
                  >
                    <div
                      className="product-card p-2 bg-white border rounded text-center h-100 w-100"
                      onClick={() => handleDetailProduct(book)}
                    >
                      <div className="product-image-wrapper position-relative">
                        <Image
                          src={
                            book.main_image
                              ? `${API_URL}/uploads/${book.main_image}`
                              : imgbook
                          }
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "contain",
                          }}
                          rounded
                        />
                      </div>
                      <span
                        className="mt-2 product-card-title"
                        style={{ minHeight: "40px" }}
                      >
                        {book.name}
                      </span>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="text-danger fw-bold m-0">
                          {Math.round(
                            book.price - book.price * (book.discount / 100)
                          ).toLocaleString("vi-VN")}
                          đ
                        </p>
                        {book.discount ? (
                          <p className="text-muted m-0">
                            <del>
                              {Number(book.price).toLocaleString("vi-VN")}đ
                            </del>
                          </p>
                        ) : null}
                      </div>
                      {book.discount ? (
                        <div className="discount-badge">-{book.discount}%</div>
                      ) : null}
                    </div>
                  </Col>
                ))
              ) : (
                <p className="text-center w-100">
                  Không tìm thấy sản phẩm nào.
                </p>
              )}
            </Row>
          </Container>

          <div className="d-lg-flex justify-content-center mt-1 d-none ">
            {totalPages > 1 && (
              <Pagination className="pagination-book">
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                />

                {(() => {
                  const pages = [];

                  // Trang 1
                  pages.push(
                    <Pagination.Item
                      key={1}
                      active={currentPage === 1}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </Pagination.Item>
                  );

                  // ...
                  if (currentPage > 3) {
                    pages.push(<Pagination.Ellipsis key="start-ellipsis" />);
                  }

                  // Các trang giữa
                  let start = Math.max(2, currentPage - 1);
                  let end = Math.min(totalPages - 1, currentPage + 1);

                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <Pagination.Item
                        key={i}
                        active={i === currentPage}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </Pagination.Item>
                    );
                  }

                  // ...
                  if (currentPage < totalPages - 2) {
                    pages.push(<Pagination.Ellipsis key="end-ellipsis" />);
                  }

                  // Trang cuối
                  if (totalPages > 1) {
                    pages.push(
                      <Pagination.Item
                        key={totalPages}
                        active={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </Pagination.Item>
                    );
                  }

                  return pages;
                })()}

                <Pagination.Next
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            )}
          </div>
          <div className="d-flex d-lg-none justify-content-center mt-1">
            {totalPages > 1 && (
              <Pagination className="pagination-book">
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />

                {(() => {
                  const pages = [];
                  let start = Math.max(1, currentPage - 2);
                  let end = Math.min(totalPages, currentPage + 2);

                  // Nếu gần đầu
                  if (currentPage <= 3) {
                    start = 1;
                    end = Math.min(totalPages, 5);
                  }

                  // Nếu gần cuối
                  if (currentPage >= totalPages - 2) {
                    start = Math.max(1, totalPages - 4);
                    end = totalPages;
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <Pagination.Item
                        key={i}
                        active={i === currentPage}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </Pagination.Item>
                    );
                  }

                  return pages;
                })()}

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
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
