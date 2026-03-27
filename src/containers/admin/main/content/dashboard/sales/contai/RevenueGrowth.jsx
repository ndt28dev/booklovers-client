import { useState, useEffect } from "react";
import React from "react";
import { Card, Col, Dropdown, Row } from "react-bootstrap";
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
  }, []);

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

  // Chỉ lấy các tháng có giá trị > 0
  const pieData = data
    ?.filter((item) => item.value > 0)
    ?.map((item) => ({
      name: item.name,
      value: parseFloat(item.value),
    }));

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#d88884",
    "#c45888",
    "#84c2d8",
    "#da88d8",
    "#4e73df",
  ];

  return (
    data && (
      <Card
        className="mb-4"
        style={{
          border: "none",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
      >
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex justify-content-between align-items-center ">
              <h6 className="mb-0 me-2 fw-bold" style={{ color: "#E35765" }}>
                Tổng quan doanh thu
              </h6>
              <Select
                options={options}
                placeholder="Year"
                value={options.find((opt) => opt.value === selectedYear)}
                onChange={(selected) => handleYearSelect(selected.value)}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "34px",
                    fontSize: "16px",
                    cursor: "pointer",
                    width: "100px",
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    padding: "4px",
                  }),
                }}
              />
            </div>
          </div>

          <Row>
            <Col md={8}>
              <div style={{ width: "100%", height: "300px" }}>
                {data.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4e73df"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    Không có dữ liệu biểu đồ đường cho năm {selectedYear}
                  </div>
                )}
              </div>
            </Col>

            <Col md={4}>
              <div style={{ width: "100%", height: "300px" }}>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={300} height={300}>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        fill="#8884d8"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    Không có dữ liệu biểu đồ tròn cho năm {selectedYear}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    )
  );
};
export default RevenueGrowth;
