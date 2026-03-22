import React, { useState } from "react";
import SettingProduct from "./SettingProduct";
import SettingSystem from "./SettingSystem";

const Settings = () => {
  const [active, setActive] = useState("product");

  const tabs = [
    { key: "product", label: "Quản lý sản phẩm" },
    { key: "system", label: "Cài đặt hệ thống" },
  ];

  return (
    <div>
      <div
        style={{
          display: "inline-flex",
          background: "#fff",
          borderRadius: 10,
          userSelect: "none",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActive(tab.key)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: 8,
              transition: "0.2s",
              background: active === tab.key ? "#E35765" : "transparent",
              boxShadow:
                active === tab.key ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
              fontWeight: active === tab.key ? "600" : "400",
              color: active === tab.key ? "#fff" : "#E35765",
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ marginTop: 10, background: "#fff", borderRadius: 10 }}>
        {active === "product" && <SettingProduct />}
        {active === "system" && <SettingSystem />}
      </div>
    </div>
  );
};

export default Settings;
