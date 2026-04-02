import React, { useState } from "react";
import SettingProduct from "./SettingProduct";
import SettingSystem from "./SettingSystem";
import SettingChatOption from "./SettingChatOption";
import SettingNotification from "./SettingNotification";

const Settings = () => {
  const [active, setActive] = useState("product");

  const tabs = [
    { key: "product", label: "Quản lý sản phẩm" },
    { key: "chat_options", label: "Hệ thống câu hỏi" },
    { key: "system", label: "Cài đặt hệ thống" },
    { key: "notification", label: "Quản lý thông báo" },
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

      <div style={{ marginTop: 10, background: "#fff", borderRadius: 10 }}>
        {active === "product" && <SettingProduct />}
        {active === "chat_options" && <SettingChatOption />}
        {active === "system" && <SettingSystem />}
        {active === "notification" && <SettingNotification />}
      </div>
    </div>
  );
};

export default Settings;
