import React, { useState, useRef, useEffect } from 'react';
import { getFamilyAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import Skeleton from './Skeleton';

interface Props {
  onBack: () => void;
}

const AIChat: React.FC<Props> = ({ onBack }) => {
  const { user } = useUser();
  const { showToast } = useToast();
  const firstName = user.name.split(' ')[0];
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'lumina',
      text: `Hello ${firstName}. Your Family Protocol is running smoothly. Both Oliver and Maya are within their safe zones. How can I assist you with coordination today?`,
      timestamp: Date.now(),
      isAI: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, error]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'parent',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const aiResponse = await getFamilyAdvice(userMsg.text);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        senderId: 'lumina',
        text: aiResponse,
        timestamp: Date.now(),
        isAI: true
      }]);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to Lumina. Please check your connection.');
      showToast('Connection failed', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg && !lastUserMsg.isAI) {
      // Remove the last message (which failed) and try sending it again
      // Actually, better UX is to keep the message and just retry the fetch
      // But for simplicity, we'll just re-trigger the logic with the last text
      // and remove the error state.
      // Ideally we'd have a 'status' on the message itself (sending, failed, sent).
      
      // Let's just clear error and set typing to true to simulate retry
      setError(null);
      setIsTyping(true);
      
      // Re-run the API call
      getFamilyAdvice(lastUserMsg.text).then(aiResponse => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          senderId: 'lumina',
          text: aiResponse,
          timestamp: Date.now(),
          isAI: true
        }]);
        setIsTyping(false);
      }).catch(err => {
        console.error(err);
        setError('Failed to connect to Lumina. Please check your connection.');
        setIsTyping(false);
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent step-enter pt-16">
      {/* Integrated Header */}
      <div className="px-8 pt-8 pb-8 border-b border-[#D7CCC8]/30 flex items-center gap-6 sticky top-0 bg-[#FDFBFA]/80 backdrop-blur-md z-20">
        <button 
          onClick={onBack} 
          aria-label="Go back"
          className="w-12 h-12 bg-white border border-[#D7CCC8]/40 rounded-2xl flex items-center justify-center text-[#3E2723] shadow-sm active:scale-90 transition-transform"
        >
           <i className="fa-solid fa-chevron-left text-sm" aria-hidden="true"></i>
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-[#3E2723] tracking-tight">BetterPhone AI</h2>
          <div className="flex items-center gap-1.5 mt-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></div>
             <p className="text-[9px] text-[#8D6E63] font-black uppercase tracking-[0.2em]">Partner Active</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <div className="flex items-center gap-1 bg-[#3E2723] px-2 py-1 rounded-lg shadow-md">
             <i className="fa-solid fa-shield-heart text-white text-[10px]"></i>
             <span className="text-white text-[10px] font-black">98/100</span>
           </div>
           <span className="text-[8px] font-bold text-[#8D6E63] mt-0.5 uppercase tracking-wide">Safety Score</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-48" role="log" aria-label="Chat messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-7 rounded-3xl shadow-sm border ${
              msg.isAI 
                ? 'bg-white text-[#3E2723] rounded-tl-none border-[#D7CCC8]/30' 
                : 'bg-[#3E2723] text-white rounded-tr-none border-[#3E2723] shadow-xl'
            }`}>
              <p className="text-[13px] leading-relaxed font-medium tracking-tight">{msg.text}</p>
              <div className={`flex items-center gap-1.5 mt-4 opacity-30 ${msg.isAI ? 'text-[#3E2723]' : 'text-white'}`}>
                 <time className="text-[8px] font-black uppercase tracking-widest">
                   {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </time>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start" aria-live="polite" aria-label="AI is typing">
            <div className="bg-white border border-[#D7CCC8]/30 p-5 rounded-3xl rounded-tl-none flex space-x-2 shadow-sm items-center h-12">
              <div className="w-2 h-2 bg-[#3E2723] rounded-full animate-bounce" aria-hidden="true"></div>
              <div className="w-2 h-2 bg-[#3E2723] rounded-full animate-bounce [animation-delay:-.15s]" aria-hidden="true"></div>
              <div className="w-2 h-2 bg-[#3E2723] rounded-full animate-bounce [animation-delay:-.3s]" aria-hidden="true"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-4 animate-fadeIn">
            <p className="text-xs text-rose-500 font-bold">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-100 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Input Module */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 bg-[#FDFBFA]/90 backdrop-blur-md z-30 border-t border-[#D7CCC8]/20">
        {/* Suggested Prompts */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {['Is Oliver safe?', 'Analyze recent texts', 'Explain this app', 'Safety tips'].map(prompt => (
            <button
              key={prompt}
              onClick={() => setInput(prompt)}
              className="whitespace-nowrap px-4 py-2 bg-white border border-[#D7CCC8]/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#8D6E63] shadow-sm hover:border-[#3E2723]/30 active:scale-95 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 p-2 bg-white rounded-[2rem] border border-[#D7CCC8]/40 shadow-lg focus-within:border-[#3E2723] focus-within:ring-1 focus-within:ring-[#3E2723]/20 transition-all duration-300"
        >
          <label htmlFor="chat-input" className="sr-only">Message</label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Lumina..."
            className="flex-1 bg-transparent border-none py-3 px-5 text-sm font-medium text-[#3E2723] placeholder:text-[#D7CCC8] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="w-10 h-10 bg-[#3E2723] rounded-full text-white flex items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-90 hover:bg-[#2D1B19]"
          >
            <i className="fa-solid fa-arrow-up text-sm" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;