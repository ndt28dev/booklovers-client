// src/pages/user/account/sidebar/Sidebar.jsx

import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Col, Card, Image } from "react-bootstrap";
import avatarDefault from "../../../../../assets/image/default.jpg";
import { getUserWithAddress } from "../../../../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import API_URL from "../../../../../config/api";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.profile);

  useEffect(() => {
    dispatch(getUserWithAddress());
  }, []);

  return (
    <Card className="border-0" style={{ borderRadius: "5px" }}>
      <Card.Body>
        <div className="text-center mb-3">
          <Image
            src={
              user?.avatar?.startsWith("https://")
                ? user.avatar
                : `${API_URL}/avatar/${user?.avatar}`
            }
            roundedCircle
            style={{ width: "50px", height: "50px" }}
          />
          <div className="mt-2">
            <div className="text-muted small">Tài khoản của</div>
            <strong>{user?.fullname}</strong>
          </div>
        </div>

        <hr />

        <div className="d-flex flex-column gap-2">
          <NavLink
            to="ho-so"
            className={({ isActive }) =>
              "btn btn-light text-start fw-normal" + (isActive ? " active" : "")
            }
          >
            <i className="bi bi-person-fill me-2"></i>
            Thông tin tài khoản
          </NavLink>

          <NavLink
            to="dia-chi"
            className={({ isActive }) =>
              "btn btn-light text-start fw-normal" + (isActive ? " active" : "")
            }
          >
            <i className="bi bi-geo-alt-fill me-2"></i>
            Địa chỉ
          </NavLink>

          <NavLink
            to="don-hang"
            className={({ isActive }) =>
              "btn btn-light text-start fw-normal" + (isActive ? " active" : "")
            }
          >
            <i className="bi bi-card-checklist me-2"></i>
            Quản lý đơn hàng
          </NavLink>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Sidebar;
