import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatUsers } from "../../../../../redux/slices/messageSlice";
import { Image } from "react-bootstrap";
import API_URL from "../../../../../config/api";

const MessagePage = () => {
  const dispatch = useDispatch();
  const { users = [], messages: data = [] } = useSelector(
    (state) => state.message
  );

  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const currentUser = "admin";

  useEffect(() => {
    dispatch(fetchChatUsers());
  }, [dispatch]);

  useEffect(() => {
    setActiveUser(users[0]);
  }, [users]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender_type: "admin",
      message: input,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const handleSelectMessage = (user) => {
    setActiveUser(user);
    dispatch(fetchMessagesByUser(user.id));
  };

  console.log(data);
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f1f5f9" }}>
      {/* ===== SIDEBAR ===== */}
      <div
        style={{
          width: "320px",
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
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
            const isActive = activeUser === user.id;

            return (
              <div
                key={user.id}
                onClick={() => setActiveUser(user)}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  background: isActive ? "#eef2ff" : "#fff",
                  transition: "0.2s",
                  borderLeft: isActive
                    ? "4px solid #6366f1"
                    : "4px solid transparent",
                }}
              >
                <Image
                  src={
                    user?.avatar.startsWith("https://")
                      ? user.avatar
                      : `${API_URL}/avatar/${user?.avatar}`
                  }
                  alt=""
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600" }}>{user.fullname}</div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}
                  >
                    {user.last_sender === "admin"
                      ? "Bạn: " + user.last_message
                      : user.last_message}
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

        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
          }}
        >
          {!activeUser ? (
            <div style={{ textAlign: "center", color: "#999" }}>
              Chọn 1 cuộc chat để bắt đầu
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_type === currentUser;

              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      background: isMe ? "#6366f1" : "#e2e8f0",
                      color: isMe ? "#fff" : "#000",
                      padding: "10px 14px",
                      borderRadius: "18px",
                      maxWidth: "60%",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    }}
                  >
                    {msg.message}
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
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button
              onClick={handleSend}
              style={{
                background: "#6366f1",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "999px",
                cursor: "pointer",
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
