import React from "react";

const Notification = () => {
  return (
    <div>
      <div
        className="position-absolute bg-white shadow rounded p-2"
        style={{
          top: "30px",
          right: "0",
          width: "250px",
          zIndex: 1000,
        }}
      >
        <p className="mb-2 fw-bold">Thông báo</p>
        <div className="border-top pt-2">
          <p className="mb-1"> Đơn hàng #12345 đã được xác nhận.</p>
          <p className="mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
            2 phút trước
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
