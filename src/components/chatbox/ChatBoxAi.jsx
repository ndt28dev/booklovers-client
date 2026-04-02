import { useEffect, useRef, useState } from "react";
import chat from "../../assets/image/logoicon/chat.webp";
import "./ChatBox.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesWithOptions } from "../../redux/slices/chatOptionSlice";

const ChatBoxAi = ({ onClose }) => {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);

  const [isTyping, setIsTyping] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
    },
  ]);

  const { data } = useSelector((state) => state.chatOption.categories);

  useEffect(() => {
    dispatch(fetchCategoriesWithOptions());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSelectQuestion = (opt) => {
    setMessages((prev) => [...prev, { from: "user", text: opt.question }]);

    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: opt.answer }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="chatbox-container">
      {showQuestions && (
        <div className="chatbox-questions">
          <div className="questions-header">
            <span>Bộ câu hỏi</span>
          </div>

          <div className="questions-body">
            {data?.map((cat) => (
              <div key={cat.id} className="question-group">
                <div className="fw-bold">{cat.name}</div>

                {cat.options.map((opt) => (
                  <div
                    key={opt.id}
                    className="question-item"
                    onClick={() => handleSelectQuestion(opt)}
                  >
                    <span className="dot" />
                    {opt.question}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="chatbox-wrapper shadow">
        <div className="chatbox-header">
          <div className="chat-title">
            <img src={chat} alt="bot" />
            <div>
              <div>Hỗ trợ người dùng</div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="chatbox-body" style={{ userSelect: "text" }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg ${msg.from}`}>
              <div className="bubble">{msg.text}</div>
            </div>
          ))}

          {isTyping && (
            <div className="msg bot">
              <div className="bubble typing">Đang nhập ...</div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="chatbox-footer p-2">
          <button
            className="btn btn-sm btn-outline-primary w-100"
            onClick={() => setShowQuestions(!showQuestions)}
          >
            {showQuestions ? "Ẩn bộ câu hỏi" : "Bộ câu hỏi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBoxAi;
