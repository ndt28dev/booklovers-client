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
    { title: "SL", style: { width: "6%", textAlign: "center" } },
    {
      title: <div style={{ fontSize: "16px", color: "#ffc107" }}>★★★★★</div>,
      style: { width: "9%", textAlign: "center" },
    },
    {
      title: <div style={{ fontSize: "16px", color: "#ffc107" }}>★★★★☆</div>,
      style: { width: "9%", textAlign: "center" },
    },
    {
      title: <div style={{ fontSize: "16px", color: "#ffc107" }}>★★★☆☆</div>,
      style: { width: "9%", textAlign: "center" },
    },
    {
      title: <div style={{ fontSize: "16px", color: "#ffc107" }}>★★☆☆☆</div>,
      style: { width: "9%", textAlign: "center" },
    },
    {
      title: <div style={{ fontSize: "16px", color: "#ffc107" }}>★☆☆☆☆</div>,
      style: { width: "9%", textAlign: "center" },
    },
  ];

  const renderRow = (product, index) => (
    <tr key={index}>
      <td className="text-center align-middle">{index + 1}</td>
      <td className="align-middle ">{product.name}</td>
      <td className="align-middle text-center">{product.total_reviews}</td>
      <td className="align-middle text-center">{product.star_5}</td>
      <td className="align-middle text-center">{product.star_4}</td>
      <td className="align-middle text-center">{product.star_3}</td>
      <td className="align-middle text-center">{product.star_2}</td>
      <td className="align-middle text-center">{product.star_1}</td>
    </tr>
  );

  return (
    <Card
      style={{
        border: "none",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
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
