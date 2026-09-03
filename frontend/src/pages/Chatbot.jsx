import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { chatAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Chatbot() {
  const { getInitialGreeting, language } = useLanguage();
  const [messages, setMessages] = useState([
    { id: '1', role: 'model', content: getInitialGreeting() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Update greeting if language changes and chat is empty (optional refinement)
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === '1') {
      setMessages([{ id: '1', role: 'model', content: getInitialGreeting() }]);
    }
  }, [language]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage('dummy_farm', userMsg.content, null);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full">
      {/* Chat History */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 pb-[80px] space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none shadow-md shadow-primary/20' : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/50 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-[0_4px_20px_rgb(0,0,0,0.05)]'}`}>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/50 dark:border-white/10 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-2">
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area (Pinned to bottom) */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <form onSubmit={handleSend} className="bg-white/90 dark:bg-black/60 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-full p-2 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Apna sawaal likhen..." 
            className="flex-1 px-3 py-2 outline-none bg-transparent font-sans text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-primary text-white p-2.5 rounded-full disabled:opacity-50 transition-colors shadow-md shadow-primary/30"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
