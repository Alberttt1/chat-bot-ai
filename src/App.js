import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    // masukin pesan user dulu
    setChat((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "AI ga jawab, cek API." },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Error. Backend / API bermasalah." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="chat-box">
        <h2>AI Chatbot</h2>

        <div className="messages">
          {chat.length === 0 && (
            <div className="empty">Mulai nanya apa aja.</div>
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
            <div className="bubble ai">AI lagi mikir…</div>
          )}
        </div>

        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send} disabled={loading}>
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
