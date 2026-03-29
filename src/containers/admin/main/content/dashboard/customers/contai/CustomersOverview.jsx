import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerOverview } from "../../../../../../../redux/slices/admin/CustomerSlice";

const CustomersOverview = () => {
  const dispatch = useDispatch();

  const { data, loading } = useSelector(
    (state) => state.adminCustomer.overview
  );

  useEffect(() => {
    dispatch(fetchCustomerOverview());
  }, []);

  const cards = [
    {
      title: "Tổng khách",
      value: data?.totalCustomers,
      icon: "bi-people",
      bg: "#eef2ff",
      color: "#6366f1",
    },
    {
      title: "Khách mới",
      value: data?.newCustomers,
      icon: "bi-person-plus",
      bg: "#ecfdf5",
      color: "#10b981",
    },
    {
      title: "Khách quay lại",
      value: data?.returningCustomers,
      icon: "bi-arrow-repeat",
      bg: "#fff7ed",
      color: "#f97316",
    },
    {
      title: "AOV",
      value: data?.aov.toLocaleString() + "đ",
      icon: "bi-currency-dollar",
      bg: "#fff1f3",
      color: "#e11d48",
    },
  ];

  return (
    <div className="mt-4">
      <Row>
        {cards.map((item, index) => (
          <Col md={3} key={index}>
            <Card
              className="mb-3"
              style={{
                border: "none",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
              }}
            >
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      background: item.bg,
                      color: item.color,
                      borderRadius: "50%",
                      padding: "12px 16px",
                      fontSize: "18px",
                      marginRight: "15px",
                    }}
                  >
                    <i className={`bi ${item.icon}`}></i>
                  </div>

                  <div>
                    <h6
                      className="fw-bold mb-0"
                      style={{
                        color: "#E35765",
                      }}
                    >
                      {item.title}
                    </h6>

                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CustomersOverview;
