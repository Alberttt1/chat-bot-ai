import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    setChat((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "AI diem. API cek." },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Error. Backend lagi ngamuk." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="chat-box">

        {/* HEADER */}
        <div
          className="header glitch"
          data-text="NEURAL INTERFACE"
        >
          NEURAL INTERFACE // ONLINE
        </div>

        {/* MESSAGES */}
        <div className="messages">
          {chat.length === 0 && (
            <div className="empty">
              System online. Kirim perintah.
            </div>
          )}

          {chat.map((c, i) => (
            <div
              key={i}
              className={`bubble ${c.role === "user" ? "user" : "ai"}`}
            >
              {c.text}
            </div>
          ))}

          {loading && (
            <div className="bubble ai typing">
              processing
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type command..."
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send} disabled={loading}>
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
