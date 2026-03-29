import { useState, useEffect } from "react";
import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchRevenueGrowth } from "../../../../../../../redux/slices/admin/SalesSlice";

const RevenueGrowth = () => {
  const dispatch = useDispatch();

  const { loading, data, error } = useSelector(
    (state) => state.adminSales.revenueGrowth
  );

  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    dispatch(fetchRevenueGrowth(currentYear));
  }, [dispatch]);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    dispatch(fetchRevenueGrowth(year));
  };

  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }

  const options = years.map((year) => ({
    value: year,
    label: year,
  }));

  const chartData =
    data?.map((item) => ({
      month: Number(item.month),
      value: Number(item.value),
    })) || [];

  const pieData =
    chartData
      ?.filter((item) => item.value > 0)
      ?.map((item) => ({
        name: `T${item.month}`,
        value: item.value,
      })) || [];

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#0ea5e9",
    "#a855f7",
    "#14b8a6",
    "#f43f5e",
    "#84cc16",
    "#eab308",
    "#3b82f6",
    "#ec4899",
  ];

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
        <div className="d-flex align-items-center gap-2 mb-3">
          <h6 style={{ color: "#E35765", margin: 0, fontWeight: "bold" }}>
            Tổng quan doanh thu theo năm
          </h6>

          <Select
            options={options}
            value={options.find((opt) => opt.value === selectedYear)}
            onChange={(selected) => handleYearSelect(selected.value)}
            isSearchable={false}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "34px",
                fontSize: "14px",
                cursor: "pointer",
                width: "100px",
              }),
            }}
          />
        </div>

        <Row>
          <Col md={8}>
            <div style={{ width: "100%", height: "320px" }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="month"
                      tickFormatter={(value) => `T${value}`}
                    />

                    <YAxis
                      width={100}
                      tickFormatter={(value) => value.toLocaleString("vi-VN")}
                    />

                    <Tooltip
                      formatter={(value) =>
                        Number(value).toLocaleString("vi-VN") + " đ"
                      }
                      labelFormatter={(label) => `Tháng ${label}`}
                    />

                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  Không có dữ liệu cho năm {selectedYear}
                </div>
              )}
            </div>
          </Col>

          <Col md={4}>
            <div style={{ width: "100%", height: "300px" }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Legend />
                    <Tooltip
                      formatter={(value) =>
                        Number(value).toLocaleString("vi-VN") + " đ"
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  Không có dữ liệu biểu đồ tròn
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RevenueGrowth;
