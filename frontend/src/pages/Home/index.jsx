import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";

const globelKeys = {
  OUTPUT_MODE: "text",
};

function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [browserInitialized, setBrowserInitialized] = useState(false);

  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const synth = window.speechSynthesis;
  const listeningMicRef = React.useRef(null);
  const messageInputRef = React.useRef(null);

  useEffect(() => {
    const initializeBrowser = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://mern-assistant.onrender.com/ai/init"); // Replace "http://baseurl" with your API base URL
        console.log("Browser initialized:", res.data);
        setBrowserInitialized(true); // Set browser initialized state
      } catch (err) {
        console.error("Error initializing browser:", err.message);
        setBrowserInitialized(false);
      } finally {
        setLoading(false);
      }
    };

    initializeBrowser(); // Call the function when the component mounts
  }, []);
  useEffect(() => {
    const initRecognition = () => {
      if ("webkitSpeechRecognition" in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        setRecognition(recognition);
      } else {
        console.warn(
          "Speech Recognition API is not supported in this browser."
        );
      }
    };
    initRecognition();
  }, []);

  // Function to get AI response
  const getAIResponse = async () => {
    try {
      setLoading(true);
      const res = await axios.post("https://mern-assistant.onrender.com/ai/response", { prompt });
      setResponse(res.data); // Set the response text
    } catch (err) {
      console.error("Error getting AI response:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const botSpeak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    return new Promise((resolve) => {
      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);
      synth.speak(utterance);
    });
  };

  const handleMicClick = () => {
    if (recognition) {
      if (isRecording) {
        recognition.stop();
        setIsRecording(false);
        listeningMicRef.current.style.display = "none";
        messageInputRef.current.style.display = "";
      } else {
        recognition.start();
        setIsRecording(true);
        listeningMicRef.current.style.display = "block";
        messageInputRef.current.style.display = "none";
      }
    }
  };

  const handleSpeechModeToggle = () => {
    const mode = globelKeys.OUTPUT_MODE;
    const botResponse = `${
      mode === "speech" ? "Text" : "Speech"
    } Mode activated! How can I assist you?`;
    appendMessage(botResponse, "bot-responce");
    globelKeys.OUTPUT_MODE = mode === "speech" ? "text" : "speech";
    if (mode === "text") {
      setTimeout(() => {
        handleMicClick();
      }, 3000);
    }
  };

  const appendMessage = (content, type) => {
    setChatHistory((prevChat) => [...prevChat, { content, type }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      appendMessage(message, "user-input");
      setPrompt(message);
      setMessage("");
      setTimeout(async () => {
        await getAIResponse();
        const botResponce = response;
        appendMessage(botResponce, "bot-responce");
        if (globelKeys.OUTPUT_MODE === "speech") {
          const isSpeechComplete = await botSpeak(botResponce);
          if (isSpeechComplete) handleMicClick();
        }
      }, 1000);
    }
  };

  useEffect(() => {
    if (recognition) {
      recognition.addEventListener("result", (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        listeningMicRef.current.style.display = "none";
        messageInputRef.current.style.display = "";
      });

      recognition.addEventListener("error", (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        listeningMicRef.current.style.display = "none";
        messageInputRef.current.style.display = "";
      });

      recognition.addEventListener("end", () => {
        setIsRecording(false);
        listeningMicRef.current.style.display = "none";
        messageInputRef.current.style.display = "";
      });
    }
  }, [recognition]);

  return (
    <div>
      {/* <link rel="stylesheet" href={style} /> */}
      <header>
        <button className="speech-mode-btn" onClick={handleSpeechModeToggle}>
          Speech Mode
        </button>
        <a href="/signup">Sign Up</a>
      </header>
      <main>
        <div className="chat-box">
          {chatHistory.map((msg, index) => (
            <div key={index} className={msg.type}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="input-box">
          <div className="attachments">
            <i className="fa-solid fa-paperclip"></i>
          </div>
          <form className="text-box" id="input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={loading ? "Loading..." : "Type your message here..."}
              name="message"
              id="message"
              value={message}
              ref={messageInputRef}
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>
          <div className="send-box">
            <button className="mic-btn" onClick={handleMicClick}>
              <i className="fa-solid fa-microphone"></i>
            </button>
            <button className="submit-btn" type="submit" disabled={loading || !browserInitialized}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </main>
      <div className="listening-mic" ref={listeningMicRef}>
        Listening...
      </div>
    </div>
  );
}

export default Home;
