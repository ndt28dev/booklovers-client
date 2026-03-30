import { useEffect, useState } from "react";
import { Card, Col, Row, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestWorstBooks } from "../../../../../../../redux/slices/admin/ProductsImportsSlice";
import MyDataTable from "../../../../../../../components/mytable/MyDataTable";
import Select from "react-select";

const ProductsBestWorst = () => {
  const dispatch = useDispatch();

  const startYear = 2023;
  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => {
      const year = startYear + i;
      return { value: year, label: year };
    }
  ).reverse();

  const [year, setYear] = useState(yearOptions[0]);

  const { data, loading } = useSelector(
    (state) => state.adminProductsImports.bestWorstBooks
  );

  useEffect(() => {
    dispatch(fetchBestWorstBooks(year.value));
  }, [dispatch, year]);

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Tên sản phẩm" },

    { title: "Giá", style: { width: "10%", textAlign: "center" } },
    { title: "SL", style: { width: "10%", textAlign: "center" } },
  ];

  const renderRow = (product, index) => (
    <tr key={index}>
      <td className="text-center align-middle">{index + 1}</td>
      <td className="align-middle ">{product.name}</td>
      <td className="align-middle text-center">
        {product.price.toLocaleString("vi-VN")}đ
      </td>
      <td className="align-middle text-center">{product.sold_quantity}</td>
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
        <div className="d-flex gap-2 align-items-center mb-3">
          <h6 className="fw-bold mb-0" style={{ color: "#E35765" }}>
            Top sách bán chạy & ít bán
          </h6>

          <Select
            value={year}
            onChange={setYear}
            options={yearOptions}
            isSearchable={false}
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

        <Row>
          <Col md={6}>
            <MyDataTable
              columns={columns}
              data={data?.bestSelling}
              renderRow={renderRow}
            />
          </Col>

          <Col md={6}>
            <MyDataTable
              columns={columns}
              data={data?.worstSelling}
              renderRow={renderRow}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductsBestWorst;
