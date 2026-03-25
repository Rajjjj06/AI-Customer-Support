import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, Loader2 } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import { useChat } from '@/hooks/useChat';

export default function WidgetPage() {
  const { id } = useParams();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  
  // Reuse our powerful custom hook!
  const { messages, isTyping, sendMessage } = useChat(id);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background font-sans overflow-hidden">
      {/* Widget Header */}
      <div className="flex flex-none items-center gap-3 p-4 bg-primary text-primary-foreground shadow-sm">
        <Bot className="h-6 w-6" />
        <div>
          <h2 className="text-sm font-semibold">Support Copilot</h2>
          <p className="text-xs opacity-80">We reply immediately</p>
        </div>
      </div>
      
      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
         {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm">Typing...</div>
            </div>
          )}
      </div>

      {/* Input Area */}
      <div className="flex-none p-3 border-t bg-card">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            className="flex-1 rounded-full px-4"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping} size="icon" className="rounded-full">
             {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
