// invoice-hub/src/components/Chatbot.tsx
import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatAPI } from "@/lib/api"; // ✅ USE MSAL-SECURED API

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
  meta?: any;
}

const CHARACTERS = ["🤖", "🐱", "🐭", "🐻", "🐤"];
const BUBBLE_COLORS = ["#e0f7ff", "#f3e8ff", "#ffeede", "#e9ffe3", "#fff7d9", "#ede9fe"];

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [bubbleColor, setBubbleColor] = useState(BUBBLE_COLORS[0]);
  const [isSending, setIsSending] = useState(false);

  const SESSION_KEY = "chat_session_id";

  useEffect(() => {
    const interval = setInterval(() => setCurrentCharacter((p) => (p + 1) % CHARACTERS.length), 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setIsAnimating((p) => !p), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const shown = sessionStorage.getItem("chatbot_greeting_shown");
    if (!shown) {
      const show = setTimeout(() => {
        setBubbleColor(BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]);
        setShowGreeting(true);
        sessionStorage.setItem("chatbot_greeting_shown", "true");
      }, 2500);
      const hide = setTimeout(() => setShowGreeting(false), 9500);
      return () => { clearTimeout(show); clearTimeout(hide); };
    }
  }, []);

  useEffect(() => {
    if (isHovering) setBubbleColor(BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]);
  }, [isHovering]);

  const pushMessage = (msg: Message) => setMessages((p) => [...p, msg]);

  const downloadBase64File = (base64: string, filename: string) => {
    try {
      const bytes = atob(base64);
      const out = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) out[i] = bytes.charCodeAt(i);
      const blob = new Blob([out], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    pushMessage(userMsg);
    setInputValue("");
    setIsSending(true);

    try {
      let sessionId = sessionStorage.getItem(SESSION_KEY) || undefined;

      const payload = await chatAPI.send(userMsg.text, sessionId);

      if (payload?.sessionId) {
        sessionStorage.setItem(SESSION_KEY, payload.sessionId);
      }

      if (payload?.source === "csv" && payload.csvBase64) {
        pushMessage({
          id: "ai-" + Date.now(),
          text: `✅ CSV generated with ${payload.count || "some"} rows. Download should start shortly.`,
          sender: "ai",
          timestamp: new Date().toISOString(),
          meta: payload,
        });
        downloadBase64File(payload.csvBase64, payload.filename);
      } else if (payload?.text) {
        pushMessage({
          id: "ai-" + Date.now(),
          text: payload.text,
          sender: "ai",
          timestamp: new Date().toISOString(),
        });
      } else {
        pushMessage({
          id: "ai-" + Date.now(),
          text: "No response from AI.",
          sender: "ai",
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      pushMessage({
        id: "err-" + Date.now(),
        text: err?.message || "Error contacting AI server.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = async () => {
    const sid = sessionStorage.getItem(SESSION_KEY);
    if (sid) {
      try {
        await chatAPI.closeChat(sid);
      } catch (e) {
        console.warn("Failed to close chat session", e);
      }
      sessionStorage.removeItem(SESSION_KEY);
    }
    setIsOpen(false);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <>
          {(showGreeting || isHovering) && (
            <div className="fixed bottom-20 right-6 md:bottom-24 lg:bottom-28 xl:bottom-32 z-50 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2 zoom-in-95">
              <div className="relative px-4 py-3 rounded-2xl shadow-xl max-w-[200px] animate-[float_3s_ease-in-out_infinite] transition-colors duration-200" style={{ backgroundColor: bubbleColor }}>
                <div className="text-sm font-medium leading-relaxed text-gray-800">
                  {isHovering ? "Click me to ask anything!" : "Hi! I'm your AI assistant ✨ Ask anything about invoices!"}
                </div>
                <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 transition-colors duration-200" style={{ borderTopColor: bubbleColor }} />
              </div>
            </div>
          )}

          <Button onClick={() => setIsOpen(true)} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} className={`fixed bottom-6 right-6 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:scale-110 z-50 bg-gradient-to-br from-tii-purple to-tii-purple/80 hover:from-tii-purple-hover hover:to-tii-purple hover:ring-4 hover:ring-tii-purple/30 ${isAnimating ? 'animate-[bounce-slow_3s_ease-in-out_infinite]' : ''}`} size="icon">
            <span className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl transition-all duration-500 ease-in-out ${isAnimating ? 'animate-[float_2s_ease-in-out_infinite]' : ''}`}>{CHARACTERS[currentCharacter]}</span>
          </Button>
        </>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] max-w-[90vw] h-[70vh] max-h-[600px] bg-background rounded-2xl shadow-2xl border z-50 flex flex-col transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-4 zoom-in-95">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-tii-purple/10 to-tii-purple/5 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-xl">👋</span>
              <div>
                <h3 className="font-semibold text-sm">Ask AI • Quick Answers</h3>
                <p className="text-xs text-muted-foreground">Ask about invoices, due amounts, last paid, overdue status, logs, etc.</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-muted-foreground">
                <MessageCircle className="h-12 w-12 opacity-20" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Start a conversation</p>
                  <p className="text-xs px-6">Ask about invoices, due amounts, last paid bill, overdue status, reminders, etc.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-300`}>
                    <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-md ${message.sender === "user" ? "bg-gradient-to-br from-teal-400 to-emerald-400 text-white" : "bg-gradient-to-br from-tii-purple-light to-tii-purple/40 text-gray-800 animate-[float_3s_ease-in-out_infinite]"}`}>
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t bg-card rounded-b-2xl">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your question…"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isSending}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
