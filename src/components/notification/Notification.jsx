import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAllNotifications,
  fetchNotifications,
  markAllAsRead,
} from "../../redux/slices/notificationSlice";
import { Badge, Button } from "react-bootstrap";

const formatTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);

  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return Math.floor(diff / 60) + " phút trước";
  if (diff < 86400) return Math.floor(diff / 3600) + " giờ trước";

  return d.toLocaleDateString();
};

const Notification = ({ onClose }) => {
  const dispatch = useDispatch();
  const { list = [] } = useSelector((state) => state.notification);

  const boxRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNotifications(0));
  }, [dispatch]);

  useEffect(() => {
    dispatch(markAllAsRead(0));
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div
        ref={boxRef}
        className="position-absolute bg-white shadow rounded p-2"
        style={{
          top: "30px",
          right: "0",
          width: "400px",
          zIndex: 1000,
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="mb-0 fw-bold">Thông báo</p>
          {list.length > 0 && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => dispatch(deleteAllNotifications(0))}
            >
              Xoá tất cả
            </Button>
          )}
        </div>

        {list.length === 0 && (
          <div className="text-center text-muted py-3">Không có thông báo</div>
        )}

        {list?.map((item) => (
          <div
            key={item.id}
            className="border-top pt-2 pb-2"
            style={{
              background: item.is_read ? "#fff" : "#fef2f2",
              borderRadius: "5px",
              padding: "6px",
            }}
          >
            <p
              className="mb-1"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.content}
            </p>

            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                {formatTime(item.created_at)}
              </p>
              <Badge bg={item.type === "message" ? "success" : "primary"}>
                {item.type === "message" ? "Tin nhắn" : "Đơn hàng"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
