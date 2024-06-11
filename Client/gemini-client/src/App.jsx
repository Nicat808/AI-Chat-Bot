import { useState } from "react";
import "./App.css";
import { DNA } from "react-loader-spinner";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const backEndURL = "http://localhost:8080/gemini";
  const sendMessage = async () => {
    if (prompt === "") return;
    setLoading(true);
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          prompt,
          history,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(backEndURL, options);
      const data = await response.json();
      setHistory((oldHistory) => [
        ...oldHistory,
        {
          role: "user",
          parts: [{ text: prompt }],
        },
        {
          role: "model",
          parts: [{ text: data?.text }],
        },
      ]);
      setPrompt("");
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container">
      <section className="search">
        <input
          className="promptInput"
          type="text"
          value={prompt}
          placeholder="Enter your message"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="promptButton"
          onClick={sendMessage}
          disabled={loading}
          style={{
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <DNA
              visible={true}
              height="60"
              width="60"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          ) : (
            "Send message"
          )}
        </button>
      </section>
      <section className="chat">
        {history.map((chat, index) => (
          <div
            className="chat-message"
            key={index}
            style={{
              marginLeft: chat.role === "user" ? "auto" : "",
            }}
          >
            <h3>{chat.role}</h3>
            <p>{chat.parts[0].text}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default App;
