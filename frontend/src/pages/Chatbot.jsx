import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, PlusCircle, Sprout, MessageSquare, Menu, Trash2, X } from 'lucide-react';
import { chatAPI, farmsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

// Component to simulate a typing effect for newly arrived AI messages
const TypewriterMessage = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      // Reveal 3 characters at a time for a fast, smooth typing effect
      index += 3;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 15);

    return () => clearInterval(interval);
  }, [text]);

  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
};

export default function Chatbot() {
  const { getInitialGreeting, language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([
    { id: '1', role: 'model', content: getInitialGreeting() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFarmId, setActiveFarmId] = useState(location.state?.farmId || null);
  const [farmsList, setFarmsList] = useState([]);
  const [fetchingFarm, setFetchingFarm] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const sendMessageToBot = async (text, farmId = activeFarmId, imageFile = null) => {
    if ((!text.trim() && !imageFile) || !farmId) return;

    let content = text;
    if (imageFile) {
       const imagePreviewUrl = URL.createObjectURL(imageFile);
       content = `![Attached Image](${imagePreviewUrl})\n\n${text}`;
    }

    const userMsg = { id: Date.now().toString(), role: 'user', content: content };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(farmId, text, language, imageFile);
      // The backend returns the ChatMessage object which has 'content'
      const botMsg = { 
        id: response.id || (Date.now() + 1).toString(), 
        role: 'model', 
        content: response.content,
        isNew: true // Flag to trigger typewriter effect
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errMsg = { id: (Date.now() + 1).toString(), role: 'model', content: 'Sorry, I encountered an error communicating with the server.' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!activeFarmId) return;
    try {
      await chatAPI.deleteHistory(activeFarmId);
      toast.success("Chat deleted successfully");
      setShowDeleteModal(false);
      setActiveFarmId(null);
    } catch (e) {
      console.error("Failed to delete chat", e);
      toast.error("Failed to delete chat history.");
    }
  };

  const switchChat = (id) => {
    setActiveFarmId(id);
    setIsSidebarOpen(false);
    // Remove autoMsg from location state when switching chats
    window.history.replaceState({}, document.title);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    await sendMessageToBot(input, activeFarmId, selectedImage);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    } else if (file) {
      toast.error('Please select a valid image file');
    }
    e.target.value = null; // reset input
  };

  useEffect(() => {
    // Fetch farms list for the lobby once on mount
    const fetchFarms = async () => {
      try {
        const farms = await farmsAPI.getFarms();
        setFarmsList(farms || []);
      } catch (err) {
        console.error("Failed to load farms", err);
      }
    };
    fetchFarms();
  }, []);

  // When activeFarmId changes, load the chat history for that farm
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!activeFarmId) {
        // We are in the lobby
        setFetchingFarm(false);
        return;
      }
      
      setFetchingFarm(true);
      try {
        const history = await chatAPI.getHistory(activeFarmId);
        if (history && history.messages && history.messages.length > 0) {
          setMessages(history.messages.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content
          })));
        } else {
          setMessages([]);
          if (location.state?.autoMsg && activeFarmId !== "general") {
            // If there's no history and we navigated with autoMsg, send an auto message!
            await sendMessageToBot(`Hi! Let's discuss ${location.state.farmName || 'my farm'}. Please review my recent activities and current weather, and give me some advice!`, activeFarmId);
          } else if (activeFarmId !== "general") {
            // Send an automatic contextual greeting from the bot if it's a specific farm
            setMessages([{ id: '1', role: 'model', content: `Hello! I have loaded your farm context. How can I help you with your crop today?` }]);
          } else {
            setMessages([{ id: '1', role: 'model', content: getInitialGreeting() }]);
          }
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
        setMessages([{ id: '1', role: 'model', content: getInitialGreeting() }]);
      } finally {
        setFetchingFarm(false);
      }
    };

    loadChatHistory();
  }, [activeFarmId]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].id === '1') {
      setMessages([{ id: '1', role: 'model', content: getInitialGreeting() }]);
    }
  }, [language]);

  if (fetchingFarm) {
    return <div className="flex-1 flex items-center justify-center">{t('chatbot.loading')}</div>;
  }

  // CHAT LOBBY VIEW
  if (!activeFarmId) {
    return (
      <div className="flex-1 flex flex-col relative w-full h-full">
        {/* Top action bar - Lobby (Only Hamburger) */}
        <div className="absolute top-2 right-4 z-20 flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title="Switch Chat"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Sidebar / Drawer */}
        {isSidebarOpen && (
          <>
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            <div className="absolute top-0 right-0 bottom-0 w-3/4 max-w-sm bg-slate-50 dark:bg-slate-900 z-40 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right-full duration-200">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-800">
                <h3 className="font-black text-slate-800 dark:text-white text-lg">{t('chatbot.your_chats')}</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <button 
                  onClick={() => { setActiveFarmId(null); setIsSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors"
                >
                  <PlusCircle size={20} />
                  {t('chatbot.start_new')}
                </button>
                <div className="h-4"></div>
                
                <button 
                  onClick={() => switchChat("general")}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${activeFarmId === 'general' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'}`}
                >
                  <MessageSquare size={18} />
                  {t('chatbot.general_chat')}
                </button>

                {farmsList.map(f => (
                  <button 
                    key={f.id}
                    onClick={() => switchChat(f.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${activeFarmId === f.id ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-bold' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'}`}
                  >
                    <Sprout size={18} />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto pb-32 pt-16">
          <div className="text-center mt-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">{t('chatbot.start_chat')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {t('chatbot.select_context')}
            </p>
          </div>

          <div className="space-y-3 mt-6">
            <button 
              onClick={() => switchChat("general")}
              className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-white/50 dark:border-white/10 flex items-center gap-4 shadow-sm hover:scale-[1.02] active:scale-95 transition-transform text-left"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                <MessageSquare size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-white text-lg">{t('chatbot.general_chat')}</span>
                <span className="text-sm text-slate-500 font-medium">{t('chatbot.general_desc')}</span>
              </div>
            </button>

            {farmsList.map(f => (
              <button 
                key={f.id}
                onClick={() => switchChat(f.id)}
                className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-green-100 dark:border-green-900/30 flex items-center gap-4 shadow-sm hover:scale-[1.02] active:scale-95 transition-transform text-left"
              >
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <Sprout size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 dark:text-white text-lg">{t('chatbot.chat_about')} {f.name}</span>
                  <span className="text-sm text-slate-500 font-medium">{f.crop_type} • {f.area} Acres</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE CHAT VIEW
  return (
    <div className="flex-1 flex flex-col relative w-full h-full">
      {/* Top action bar */}
      <div className="absolute top-2 right-4 z-20 flex items-center gap-2">
        <button 
          onClick={handleDeleteChat}
          className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-red-500 shadow-sm border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
          title="Delete Chat History"
        >
          <Trash2 size={20} />
        </button>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          title="Switch Chat"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar / Drawer */}
      {isSidebarOpen && (
        <>
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="absolute top-0 right-0 bottom-0 w-3/4 max-w-sm bg-slate-50 dark:bg-slate-900 z-40 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right-full duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-800">
              <h3 className="font-black text-slate-800 dark:text-white text-lg">{t('chatbot.your_chats')}</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button 
                onClick={() => { setActiveFarmId(null); setIsSidebarOpen(false); }}
                className="w-full flex items-center gap-3 p-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors"
              >
                <PlusCircle size={20} />
                {t('chatbot.start_new')}
              </button>
              <div className="h-4"></div>
              
              <button 
                onClick={() => switchChat("general")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${activeFarmId === 'general' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'}`}
              >
                <MessageSquare size={18} />
                {t('chatbot.general_chat')}
              </button>

              {farmsList.map(f => (
                <button 
                  key={f.id}
                  onClick={() => switchChat(f.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${activeFarmId === f.id ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-bold' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'}`}
                >
                  <Sprout size={18} />
                  <span className="truncate">{f.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Chat History */}
      <div ref={chatContainerRef} dir="ltr" className="flex-1 overflow-y-auto p-4 pt-16 pb-[80px] space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none shadow-md shadow-primary/20' : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/50 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-[0_4px_20px_rgb(0,0,0,0.05)]'}`}>
              <div dir={msg.role === 'model' && language === 'ur' ? 'rtl' : 'ltr'} className={`prose prose-sm dark:prose-invert max-w-none ${msg.role === 'user' ? 'prose-p:text-white prose-strong:text-white prose-a:text-white' : ''}`}>
                {msg.isNew && msg.role === 'model' ? (
                  <TypewriterMessage text={msg.content} onComplete={scrollToBottom} />
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/50 dark:border-white/10 p-4 rounded-2xl rounded-bl-none flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div dir="ltr" className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-slate-900 dark:via-slate-900 z-10">
        {selectedImage && (
          <div className="mb-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-md inline-block relative border border-slate-200 dark:border-slate-700 ml-4">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition-colors"
            >
              <X size={12} />
            </button>
            <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="h-16 w-auto rounded object-cover" />
          </div>
        )}
        <form onSubmit={handleSend} className="relative flex items-center bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 p-1 pl-4 pr-1">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedImage ? t('chatbot.type_message', 'Add a message with this image...') : t('chatbot.type_message')}
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 dark:text-white py-3 placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 transition-colors ${selectedImage ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
          >
            <Paperclip size={20} />
          </button>
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="p-3 bg-primary text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
