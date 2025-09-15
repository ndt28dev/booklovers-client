import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import "../sidebar/Sidebar.scss";

const Sidebar = ({ show }) => {
  return (
    <div
      className="sidebar-container bg-white p-2"
      style={{
        boxShadow: "4px 0px 8px rgba(99, 99, 99, 0.1)",
        height: "100vh",
        overflowY: "auto",
        position: "fixed",
        top: "40px",
        left: 0,
        width: show ? "240px" : "64px",
        zIndex: 2,
      }}
    >
      <Nav className="flex-column p-1">
        <NavLink to="/admin/trang-chu" className="sidebar-link mb-2">
          <i className="bi bi-grid"></i>
          {show && <span className="ms-2">Trang chủ</span>}
        </NavLink>
        <NavLink to="/admin/san-pham" className="sidebar-link mb-2">
          <i className="bi bi-book"></i>
          {show && <span className="ms-2">Sản phẩm</span>}
        </NavLink>
        <NavLink to="/admin/don-hang" className="sidebar-link mb-2">
          <i className="bi bi-cash-coin"></i>
          {show && <span className="ms-2">Đơn hàng</span>}
        </NavLink>
        <NavLink to="/admin/nguoi-dung" className="sidebar-link mb-2">
          <i className="bi bi-people"></i>
          {show && <span className="ms-2">Người dùng</span>}
        </NavLink>
        <NavLink to="/admin/bai-viet" className="sidebar-link mb-2">
          <i className="bi bi-journal-text"></i>
          {show && <span className="ms-2">Bài viết</span>}
        </NavLink>
        <NavLink to="/admin/khuyen-mai" className="sidebar-link mb-2">
          <i className="bi bi-gift"></i>
          {show && <span className="ms-2">Khuyến mãi</span>}
        </NavLink>
        <NavLink to="/admin/phan-hoi" className="sidebar-link mb-2">
          <i className="bi bi-envelope"></i>
          {show && <span className="ms-2">Phản hồi</span>}
        </NavLink>
        <NavLink to="/admin/cai-dat" className="sidebar-link mb-2">
          <i className="bi bi-gear"></i>
          {show && <span className="ms-2">Cài đặt</span>}
        </NavLink>
      </Nav>
    </div>
  );
};

export default Sidebar;
