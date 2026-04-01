import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Main from "./main/Main";
import { Outlet } from "react-router-dom";
import Header from "./main/header/Header";
import { Col, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useRef } from "react";
import { socket } from "../../config/socket";
import { useDispatch } from "react-redux";
import { addMessageRealtime } from "../../redux/slices/messageSlice";
import { toast } from "react-toastify";
import { addNotificationRealtime } from "../../redux/slices/notificationSlice";

const Admin = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const dispatch = useDispatch();

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/tieng-chuong.mp3");
  }, []);

  useEffect(() => {
    const unlock = () => {
      audioRef.current
        ?.play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        })
        .catch(() => {});

      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };

    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);

    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    socket.emit("join_room", "admin_room");

    const handleReceive = (data) => {
      if (data.sender_type === "user") {
        audioRef.current?.play().catch(() => {});
        toast.info(`${data.fullname}: ${data.message}`, { autoClose: 1000 });
      }

      dispatch(addMessageRealtime(data));
    };

    socket.on("receive_message", handleReceive);

    return () => socket.off("receive_message", handleReceive);
  }, [dispatch]);

  useEffect(() => {
    const handleNoti = (data) => {
      dispatch(addNotificationRealtime(data));

      if (data.type === "order") {
        audioRef.current?.play().catch(() => {});
        toast.info(`${data.title} - ${data.content}`, { autoClose: 1000 });
      }
    };

    socket.on("receive_notification", handleNoti);

    return () => socket.off("receive_notification", handleNoti);
  }, []);

  return (
    <div>
      <Header
        handleList={() => setShowSidebar(!showSidebar)}
        showSidebar={showSidebar}
      />
      <Row
        className="g-0"
        style={{ marginTop: "40px", backgroundColor: "#F3F7FD" }}
      >
        <Sidebar show={showSidebar} />

        <Col style={{ maxWidth: showSidebar ? "242px" : "64px" }}></Col>
        <Col>
          <Main>
            <Outlet />
          </Main>
        </Col>
      </Row>
    </div>
  );
};

export default Admin;
