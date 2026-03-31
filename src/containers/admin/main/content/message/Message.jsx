import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// ⚠️ chỉ tạo 1 socket duy nhất ngoài component
export const socket = io("http://localhost:8081");

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const senderId = 1; // giả lập
  const receiverId = 2; // giả lập
  const roomId = "1_2";

  // 👉 join room khi vào component
  useEffect(() => {
    socket.emit("join_room", roomId);
  }, []);

  // 👉 nhận tin nhắn realtime
  useEffect(() => {
    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, []);

  // 👉 gửi tin nhắn
  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      roomId,
      senderId,
      receiverId,
      message,
    };

    socket.emit("send_message", msgData);

    // thêm vào UI luôn (optimistic UI)
    setMessages((prev) => [...prev, msgData]);

    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Chat realtime</h3>

      {/* Danh sách tin nhắn */}
      <div
        style={{
          height: 300,
          border: "1px solid #ccc",
          marginBottom: 10,
          overflowY: "auto",
          padding: 10,
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.senderId === senderId ? "right" : "left",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                background: msg.senderId === senderId ? "#6366f1" : "#eee",
                color: msg.senderId === senderId ? "#fff" : "#000",
                padding: "6px 10px",
                borderRadius: 8,
                display: "inline-block",
              }}
            >
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      {/* Input gửi tin */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
};

export default Message;
