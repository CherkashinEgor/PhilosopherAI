'use client'
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [selectedPhilosopher, setSelectedPhilosopher] = useState("Marcus Aurelius");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      "message": "Hi there! I'm here to imitate your chosen philosopher. Ask away!",
      "type": "apiMessage"
    }
  ]);

  async function getIndex() {
    try {
      const result = await fetch('/api/setup', {
        method: 'POST',
      })
      const json = await result.json()
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  useEffect(() => { getIndex() }, [])

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      const messageList = messageListRef.current;
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if(textAreaRef.current){
      textAreaRef.current.focus();
    }
  }, []);

  const handleError = () => {
    setMessages((prevMessages) => [...prevMessages, { "message": "Oops! There seems to be an error. Please try again.", "type": "apiMessage" }]);
    setLoading(false);
    setUserInput("");
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { "message": userInput, "type": "userMessage" }]);    
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        question: userInput, 
        history: history,
        philosopher: selectedPhilosopher 
      }),
    });

    if (!response.ok) {
      handleError();
      return;
    }
    
    setUserInput("");
    const data = await response.json();

    setMessages((prevMessages) => [...prevMessages, { "message": data['data'], "type": "apiMessage" }]);
    setLoading(false);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    // if (messages.length >= 5) {
      setHistory([
        messages
      ]);
    // }
  }, [messages]);

  return (
<div className="flex flex-col items-center justify-start min-h-screen pt-10 px-4 lg:px-0 bg-gradient-to-br from-stone-50 via-indigo-100 to-emerald-200">
    <title>Philosopher AI</title>
    <div className="space-y-6 w-full max-w-5xl mb-12 mt-16">
        <h1 className="text-6xl font-bold text-center text-emerald-900">
            Welcome to <a>Philosopher AI!</a>
        </h1>
        <p className="text-2xl text-center text-emerald-700">
            Bring timeless wisdom to the modern day with the power of AI. Get personalized advice on modern day issues from the greatest thinkers of all time.
        </p>
    </div>

    <div className="mt-32 p-6 w-full max-w-7xl bg-mantis-900 shadow-lg rounded-lg space-y-6 text-stone-700">
        <div className="flex items-center space-x-4 mb-4">
            <span className="text-lg font-semibold">Select who you want advice from:</span>
            <select className="h-12 border-2 border-gray-300 w-1/4" onChange={(e) => {setSelectedPhilosopher(e.target.value); setMessages([
                {
                  "message": "Hi there! I'm here to imitate your chosen philosopher. Ask away!",
                  "type": "apiMessage"
                }
            ])}}>
                <option value="Marcus Aurelius">Marcus Aurelius</option>
                <option value="Rene Descartes">Rene Descartes</option>
            </select>
        </div>

        <div className="flex flex-row items-center space-x-4 mb-4 text-stone-700">
            <textarea
                ref = {textAreaRef}
                disabled = {loading}
                onKeyDown={handleEnter}
                id = "userInput"
                name = "userInput"
                placeholder = {loading? "Waiting for response..." : "Ask your question here"}
                value = {userInput}
                onChange= {e => setUserInput(e.target.value)}
                className="border-2 border-gray-300 h-12 flex-grow"

            />
            <button className="border-2 border-black h-10 px-5 relative" onClick={handleSubmit}>
        {loading ? 
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <CircularProgress color="inherit" size={20}/> 
            </div> :
            <svg viewBox='0 0 20 20' className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" xmlns='http://www.w3.org/2000/svg'>
                <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
            </svg>
        }
    </button>
        </div>

      <div ref={messageListRef} className="mt-4 border-2 border-black p-4 w-full h-64 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={message.type === "userMessage" && loading && index === messages.length - 1 ? "flex justify-end mb-2 opacity-70" : message.type === "apiMessage" ? "flex justify-start mb-2" : "flex justify-end mb-2"}>
                  <div className={message.type === "userMessage" ? "p-2 rounded-md bg-gray-300" : "p-2 rounded-md bg-blue-200"}>
                      {/* Use ReactMarkdown to render messages in Markdown format */}
                      <ReactMarkdown linkTarget="_blank">{message.message}</ReactMarkdown>
                  </div>
              </div>
            ))}
        </div>
        
    </div>
</div>

  )
}
