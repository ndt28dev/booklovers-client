import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const RevenueOverview = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const getWeekRange = () => {
    const now = new Date();

    const dayOfWeek = now.getDay() || 7;

    const start = new Date(now);
    start.setDate(now.getDate() - dayOfWeek + 1);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    // format dd/mm
    const format = (date) =>
      `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

    return `${format(start)} - ${format(end)}`;
  };

  const weekRange = getWeekRange();

  return (
    <Row className="mb-2">
      <Col md={3}>
        <Card
          className=" mb-3 "
          style={{
            border: "none",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
          }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="me-1 fw-bold" style={{ color: "#E35765" }}>
                Doanh thu trong ngày {day}/{month}
              </span>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <i
                className="bi bi-cart rounded-circle me-3 fs-5"
                style={{
                  backgroundColor: "#fff1f3",
                  color: "#E35765",
                  padding: "10px 14px",
                }}
              ></i>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {Number(300000).toLocaleString("vi-VN")}
                </div>
                <div
                  className={`${
                    Number(-12) > 0
                      ? "text-success"
                      : Number(-12) < 0
                      ? "text-warning"
                      : "text-muted"
                  }`}
                >
                  {Number(-12) > 0 && (
                    <>
                      <i className="bi bi-graph-up-arrow me-1"></i>
                      {Number(-12)}% so với tháng trước
                    </>
                  )}

                  {Number(-12) < 0 && (
                    <>
                      <i className="bi bi-graph-down-arrow me-1"></i>
                      {Math.abs(Number(-12))}% so với tháng trước
                    </>
                  )}

                  {Number(-12) === 0 && <>Không thay đổi</>}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card
          className=" mb-3 "
          style={{
            border: "none",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
          }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="me-1 fw-bold" style={{ color: "#E35765" }}>
                Doanh thu tuần {weekRange}
              </span>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <i
                className="bi bi-cart rounded-circle me-3 fs-5"
                style={{
                  backgroundColor: "#fff1f3",
                  color: "#E35765",
                  padding: "10px 14px",
                }}
              ></i>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {Number(1200000).toLocaleString("vi-VN")}
                </div>
                <div
                  className={`${
                    Number(25) > 0
                      ? "text-success"
                      : Number(25) < 0
                      ? "text-warning"
                      : "text-muted"
                  }`}
                >
                  {Number(25) > 0 && (
                    <>
                      <i className="bi bi-graph-up-arrow me-1"></i>
                      {Number(25)}% so với tháng trước
                    </>
                  )}

                  {Number(25) < 0 && (
                    <>
                      <i className="bi bi-graph-down-arrow me-1"></i>
                      {Math.abs(Number(25))}% so với tháng trước
                    </>
                  )}

                  {Number(25) === 0 && <>Không thay đổi</>}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card
          className=" mb-3 "
          style={{
            border: "none",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
          }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="me-1 fw-bold" style={{ color: "#E35765" }}>
                Doanh thu tháng {month}/{year}
              </span>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <i
                className="bi bi-cart rounded-circle me-3 fs-5"
                style={{
                  backgroundColor: "#fff1f3",
                  color: "#E35765",
                  padding: "10px 14px",
                }}
              ></i>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {Number(1500000).toLocaleString("vi-VN")}
                </div>
                <div
                  className={`${
                    Number(-12) > 0
                      ? "text-success"
                      : Number(-12) < 0
                      ? "text-warning"
                      : "text-muted"
                  }`}
                >
                  {Number(-12) > 0 && (
                    <>
                      <i className="bi bi-graph-up-arrow me-1"></i>
                      {Number(-12)}% so với tháng trước
                    </>
                  )}

                  {Number(-12) < 0 && (
                    <>
                      <i className="bi bi-graph-down-arrow me-1"></i>
                      {Math.abs(Number(-12))}% so với tháng trước
                    </>
                  )}

                  {Number(-12) === 0 && <>Không thay đổi</>}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card
          className=" mb-3 "
          style={{
            border: "none",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
          }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="me-1 fw-bold" style={{ color: "#E35765" }}>
                Doanh thu trong năm {year}
              </span>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <i
                className="bi bi-cart rounded-circle me-3 fs-5"
                style={{
                  backgroundColor: "#fff1f3",
                  color: "#E35765",
                  padding: "10px 14px",
                }}
              ></i>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {Number(5600000).toLocaleString("vi-VN")}
                </div>
                <div
                  className={`${
                    Number(0) > 0
                      ? "text-success"
                      : Number(0) < 0
                      ? "text-warning"
                      : "text-muted"
                  }`}
                >
                  {Number(0) > 0 && (
                    <>
                      <i className="bi bi-graph-up-arrow me-1"></i>
                      {Number(0)}% so với tháng trước
                    </>
                  )}

                  {Number(0) < 0 && (
                    <>
                      <i className="bi bi-graph-down-arrow me-1"></i>
                      {Math.abs(Number(0))}% so với tháng trước
                    </>
                  )}

                  {Number(0) === 0 && <>Không thay đổi</>}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default RevenueOverview;
