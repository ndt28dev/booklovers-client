import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopOrdersByYear } from "../../../../../../../redux/slices/admin/SalesSlice";
import { Badge, Button, Card } from "react-bootstrap";
import MyDataTable from "../../../../../../../components/mytable/MyDataTable";
import { formatDate } from "../../../../../../../utils/format";
import Select from "react-select";
import DetailOrderModal from "../../../../../../../components/detailorder/DetailOrder";
import { fetchOrderById } from "../../../../../../../redux/slices/orderSlice";

const limitOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
];

const TopOrderByYear = () => {
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [limit, setLimit] = useState(limitOptions[0]);

  const { data } = useSelector((state) => state.adminSales.topOrdersByYear);

  const { currentOrder } = useSelector((state) => state.order.orderDetail);

  useEffect(() => {
    dispatch(
      fetchTopOrdersByYear({
        year: selectedYear.value,
        limit: limit.value,
      })
    );
  }, [dispatch, selectedYear, limit]);

  const handleViewDetail = (order) => {
    setShowDetailModal(true);
    dispatch(fetchOrderById(order.id));
  };

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Mã đơn", style: { width: "6%", textAlign: "center" } },
    { title: "Họ và tên", style: { width: "15%" } },
    {
      title: "Địa chỉ giao hàng",
      style: { width: "25%" },
    },
    {
      title: "Thanh toán",
      style: { width: "10%", textAlign: "center" },
    },
    { title: "Ngày đặt", style: { width: "6%", textAlign: "center" } },
    { title: "Tổng tiền", style: { width: "9%", textAlign: "center" } },
    { title: "Thao tác", style: { width: "6%", textAlign: "center" } },
  ];

  const renderRow = (order, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{order.id}</td>
      <td className="text-center align-middle">{index + 1}</td>
      <td className="align-middle text-center">{order.order_code}</td>
      <td className="align-middle">{order.fullname}</td>
      <td>{order.location}</td>
      <td className="align-middle text-center">
        {order.payment_method === "cod" ? (
          <Badge bg="secondary">Tiền mặt</Badge>
        ) : (
          <Badge bg="success">VNPAY</Badge>
        )}
      </td>
      <td className="align-middle text-center">
        {formatDate(order.order_date)}
      </td>
      <td className="align-middle text-center">
        {Number(order.total_price).toLocaleString("vi-VN")}đ
      </td>
      <td className="align-middle text-center">
        <Button
          className="me-2"
          variant="success"
          onClick={() => handleViewDetail(order)}
          size="sm"
        >
          <i className="bi bi-eye"></i>
        </Button>
      </td>
    </tr>
  );

  return (
    <>
      {showDetailModal && (
        <DetailOrderModal
          show={showDetailModal}
          handleClose={() => setShowDetailModal(false)}
          order={currentOrder}
        />
      )}
      <Card
        className=""
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
              đơn hàng trong năm
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
    </>
  );
};
export default TopOrderByYear;
