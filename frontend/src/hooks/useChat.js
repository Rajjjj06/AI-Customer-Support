import { useState, useCallback } from "react";
import { chatWithBot } from "../services/chatBot";
import { toast } from "sonner"; // For error notifications

const INITIAL_MESSAGES = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi! I'm your AI assistant. I've been trained on your uploaded documents. Ask me anything about your knowledge base!",
  },
];

export const useChat = (botId) => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = useCallback(async (text) => {
        if (!text.trim() || isTyping) return;

        const userMsg = { id: String(Date.now()), role: 'user', content: text.trim() };
        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        try {
            // Prepare history to send to backend, dropping the system mock msg for Groq
            // Also we map into the format `{ role: "user"/"assistant", content: "..."}`
            const history = messages
                .filter(m => m.id !== '1') // Don't send initial hardcoded response
                .map(m => ({ role: m.role, content: m.content }));
            
            const reqData = {
                question: text.trim(),
                history: history
            };
            
            const response = await chatWithBot(botId, reqData);
            
            setMessages((prev) => [
              ...prev,
              { id: String(Date.now() + 1), role: 'assistant', content: response.answer },
            ]);
        } catch (error) {
            console.error("Chat API error:", error);
            toast.error("Failed to fetch response. Check backend logs.");
            setMessages((prev) => [
                ...prev,
                { id: String(Date.now() + 1), role: 'assistant', content: "Sorry, I ran into an error processing your request." },
            ]);
        } finally {
            setIsTyping(false);
        }
    }, [botId, isTyping, messages]);

    const resetChat = useCallback(() => {
        setMessages(INITIAL_MESSAGES);
    }, []);

    return {
        messages,
        isTyping,
        sendMessage,
        resetChat,
    };
};
