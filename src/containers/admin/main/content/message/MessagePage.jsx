import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessageRealtime,
  fetchChatUsers,
  fetchMessagesByUser,
  markUserSeen,
  setSelectedUser,
} from "../../../../../redux/slices/messageSlice";
import { Image } from "react-bootstrap";
import API_URL from "../../../../../config/api";
import { socket } from "../../../../../config/socket";

const formatDateLabel = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (isSameDay(d, today)) return "Hôm nay";
  if (isSameDay(d, yesterday)) return "Hôm qua";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
};

const MessagePage = () => {
  const dispatch = useDispatch();
  const { users = [], messages = [] } = useSelector((state) => state.message);

  const [activeUser, setActiveUser] = useState(null);
  const [input, setInput] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [hovered, setHovered] = useState(null);

  const chatBoxRef = useRef(null);

  const currentUser = "admin";

  useEffect(() => {
    const handleConnect = () => {
      socket.emit("join_room", "admin_room");
    };

    socket.on("connect", handleConnect);

    return () => socket.off("connect", handleConnect);
  }, []);

  useEffect(() => {
    dispatch(fetchChatUsers());
  }, [dispatch]);

  useEffect(() => {
    const handleRefresh = () => {};

    socket.on("refresh_users", handleRefresh);

    return () => socket.off("refresh_users", handleRefresh);
  }, [dispatch]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      user_id: activeUser.id,
      sender_type: "admin",
      message: input,
    };

    socket.emit("send_message", newMsg);

    setInput("");
  };

  const handleSelectMessage = (user) => {
    setActiveUser(user);
    setRoomId(user.id);

    dispatch(fetchMessagesByUser(user.id));

    dispatch(setSelectedUser(user.id));

    dispatch(markUserSeen(user.id));

    socket.emit("mark_seen", {
      user_id: user.id,
    });
  };

  useEffect(() => {
    const box = chatBoxRef.current;
    if (!box) return;

    box.scrollTo({
      top: box.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div style={{ display: "flex", height: "90vh", background: "#f1f5f9" }}>
      <div
        style={{
          width: "320px",
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h6
          style={{
            padding: "24px 16px",
            fontSize: "20px",
            color: "#E35765",
            fontWeight: "bold",
            borderBottom: "1px solid #eee",
          }}
        >
          Danh sách tin nhắn
        </h6>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {users.map((user) => {
            const isActive = activeUser?.id === user?.id;
            const isUnread = user.unread_count > 0;

            return (
              <div
                key={user.id}
                onClick={() => handleSelectMessage(user)}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  background: isActive
                    ? "#fff1f3"
                    : isUnread
                    ? "#f0f9ff"
                    : "#fff",
                  borderLeft: isActive
                    ? "4px solid #E35765"
                    : "4px solid transparent",
                }}
              >
                <Image
                  src={
                    user?.avatar.startsWith("https://")
                      ? user.avatar
                      : `${API_URL}/avatar/${user?.avatar}`
                  }
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: isUnread ? "700" : "500",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{user.fullname}</span>

                    <span style={{ fontSize: "11px", color: "#999" }}>
                      {new Date(user.last_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {/* <span style={{ fontSize: "11px", color: "#999" }}>
                      {(() => {
                        const time = new Date(user.last_time);

                        if (isNaN(time.getTime())) {
                          return new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                        }

                        return time.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      })()}
                    </span> */}
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: isUnread ? "#000" : "#64748b",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "150px",
                      }}
                    >
                      {user.last_sender === "admin"
                        ? "Bạn: " + user.last_message
                        : user.last_message}
                    </span>

                    {user.unread_count > 0 && (
                      <span
                        style={{
                          background: "#E35765",
                          color: "#fff",
                          fontSize: "11px",
                          padding: "2px 6px",
                          borderRadius: "999px",
                          marginLeft: "6px",
                        }}
                      >
                        {user.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeUser && (
          <div
            style={{
              padding: "16px",
              background: "#fff",
              borderBottom: "1px solid #e2e8f0",
              fontWeight: "600",
            }}
            className="d-flex align-items-center gap-2"
          >
            <Image
              src={
                activeUser?.avatar.startsWith("https://")
                  ? activeUser.avatar
                  : `${API_URL}/avatar/${activeUser?.avatar}`
              }
              alt=""
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>{activeUser?.fullname}</div>
          </div>
        )}

        <div
          ref={chatBoxRef}
          style={{
            flex: 1,
            padding: "10px",
            overflowY: "auto",
            background: "white",
          }}
        >
          {!activeUser ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "#999",
              }}
            >
              <i
                className="bi bi-chat-dots"
                style={{ fontSize: "40px", marginBottom: "10px" }}
              ></i>
              <div style={{ fontSize: "16px", fontWeight: "500" }}>
                Vui lòng chọn cuộc hội thoại
              </div>
              <div style={{ fontSize: "13px" }}>
                Chọn một người bên trái để bắt đầu chat
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.sender_type === currentUser;

              const prevMsg = messages[index - 1];

              const isNewDay =
                !prevMsg ||
                new Date(msg.created_at).toDateString() !==
                  new Date(prevMsg.created_at).toDateString();

              return (
                <div key={index}>
                  {isNewDay && (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "10px 0",
                        fontSize: "12px",
                        color: "#999",
                      }}
                    >
                      {formatDateLabel(msg.created_at)}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: isMe ? "flex-end" : "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        maxWidth: "60%",
                      }}
                      onMouseEnter={() => setHovered(index)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {hovered === index && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "100%",
                            left: isMe ? "auto" : "1px",
                            right: isMe ? "3px" : "auto",
                            fontSize: "11px",
                            color: "white",
                            marginBottom: "3px",
                            whiteSpace: "nowrap",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            backgroundColor: "black",
                            zIndex: 999,
                          }}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}

                      <span
                        style={{
                          display: "inline-block",
                          background: isMe ? "#E35765" : "#F0F0F0",
                          color: isMe ? "#fff" : "#000",
                          padding: "6px 12px",
                          borderRadius: "20px",
                        }}
                      >
                        {msg.message}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {activeUser && (
          <div
            style={{
              padding: "12px",
              background: "#fff",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "999px",
                border: "1px solid #ddd",
                outline: "none",
                fontSize: "14px",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button
              onClick={handleSend}
              style={{
                background: "#E35765",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Gửi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
