import React, { useState, useRef, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
// import { BsFillSendFill, BsFillChatDotsFill } from "react-icons/bs";
import "./ChatBox.scss";
import chat from "../../assets/image/logoicon/chat.webp";

const shopInfo = `
khi khách hàng hi hay chào:
- Xin chào! Tôi là nhân viên hỗ trợ khách hàng của BookLovers. Tôi có thể giúp gì cho bạn hôm nay?
 Thông tin cửa hàng:
- Tên cửa hàng: BookLovers
- Mô tả: BookLovers là cửa hàng sách chuyên cung cấp đa dạng các đầu sách tiếng Anh, lập trình, thiếu nhi, văn học, kinh tế, kỹ năng, ngoại ngữ và sách nước ngoài.
- Hình thức bán hàng: Online & Offline
- Địa chỉ: 15 Trương Hán Siêu, Phường Cư Bao, Tỉnh Đắk Lắk

 Kênh liên hệ & hỗ trợ:
- Website: https://booklovers-demo.vercel.app/
- Fanpage: https://fb.com/duythuan28102002
- Email: ndt28dev@gmail.com
- Hotline: 0764 513 977
- Zalo: 0764 513 977
- Thời gian mở cửa: 8h00 – 21h00 (Thứ 2 đến Chủ Nhật)
- Hỗ trợ khách hàng: 24/7 qua hotline, fanpage, email

Tài khoản người dùng:
- Người dùng có thể đăng ký, đăng nhập và quản lý tài khoản của mình trên website.
- Cho phép **cập nhật thông tin cá nhân** như họ tên, số điện thoại.
- Có thể **đổi mật khẩu**, cập nhật **email** hoặc thiết lập **OTP bảo mật**.
- Có thể **thiết lập, chỉnh sửa hoặc xóa địa chỉ giao hàng** trong phần "Tài khoản".
- Cho phép **xem lại lịch sử đơn hàng đã mua**, xem **chi tiết từng đơn hàng**,huỷ đơn, trạng thái vận chuyển và tổng tiền.
- Đặt hàng nhưng chưa đc xác nhận: Yêu cầu cung cấp mã đơn hàng , rồi mới trả lời quý khách thông cảm và sẽ xác nhận sớm nhất vì đang kẹt nhiều đơn
- Quên mật khẩu: Ngoài trang đăng nhập,rồi ấn vào quên mật khẩu,web sẽ hỗ trợ đổi mật khẩu

 Giao hàng & đổi trả:
- Giao hàng toàn quốc
- Miễn phí vận chuyển với đơn từ 300.000đ
- Thời gian giao hàng:
  + Buôn Ma Thuột (nội thành): 1–2 ngày
  + Tỉnh khác: 2–5 ngày làm việc
- Chính sách đổi trả: Hỗ trợ trong vòng 10 ngày kể từ khi nhận hàng
- Phí đổi trả: nếu khách hàng hỏi tới mới trả lời, khách hàng phải chịu phí giao hàng khi chuyển hàng về lại shop
- Điều kiện đổi/trả: sách lỗi, hư hỏng trong quá trình giao hàng, yều cầu liên hệ hotline để trao đổi với shop rồi mới đc đổi trả

 Thanh toán:
- Thanh toán khi nhận hàng (COD)
- Chuyển khoản qua VNPAY
- Thanh toán qua ví điện tử Momo (sắp có)


 Danh mục sách:
- Lập trình 
- Thiếu nhi
- Văn học 
- Kinh tế
- Kỹ năng
- Ngoại ngữ
- Nước ngoài

Sản phẩm:
- hỏi sản phẩm nào cứ báo còn hàng
-có bản tiếng Việt
- có bảo hành
- hình ảnh thực tế:xem trong phần sản phẩm
- đọc thử sách: đến trực tiếp tại shop

 Giá sách (ví dụ minh họa):
- Sách rẻ nhất: "Tô màu thần kỳ" – 38.000đ
- Sách đắt nhất:
  + "Phân tích tài chính doanh nghiệp" – 169.000đ
  + "Nghệ thuật tuyển dụng nhân sự" – 165.000đ
  + "Chiến lược xuất nhập khẩu" – 161.100đ

  Web hỗ trợ:
  -Bộ lọc cơ bản: tìm kiếm theo tên sản phẩm
  -Bộ lọc nâng cao: tìm kiếm theo tên sản phẩm, sắp xếp, giá sản phẩm


 Hóa đơn & dịch vụ công ty:
- Có xuất hóa đơn VAT theo yêu cầu
- Hỗ trợ đơn hàng số lượng lớn cho công ty, trường học

 Tin tức & khuyến mãi:
- Có hỗ trợ đăng ký email nhận tin
- Cập nhật khuyến mãi hàng tuần trên fanpage & website

 Gói dịch vụ khách hàng:
- Gói cơ bản: 99.000đ – Ưu tiên đóng gói & hỗ trợ đổi trả
- Gói tiêu chuẩn: 499.000đ – Miễn phí giao hàng cả năm
- Gói cao cấp: 999.000đ – Ưu tiên đặt hàng & quà tặng định kỳ

 Ứng dụng di động:
- Đang phát triển trên App Store và Google Play

 Góp ý & phản hồi:
- Gửi tại mục "Phản hồi" trên website hoặc trong phần "Cửa hàng"

Câu hỏi thường gặp (gợi ý chatbot):
- Shop có freeship không?
- Tôi muốn tìm sách lập trình?
- Tôi cần đổi/trả sách, làm sao?
- Có nhận đặt sách số lượng lớn không?
- Có hỗ trợ xuất hóa đơn công ty không?
- Mất bao lâu để giao đến Hà Nội?
- Tôi thanh toán qua Momo được không?

`;

const ChatBox = ({ onClose }) => {
  const bottomRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
    },
  ]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
        Bạn là nhân viên hỗ trợ khách hàng của cửa hàng sách BookLovers.
        
        Thông tin cửa hàng:
        ${shopInfo}
        
        Yêu cầu:
        - Trả lời bằng tiếng Việt
        - Văn phong thân thiện, dễ hiểu
        - **Giới hạn câu trả lời dưới 40 từ**
        - Trả lời ngắn gọn, đúng ý, không dông dài
        - Không lặp lại link hoặc thông tin đã nói
        -  Không được phép chào như "Chào bạn", "Xin chào" hoặc tương tự
        - Nếu không đủ thông tin, hãy xin lỗi và mời khách liên hệ CSKH
        
        Câu hỏi của khách hàng:
        ${userMessage}
                  `,
                },
              ],
            },
          ],
        }),
      });

      const result = await response.json();
      const reply =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Xin lỗi, tôi chưa hiểu yêu cầu của bạn.";

      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (err) {
      console.error("Lỗi API:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Đã xảy ra lỗi. Vui lòng thử lại sau." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="chatbox-wrapper shadow">
        <div className="chatbox-header">
          <div className="chat-title">
            <img src={chat} alt="bot" />
            <div>
              <div>Hỗ trợ người dùng</div>
            </div>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close chat"
          >
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

        <div className="chatbox-footer">
          <div className="input-wrapper">
            <Form.Control
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="send-btn" onClick={handleSend}>
              <i className="bi bi-send-fill fs-5" style={{ color: "#fff" }}></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
