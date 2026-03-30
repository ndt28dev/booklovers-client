import { useEffect, useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopCustomersByYear } from "../../../../../../../redux/slices/admin/CustomerSlice";
import { formatDate } from "../../../../../../../utils/format";
import Select from "react-select";
import MyDataTable from "../../../../../../../components/mytable/MyDataTable";

const limitOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
];

const CustomersTopBuy = () => {
  const dispatch = useDispatch();

  const currentYear = new Date().getFullYear();
  const minYear = 2023;

  const yearOptions = Array.from(
    { length: currentYear - minYear + 1 },
    (_, i) => {
      const year = currentYear - i;
      return { value: year, label: `${year}` };
    }
  );

  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const [limit, setLimit] = useState(limitOptions[0]);

  const { data } = useSelector(
    (state) => state.adminCustomer.topCustomersByYear
  );

  useEffect(() => {
    dispatch(
      fetchTopCustomersByYear({
        year: selectedYear.value,
        limit: limit.value,
      })
    );
  }, [dispatch, selectedYear, limit]);

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Họ và tên", style: { width: "15%" } },

    { title: "Đơn đầu tiên", style: { width: "6%", textAlign: "center" } },
    { title: "Đơn gần nhất", style: { width: "6%", textAlign: "center" } },
    { title: "Loại KH", style: { width: "6%", textAlign: "center" } },
    { title: "Số đơn", style: { width: "6%", textAlign: "center" } },
    { title: "TB mỗi đơn", style: { width: "6%", textAlign: "center" } },
    {
      title: "Tổng tiền",
      style: { width: "10%", textAlign: "center" },
    },
  ];

  const renderRow = (customer, index) => (
    <tr key={index}>
      <td className="text-center align-middle">{index + 1}</td>
      <td className="align-middle ">{customer.fullname}</td>
      <td className="align-middle text-center">
        {formatDate(customer.first_order_date)}
      </td>
      <td className="align-middle text-center">
        {formatDate(customer.last_order_date)}
      </td>
      <td className="align-middle text-center">
        {customer.customer_type === "VIP" ? (
          <Badge bg="primary">Khách VIP</Badge>
        ) : customer.customer_type === "LOYAL" ? (
          <Badge bg="success">Trung thành</Badge>
        ) : (
          <Badge bg="warning">Khách mới</Badge>
        )}
      </td>
      <td className="align-middle text-center">{customer.total_orders}</td>
      <td className="align-middle text-center">
        {customer.avg_order_value.toLocaleString("vi-VN")}đ
      </td>
      <td className="align-middle text-center">
        {customer.total_spent.toLocaleString("vi-VN")}đ
      </td>
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
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="d-flex align-items-center gap-2">
            <h6
              style={{
                color: "#E35765",
                margin: 0,
                fontWeight: "bold",
              }}
            >
              Top
            </h6>

            <Select
              value={limit}
              onChange={(val) => {
                setLimit(val);
                setCurrentPage(1);
              }}
              options={limitOptions}
              isSearchable={false}
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
          <h6
            style={{
              color: "#E35765",
              margin: 0,
              fontWeight: "bold",
            }}
          >
            khách hàng trong năm
          </h6>
          <Select
            value={selectedYear}
            onChange={(val) => {
              setSelectedYear(val);
              setCurrentPage(1);
            }}
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
        <MyDataTable columns={columns} data={data} renderRow={renderRow} />
      </Card.Body>
    </Card>
  );
};
export default CustomersTopBuy;
