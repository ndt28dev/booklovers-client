import React, { useState } from "react";
import SettingSupplier from "./content/supplier/SettingSupplier";
import SettingCategory from "./content/category/SettingCategory";
import SettingRoles from "./content/roles/SettingRoles";

const menuItems = [
  { key: "category", label: "Danh mục", component: <SettingCategory /> },
  { key: "supplier", label: "Nhà cung cấp", component: <SettingSupplier /> },
  { key: "roles", label: "Phân Quyền", component: <SettingRoles /> },
];

const SettingProduct = () => {
  const [active, setActive] = useState("category");

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        style={{
          width: "220px",
          borderRight: "1px solid #ddd",
          padding: "10px",
        }}
      >
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => setActive(item.key)}
            style={{
              padding: "10px",
              cursor: "pointer",
              background: active === item.key ? "#fff1f3" : "transparent",
              borderRadius: "6px",
              marginBottom: "5px",
              fontWeight: active === item.key ? "600" : "400",
              color: active === item.key ? "#E35765" : "#000",
              borderBottom: "2px solid #ddd",
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: "10px", minHeight: "80vh" }}>
        {menuItems.find((item) => item.key === active)?.component}
      </div>
    </div>
  );
};

export default SettingProduct;
