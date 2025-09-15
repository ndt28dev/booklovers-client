import React, { use, useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import { Navbar, Container, Badge } from "react-bootstrap";
import {
  getAdminUserProfile,
  logoutAdmin,
} from "../../../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../../../../components/notification/Notification";
import API_URL from "../../../../config/api";

const Header = ({ handleList, showSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.profileAdmin);

  const [show, setShow] = useState(false);

  useEffect(() => {
    dispatch(getAdminUserProfile());
  }, []);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    window.location.href = "/admin/dang-nhap";
  };
  return (
    <div
      className="d-flex justify-content-between align-items-center px-3 fixed-top bg-white"
      style={{ zIndex: 4 }}
      // style={{ zIndex: 4, boxShadow: "0px 4px 8px rgba(99, 99, 99, 0.1)" }}
    >
      <Nav className="d-flex justify-content-between align-items-center ">
        <span className="fs-4 me-4 fw-bold" style={{ color: "#E35765" }}>
          Booklover
        </span>
        <div style={{ cursor: "pointer" }} onClick={handleList}>
          <i
            className={`bi bi-chevron-double-${
              showSidebar ? "left" : "right"
            } fs-5`}
          ></i>
        </div>
      </Nav>

      <Nav className="d-flex justify-content-between align-items-center ">
        <div
          className="me-4"
          style={{ position: "relative ", cursor: "pointer" }}
          onClick={() => setShow(!show)}
        >
          <i className="bi bi-bell fs-5 "></i>

          <Badge
            className="rounded-pill bg-danger position-absolute "
            style={{
              right: "-5px",
              top: "-1px",
              fontSize: "0.6rem",
            }}
          >
            1
          </Badge>

          {show && <Notification />}
        </div>
        <Dropdown>
          <Dropdown.Toggle
            as="div"
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <div style={{ width: "40px", height: "40px" }}>
                <Image
                  src={
                    user?.avatar && user.avatar?.startsWith("http")
                      ? user.avatar
                      : `${API_URL}/avatar/${user?.avatar}`
                  }
                  roundedCircle
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <span className="ms-2 fs-6">{user?.fullname}</span>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => console.log("Trang cá nhân")}>
              <i className="bi bi-person-fill me-2"></i>Profile
            </Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => handleLogout()}
              className="text-danger"
            >
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </div>
  );
};

export default Header;
