import { useState, useEffect, useCallback } from "react";
import { Bot, Sparkles } from "lucide-react";

interface FloatingAIBotProps {
  onLoginClick: () => void;
}

export function FloatingAIBot({ onLoginClick }: FloatingAIBotProps) {
  const [showBubble, setShowBubble] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const messages = [
    "Hello! I'm your AI assistant 😊",
    "Login to ask me about invoices, due dates, and reminders.",
    "I can help you find overdue invoices 🤖",
    "Need help with payment reminders? Just ask!",
    "Your invoice assistant is ready to help 💼"
  ];

  // Auto-rotate messages
  const showNextMessage = useCallback(() => {
    if (showLoginPrompt) return;
    
    setShowBubble(true);
    setCurrentMessage(prev => (prev + 1) % messages.length);
    
    // Hide after 4 seconds
    setTimeout(() => {
      setShowBubble(false);
    }, 4000);
  }, [showLoginPrompt, messages.length]);

  // Initial show and interval
  useEffect(() => {
    // Show first message after 2 seconds
    const initialTimer = setTimeout(() => {
      showNextMessage();
    }, 2000);

    // Then show messages every 8-12 seconds randomly
    const interval = setInterval(() => {
      const randomDelay = Math.random() * 4000; // 0-4 second random offset
      setTimeout(showNextMessage, randomDelay);
    }, 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [showNextMessage]);

  const handleClick = () => {
    setShowBubble(false);
    setShowLoginPrompt(true);
    setTimeout(() => {
      setShowLoginPrompt(false);
    }, 4000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Speech Bubbles - Auto rotating */}
      {showBubble && !showLoginPrompt && (
        <div className="animate-fade-in-up max-w-[280px]">
          <div className="relative bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl rounded-br-sm px-4 py-3 shadow-xl shadow-primary/10">
            <p className="text-sm text-foreground leading-relaxed">
              {messages[currentMessage]}
            </p>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-card/95 border-r border-b border-primary/20 transform rotate-45" />
          </div>
        </div>
      )}

      {/* Login Prompt Bubble */}
      {showLoginPrompt && (
        <div className="animate-fade-in-up max-w-[260px]">
          <div 
            className="relative bg-primary/90 backdrop-blur-xl border border-primary rounded-2xl rounded-br-sm px-4 py-3 shadow-xl shadow-primary/20 cursor-pointer hover:bg-primary transition-colors"
            onClick={onLoginClick}
          >
            <p className="text-sm text-primary-foreground font-medium leading-relaxed">
              Please login to start chatting 🔐
            </p>
            <p className="text-xs text-primary-foreground/80 mt-1">
              Click here to login
            </p>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-primary/90 border-r border-b border-primary transform rotate-45" />
          </div>
        </div>
      )}

      {/* Floating AI Bot Avatar */}
      <button
        onClick={handleClick}
        className="group relative w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary/90 to-purple-600 shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all duration-500 hover:scale-105 animate-float-bot"
        aria-label="AI Assistant"
      >
        {/* Outer glow ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-purple-500/50 to-primary/50 rounded-full blur-md opacity-60 group-hover:opacity-80 animate-glow-pulse" />
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary/90 to-purple-600 shadow-inner" />
        
        {/* Bot face container */}
        <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden">
          {/* Shine effect */}
          <div className="absolute top-1 left-2 w-6 h-3 bg-white/20 rounded-full blur-sm transform -rotate-45" />
          
          {/* Bot icon / face */}
          <div className="relative flex flex-col items-center justify-center">
            <Bot className="w-7 h-7 text-primary-foreground drop-shadow-lg" />
          </div>
          
          {/* Animated sparkle */}
          <Sparkles className="absolute top-2 right-2 w-3 h-3 text-white/70 animate-pulse" />
        </div>

        {/* Online indicator */}
        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
      </button>
    </div>
  );
}

export default FloatingAIBot;
