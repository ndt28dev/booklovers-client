import React from "react";
import "./ContactIcon.scss";
import facebook from "../../assets/image/logoicon/facebook.png";
import chat from "../../assets/image/logoicon/chat.png";
import mail from "../../assets/image/logoicon/mail.webp";
import phone from "../../assets/image/logoicon/phone.png";
import zalo from "../../assets/image/logoicon/zalo.png";

const ContactIcon = ({ openChat }) => {
  return (
    <div className="contactIcon p-1">
      <a
        href="https://www.facebook.com/duythuan28102002"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2"
      >
        <img
          src={facebook}
          alt="Facebook"
          style={{ width: "35px", height: "35px" }}
        />
      </a>
      <a
        href="https://zalo.me/0764513977"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2"
      >
        <img src={zalo} alt="Zalo" style={{ width: "35px", height: "35px" }} />
      </a>
      {/* <a href="" target="_blank" rel="noopener noreferrer">
        <img
          src={mail}
          alt="Email"
          className="mb-3"
          style={{ width: "35px", height: "35px" }}
        />
      </a> */}
      {/* <a href="https://beone.com.vn" target="_blank" rel="noopener noreferrer">
        <img
          src={phone}
          alt="Phone"
          className="mb-3"
          style={{ width: "35px", height: "35px" }}
        />
      </a> */}
      <a
        onClick={openChat}
        className="p-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={chat} alt="Chat" style={{ width: "35px", height: "35px" }} />
      </a>
    </div>
  );
};

export default ContactIcon;
