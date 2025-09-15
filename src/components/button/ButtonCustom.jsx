import React from "react";
import { Button } from "react-bootstrap";
import "../button/ButtonCustom.scss";

const ButtonCustom = ({
  onClick,
  bgrColor,
  text = "Đăng nhập",
  color,
  icon,
  border,
  fontWeight,
  disabled,
}) => {
  const isReactElement = typeof text !== "string";

  return (
    <Button
      className="buttoncustom d-flex align-items-center justify-content-center"
      style={{
        fontWeight: fontWeight || "",
        border: border || "none",
        backgroundColor: bgrColor || "primary",
        color: color || "#fff",
        minHeight: "42px",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Nếu text là chuỗi và có icon thì hiển thị icon */}
      {!isReactElement && icon && <i className={`me-1 ${icon}`}></i>}

      {/* Nội dung nút */}
      <div style={{ display: "flex", alignItems: "center" }}>{text}</div>
    </Button>
  );
};

export default ButtonCustom;
