import { useState } from 'react';

const INITIAL_CHATBOTS = [
  {
    id: '1',
    name: 'Customer Support Bot',
    company: 'Acme Corp',
    description: 'Handles customer queries using our knowledge base',
    documents: 12,
    createdAt: '2026-02-15',
    totalChats: 1247,
  },
  {
    id: '2',
    name: 'Product FAQ Bot',
    company: 'Acme Corp',
    description: 'Answers product-related questions from documentation',
    documents: 8,
    createdAt: '2026-02-28',
    totalChats: 856,
  },
  {
    id: '3',
    name: 'HR Policy Assistant',
    company: 'Acme Corp',
    description: 'Helps employees find HR policies and procedures',
    documents: 5,
    createdAt: '2026-03-05',
    totalChats: 324,
  },
];

export function useChatbots() {
  const [chatbots, setChatbots] = useState(INITIAL_CHATBOTS);

  const addChatbot = (bot) => {
    const newBot = {
      ...bot,
      id: String(Date.now()),
      documents: 0,
      createdAt: new Date().toISOString().split('T')[0],
      totalChats: 0,
    };
    setChatbots((prev) => [...prev, newBot]);
    return newBot;
  };

  const getChatbot = (id) => chatbots.find((b) => b.id === id);

  const deleteChatbot = (id) => {
    setChatbots((prev) => prev.filter((b) => b.id !== id));
  };

  return { chatbots, addChatbot, getChatbot, deleteChatbot };
}
