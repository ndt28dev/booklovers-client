import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { Outlet } from "react-router-dom";
import ContactIcon from "../../components/contact/ContactIcon";
import UpScrollTop from "../../components/upscrolltop/UpScrollTop";
import ChatBox from "../../components/chatbox/ChatBox";

const Client = () => {
  const [showChat, setShowChat] = React.useState(false);

  const handleOpenChat = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };
  return (
    <div style={{ backgroundColor: "#F0F0F0", position: "relative" }}>
      <Header />
      <div>
        <Outlet />
      </div>
      <Footer />
      {showChat && <ChatBox onClose={handleCloseChat} />}
      {!showChat && (
        <>
          <UpScrollTop />
          <ContactIcon openChat={handleOpenChat} />
        </>
      )}
    </div>
  );
};

export default Client;
