import { useEffect, useState } from "react";
import { Card, Table, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchTopBooksMostReviews } from "../../../../../../../redux/slices/admin/ReviewsContactsSlice";
import MyDataTable from "../../../../../../../components/mytable/MyDataTable";

const topOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
];

const TopBooksMostReviews = () => {
  const dispatch = useDispatch();
  const { data } = useSelector(
    (state) => state.adminReviewsContacts.topBooksMostReviews
  );

  const startYear = 2023;
  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => {
      const y = currentYear - i;
      return { value: y, label: y.toString() };
    }
  );

  const [year, setYear] = useState(yearOptions[0]);
  const [top, setTop] = useState(topOptions[0]);

  useEffect(() => {
    dispatch(
      fetchTopBooksMostReviews({
        limit: top?.value,
        year: year?.value,
      })
    );
  }, [dispatch, year, top]);

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Tên sản phẩm" },
    { title: "Danh mục", style: { width: "18%" } },
    { title: "Thể loại", style: { width: "23%", textAlign: "center" } },
    { title: "Giá", style: { width: "10%", textAlign: "center" } },
    { title: "SL", style: { width: "8%", textAlign: "center" } },
  ];

  const renderRow = (product, index) => (
    <tr key={index}>
      <td className="text-center align-middle">{index + 1}</td>
      <td className="align-middle ">{product.name}</td>

      <td className="align-middle ">{product.category_name}</td>
      <td className="align-middle ">{product.subcategory_name}</td>
      <td className="align-middle text-center">
        {product.price.toLocaleString("vi-VN")}đ
      </td>
      <td className="align-middle text-center">{product.total_reviews}</td>
    </tr>
  );

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <div className="d-flex align-items-center mb-3 gap-2">
          <div className="d-flex align-items-center gap-2">
            <h6 className="fw-bold mb-0" style={{ color: "#E35765" }}>
              Top
            </h6>

            <Select
              options={topOptions}
              value={top}
              onChange={setTop}
              isClearable={false}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "34px",
                  fontSize: "14px",
                  width: "80px",
                }),
              }}
            />
          </div>
          <h6 className="fw-bold mb-0" style={{ color: "#E35765" }}>
            Top sách nhiều review nhất
          </h6>
          <Select
            options={yearOptions}
            value={year}
            onChange={setYear}
            isClearable={false}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "34px",
                fontSize: "14px",
                width: "100px",
              }),
            }}
          />
        </div>
        <MyDataTable columns={columns} data={data} renderRow={renderRow} />
      </Card.Body>
    </Card>
  );
};

export default TopBooksMostReviews;
