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
import { fetchMonthlyRevenue } from "../../../../../../redux/slices/admin/statisticSlice";
import { useDispatch, useSelector } from "react-redux";

const StatisticalOverview = () => {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector(
    (state) => state.statistics.monthlyRevenue
  );

  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    dispatch(fetchMonthlyRevenue(currentYear));
  }, []);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    dispatch(fetchMonthlyRevenue(year));
  };

  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }

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
              <h5 className="mb-0 me-2" style={{ color: "#E35765" }}>
                Tổng quan
              </h5>
              <span style={{ color: "#777" }}>| {selectedYear}</span>
            </div>
            <Dropdown align="end">
              <Dropdown.Toggle
                as="div"
                bsPrefix="custom-toggle"
                id="dropdown-custom"
                style={{ color: "#777", cursor: "pointer" }}
              >
                <i className="bi bi-three-dots-vertical"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-auto" style={{ minWidth: "100px" }}>
                {years.map((year) => (
                  <Dropdown.Item
                    key={year}
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
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

export default StatisticalOverview;
