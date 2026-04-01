import { useEffect, useRef, useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchSystemSettings } from "../../../../../redux/slices/admin/systemSlice";
import API_URL from "../../../../../config/api";
import { getUserWithAddress } from "../../../../../redux/slices/userSlice";
import {
  addMessageRealtime,
  fetchMessagesByUser,
  setSelectedUser,
} from "../../../../../redux/slices/messageSlice";
import { socket } from "../../../../../config/socket";

const safeDate = (value) => {
  const d = new Date(value);
  return value && !isNaN(d.getTime()) ? d : null;
};

const formatDateLabel = (date) => {
  const d = safeDate(date);
  if (!d) return "";

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

const MessagePageClient = () => {
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [hovered, setHovered] = useState(null);

  const { settings } = useSelector((state) => state.system);
  const { user } = useSelector((state) => state.user.profile);
  const { messages = [] } = useSelector((state) => state.message);

  const chatBoxRef = useRef(null);

  useEffect(() => {
    dispatch(fetchSystemSettings());
    dispatch(getUserWithAddress());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchMessagesByUser(user.id));
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      socket.emit("join_room", user.id);
    }
  }, [user]);

  const currentUser = "user";

  useEffect(() => {
    const handleReceive = (data) => {
      if (data.user_id === user?.id) {
        dispatch(
          addMessageRealtime({
            ...data,
            created_at: data.created_at || new Date().toISOString(),
          })
        );
      }
    };

    socket.on("receive_message", handleReceive);

    return () => socket.off("receive_message", handleReceive);
  }, [dispatch, user]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      user_id: user?.id,
      sender_type: "user",
      message: input,
      created_at: new Date().toISOString(),
    };

    dispatch(setSelectedUser(user?.id));

    socket.emit("send_message", newMsg);

    setInput("");
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
    <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div>
            <h5 className="mb-1" style={{ fontWeight: "bold", color: "black" }}>
              Booklovers Shop
            </h5>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  marginTop: "3px",
                }}
              ></span>
              <span style={{ fontSize: "13px", color: "#22c55e" }}>
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>

        <div
          ref={chatBoxRef}
          style={{
            flex: 1,
            padding: "10px",
            overflowY: "auto",
          }}
        >
          {messages.map((msg, index) => {
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
          })}
        </div>

        <div
          style={{
            padding: "14px",
            borderTop: "1px solid #eee",
            display: "flex",
            gap: "10px",
            background: "#fff",
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
      </div>
    </div>
  );
};

export default MessagePageClient;
