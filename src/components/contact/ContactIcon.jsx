import React, { useEffect } from "react";
import "./ContactIcon.scss";
import facebook from "../../assets/image/logoicon/facebook.png";
import chat from "../../assets/image/logoicon/chat.png";
import mail from "../../assets/image/logoicon/mail.webp";
import phone from "../../assets/image/logoicon/phone.png";
import zalo from "../../assets/image/logoicon/zalo.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchSystemSettings } from "../../redux/slices/admin/systemSlice";
// import chat from "../../assets/image/logoicon/chat.webp";

const ContactIcon = ({ openChat }) => {
  const dispatch = useDispatch();

  const { settings } = useSelector((state) => state.system);

  useEffect(() => {
    dispatch(fetchSystemSettings());
  }, []);
  return (
    <div className="contactIcon p-1">
      <a
        href={`${settings?.facebook}`}
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
        href={`https://zalo.me/${settings?.zalo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2"
      >
        <img src={zalo} alt="Zalo" style={{ width: "35px", height: "35px" }} />
      </a>

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
