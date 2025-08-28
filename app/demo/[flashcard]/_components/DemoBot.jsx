"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const DemoBot = ({ questiondata }) => {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [inputtext, setInputtext] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (questiondata) {
      HandleAIResp();
    }
  }, []);

  const HandleAIResp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/demo", {
        previousmessage: messages,
        questiondata: questiondata,
        usermessage: "provide me the hint of this question",
      });
      setMessages((prevMessages) => [...prevMessages, { role: "bot", content: response.data.hint }]);
    } catch (error) {
      console.error("Error in HandleAIResp:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const HandelUserMessageRespo = async () => {
    if (!inputtext.trim()) return;

    const userMessage = { role: "user", content: inputtext };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputtext("");

    try {
      setIsLoading(true);
      const userrepo = await axios.post("/api/demo", {
        previousmessage: [...messages, userMessage],
        questiondata: questiondata,
        usermessage: inputtext,
      });
      setMessages((prevMessages) => [...prevMessages, { role: "bot", content: userrepo.data.hint }]);
    } catch (error) {
      console.error("Error in HandelUserMessageRespo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      HandelUserMessageRespo();
    }
  };

  return (
    <div className="flex flex-col px-2 py-6 mr-10 absolute right-0 items-start justify-center h-[650px] w-[550px] border-2 bg-gradient-to-br from-white to-blue-600 border-black rounded-lg shadow-xl">
      <span className="px-2 text-blue-800 font-bold text-xl mb-2">AI Assistant</span>
      <div className="flex flex-col h-full w-full rounded-lg border-2 border-blue-500 bg-gradient-to-br from-blue-100 to-white relative">
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
          {messages.map((items, index) => (
            <div key={index} className={`flex ${items.role === "bot" ? "justify-start" : "justify-end"} mb-4`}>
              <div
                className={`p-3 max-w-[90%] rounded-lg ${
                  items.role === "bot"
                    ? "bg-green-400 text-black border-2 border-green-600 shadow-md"
                    : "bg-blue-500 text-white border-2 border-blue-600 shadow-md"
                }`}
              >
                {items.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t-2 border-blue-500 bg-white bg-opacity-50">
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 rounded-lg border-2 border-blue-500 focus:outline-none focus:border-blue-600 bg-white"
              placeholder="Type your message here..."
              value={inputtext}
              onChange={(e) => setInputtext(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              type="text"
            />
            <Button
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              onClick={HandelUserMessageRespo}
              disabled={isLoading || !inputtext.trim()}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBot;
