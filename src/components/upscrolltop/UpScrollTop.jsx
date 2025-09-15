import React, { useEffect, useState } from "react";
import "./UpScrollTop.scss";

const UpScrollTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div
      className={`upscroll-top ${visible ? "show" : ""}`}
      onClick={scrollToTop}
      title="Lên đầu trang"
    >
      <i className="bi bi-chevron-double-up"></i>
    </div>
  );
};

export default UpScrollTop;
