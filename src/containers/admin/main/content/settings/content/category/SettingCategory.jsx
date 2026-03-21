import React, { useState } from "react";
import { useSelector } from "react-redux";

const SettingCategory = () => {
  const { categories: data } = useSelector((state) => state.category);
  const [openIds, setOpenIds] = useState([]);

  const toggle = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <h5 style={{ color: "#E35765" }}>Danh sách danh mục</h5>

      {data.map((cat) => (
        <div key={cat.id} style={{ marginBottom: "10px", userSelect: "none" }}>
          <div
            onClick={() => toggle(cat.id)}
            style={{
              padding: "10px",
              background: "#f5f5f5",
              cursor: "pointer",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span>
                  {openIds.includes(cat.id) ? (
                    <i class="bi bi-caret-down"></i>
                  ) : (
                    <i class="bi bi-caret-right"></i>
                  )}{" "}
                  {cat.name}{" "}
                </span>
                <span>({cat.subcategories.length})</span>
              </div>
            </div>
          </div>

          {openIds.includes(cat.id) && (
            <div style={{ paddingLeft: "20px", marginTop: "5px" }}>
              {cat.subcategories.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    padding: "6px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  - {sub.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SettingCategory;
