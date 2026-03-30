import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

import { fetchCustomerByHour } from "../../../../../../../redux/slices/admin/CustomerSlice";

const CustomersShoppingHours = () => {
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

  const chartOptions = [
    { value: "customers", label: "Khách hàng" },
    { value: "orders", label: "Đơn hàng" },
    { value: "revenue", label: "Doanh thu" },
  ];

  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const [chartType, setChartType] = useState(chartOptions[0]);

  const { data } = useSelector((state) => state.adminCustomer.customerByHour);

  useEffect(() => {
    dispatch(fetchCustomerByHour(selectedYear.value));
  }, [dispatch, selectedYear.value]);

  return (
    <Card
      className="mb-3"
      style={{
        border: "none",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <h6
              style={{
                color: "#E35765",
                margin: 0,
                fontWeight: "bold",
              }}
            >
              Tổng quan giờ mua của khách hàng trong năm
            </h6>
            <Select
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              options={yearOptions}
              isSearchable={false}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "34px",
                  fontSize: "14px",
                  width: "90px",
                }),
              }}
            />
          </div>
          <Select
            value={chartType}
            onChange={(value) => setChartType(value)}
            options={chartOptions}
            isSearchable={false}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "34px",
                fontSize: "14px",
                width: "140px",
              }),
            }}
          />
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.4} />

            <XAxis dataKey="hour" tickFormatter={(value) => `${value}h`} />

            <YAxis tickFormatter={(value) => value.toLocaleString("vi-VN")} />

            <Tooltip
              labelFormatter={(label) => `Giờ ${label}`}
              formatter={(value, name) => {
                const formatted = Number(value).toLocaleString("vi-VN");

                if (name === "Đơn hàng") return [formatted, name];
                if (name === "Doanh thu") return [formatted + " đ", name];
                if (name === "Khách hàng") return [formatted, name];

                return [formatted, name];
              }}
            />

            <Legend />

            {chartType.value === "orders" && (
              <Line
                type="monotone"
                dataKey="total_orders"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                name="Đơn hàng"
              />
            )}

            {chartType.value === "revenue" && (
              <Line
                type="monotone"
                dataKey="total_revenue"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                name="Doanh thu"
              />
            )}

            {chartType.value === "customers" && (
              <Line
                type="monotone"
                dataKey="total_customers"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                name="Khách hàng"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default CustomersShoppingHours;
