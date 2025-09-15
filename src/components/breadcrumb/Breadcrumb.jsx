import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumb.scss";

const Breadcrumb = ({ items }) => {
  return (
    <div className="breadcrumb-wrapper pb-3 pt-3">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {item.link ? (
            <>
              <Link to={item.link} className="ms-2">
                {item.label}
              </Link>
              <span className="separator"> </span>
            </>
          ) : (
            <span className="ms-2 me-2 current">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
