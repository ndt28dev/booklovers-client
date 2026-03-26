import { useDispatch, useSelector } from "react-redux";
import MyLayoutAdmin from "../../../../../components/mylayout/MyLayoutAdmin";
import MyDataTable from "../../../../../components/mytable/MyDataTable";
import { useEffect, useState } from "react";
import {
  adminToggleReviewVisibility,
  getAllReviews,
  resetAdminToggleReviewVisibility,
} from "../../../../../redux/slices/reviewSlice";
import MyButtonDelete from "../../../../../components/button/MyButtonDelete";
import { Badge, Form } from "react-bootstrap";
import { formatDateTime } from "../../../../../utils/format";
import MyButtonEye from "../../../../../components/button/MyButtonEye";
import MyButtonHide from "../../../../../components/button/MyButtonHide";
import { toast } from "react-toastify";
import DeleteReviewModal from "./crud/DeleteReviewModal";
import Select from "react-select";
import DetailReviewModal from "./crud/DetailReviewModal";

const ratingOptions = [
  { value: "", label: "Tất cả" },
  {
    value: 5,
    label: <div className="stars">{"★".repeat(5)}</div>,
  },
  {
    value: 4,
    label: (
      <div className="stars">
        {"★".repeat(4)}
        {"☆".repeat(1)}
      </div>
    ),
  },
  {
    value: 3,
    label: (
      <div className="stars">
        {"★".repeat(3)}
        {"☆".repeat(2)}
      </div>
    ),
  },
  {
    value: 2,
    label: (
      <div className="stars">
        {"★".repeat(2)}
        {"☆".repeat(3)}
      </div>
    ),
  },
  {
    value: 1,
    label: (
      <div className="stars">
        {"★".repeat(1)}
        {"☆".repeat(4)}
      </div>
    ),
  },
];

const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "visible", label: "Hiển thị" },
  { value: "hidden", label: "Ẩn" },
];

const Reviews = () => {
  const dispatch = useDispatch();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);

  const [ratingFilter, setRatingFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");

  const { data, error, pagination } = useSelector(
    (state) => state.review.reviewList
  );

  const { success: successStatus, error: errorStatus } = useSelector(
    (state) => state.review.adminToggleReviewVisibility
  );

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const totalPages = pagination?.totalPages || 0;

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      getAllReviews({
        page: currentPage,
        limit: 10,
        rating: ratingFilter?.value,
        status: statusFilter?.value,
        search: searchText || undefined,
      })
    );
  }, [currentPage, ratingFilter, statusFilter, searchText]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (dataSelected) => {
    setIsOpenDelete(true);
    setDataSelected(dataSelected);
  };

  const handleSeeDetail = (dataSelected) => {
    setIsOpenDetails(true);
    setDataSelected(dataSelected);
  };

  const handleHide = (id) => {
    dispatch(adminToggleReviewVisibility(id));
  };

  // Hiển thị toast sau khi toggle ẩn/hiện
  useEffect(() => {
    if (successStatus) {
      toast.success("Cập nhật trạng thái thành công!");
      dispatch(resetAdminToggleReviewVisibility());
      dispatch(getAllReviews({ page: currentPage, limit: 10 }));
    } else if (errorStatus) {
      toast.error(errorStatus?.message || errorStatus);
    }
  }, [errorStatus, successStatus]);

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Sản phẩm", style: { width: "15%" } },
    { title: "Người đánh giá", style: { width: "12%", textAlign: "center" } },
    { title: "Đánh giá", style: { width: "7%", textAlign: "center" } },
    { title: "Tiêu đề", style: { width: "12%" } },
    { title: "Nội dung" },
    { title: "Trạng thái", style: { width: "8%", textAlign: "center" } },
    { title: "Thời gian", style: { width: "8%", textAlign: "center" } },
    { title: "Thao tác", style: { width: "12%", textAlign: "center" } },
  ];

  const renderRow = (review, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{review.id}</td>
      <td className="text-center align-middle">
        {(page - 1) * limit + index + 1}
      </td>
      <td className="align-middle">{review.book_name}</td>
      <td className="align-middle">{review.user_name}</td>
      <td className="align-middle text-center">
        <div className="stars">
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </div>
      </td>
      <td className="align-middle">{review.title}</td>
      <td className="align-middle">{review.comment}</td>
      <td className="align-middle text-center">
        {review.status === "visible" && <Badge bg="success">Hiển thị</Badge>}
        {review.status === "hidden" && <Badge bg="warning">Ẩn</Badge>}
      </td>
      <td className="align-middle text-center">
        {formatDateTime(review.created_at)}
      </td>
      <td className="text-center align-middle">
        <MyButtonEye onClick={() => handleSeeDetail(review)} />
        <MyButtonHide
          isHidden={review.status === "hidden"}
          onClick={() => handleHide(review.id)}
        />
        <MyButtonDelete onClick={() => handleDelete(review)} />
      </td>
    </tr>
  );

  return (
    <>
      {isOpenDelete && (
        <DeleteReviewModal
          isOpen={isOpenDelete}
          onClose={() => setIsOpenDelete(false)}
          id={dataSelected?.id}
          currentPage={currentPage}
        />
      )}
      {isOpenDetails && (
        <DetailReviewModal
          isOpen={isOpenDetails}
          onClose={() => setIsOpenDetails(false)}
          dataSelected={dataSelected}
        />
      )}
      <MyLayoutAdmin title="Danh sách đánh giá">
        <div
          className="d-flex align-items-center justify-content-end mb-2"
          style={{ gap: "10px" }}
        >
          <Select
            options={ratingOptions}
            placeholder="Chọn sao"
            value={ratingOptions.find((opt) => opt.value === ratingFilter)}
            onChange={(e) => {
              setRatingFilter(e);
              setCurrentPage(1);
            }}
            isClearable={false}
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: 38,
                width: 200,
              }),
              menu: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
          />
          <Select
            options={statusOptions}
            placeholder="Chọn trạng thái"
            value={statusOptions.find((opt) => opt.value === statusFilter)}
            onChange={(e) => {
              setStatusFilter(e);
              setCurrentPage(1);
            }}
            isClearable={false}
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: 38,
                width: 140,
              }),
              menu: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
          />
          <Form.Control
            type="text"
            placeholder="Tìm theo tiêu đề hoặc nội dung"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: "320px" }}
          />
        </div>
        <MyDataTable
          columns={columns}
          data={data}
          renderRow={renderRow}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </MyLayoutAdmin>
    </>
  );
};

export default Reviews;
