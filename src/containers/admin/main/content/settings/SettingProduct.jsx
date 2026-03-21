import React, { useState } from "react";
import SettingSupplier from "./content/supplier/SettingSupplier";
import SettingCategory from "./content/category/SettingCategory";

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
        <div
          onClick={() => setActive("category")}
          style={{
            padding: "10px",
            cursor: "pointer",
            background: active === "category" ? "#fff1f3" : "transparent",
            borderRadius: "6px",
            marginBottom: "5px",
            fontWeight: active === "category" ? "600" : "400",
            color: active === "category" ? "#E35765" : "#000",
            borderBottom: "2px solid #ddd",
          }}
        >
          Danh mục
        </div>

        <div
          onClick={() => setActive("supplier")}
          style={{
            padding: "10px",
            cursor: "pointer",
            background: active === "supplier" ? "#fff1f3" : "transparent",
            borderRadius: "6px",
            color: active === "supplier" ? "#E35765" : "#000",
            fontWeight: active === "supplier" ? "600" : "400",
            borderBottom: "2px solid #ddd",
          }}
        >
          Nhà cung cấp
        </div>
      </div>

      <div style={{ flex: 1, padding: "10px" }}>
        {active === "category" && <SettingCategory />}
        {active === "supplier" && <SettingSupplier />}
      </div>
    </div>
  );
};

export default SettingProduct;
