'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, X } from 'lucide-react';
import { askChurchAssistant } from '../services/geminiService';
import { usePathname } from 'next/navigation';

interface Message {
    role: 'bot' | 'user';
    text: string;
}

const AssistantAI: React.FC = () => {
    const pathname = usePathname();

    // Don't render on login page
    if (pathname === '/login') {
        return null;
    }

    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', text: 'Paz do Senhor! Sou o assistente da Igreja Paraíso. Como posso ajudar você em sua caminhada hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [minimized, setMinimized] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        const response = await askChurchAssistant(userMsg);
        setMessages(prev => [...prev, { role: 'bot', text: response }]);
        setLoading(false);
    };

    if (minimized) {
        return (
            <button
                onClick={() => setMinimized(false)}
                className="fixed bottom-6 right-6 z-50 bg-paraiso-green text-white p-5 rounded-full shadow-[0_10px_40px_rgba(124,154,64,0.4)] hover:scale-110 transition-all flex items-center gap-3 border-2 border-white/20"
            >
                <Sparkles className="w-6 h-6" />
                <span className="hidden md:flex font-black uppercase tracking-widest text-xs pr-2">Fale Conosco</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
            {/* Header */}
            <div className="bg-paraiso-blue p-8 text-white flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Bot className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="font-black uppercase tracking-widest text-sm">Assistente Paraíso</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            <p className="text-[10px] text-paraiso-green-light uppercase font-bold tracking-tighter">Online agora</p>
                        </div>
                    </div>
                </div>
                <button onClick={() => setMinimized(true)} className="p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 no-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-auto ${m.role === 'user' ? 'bg-paraiso-green/20 text-paraiso-green' : 'bg-white shadow-sm text-slate-400 border border-slate-100'}`}>
                                {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-paraiso-green text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                                {m.text}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3">
                            <Loader2 className="w-4 h-4 animate-spin text-paraiso-green" />
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Buscando uma palavra...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-100">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Como posso te ajudar?"
                        className="w-full bg-slate-100 border-none rounded-2xl py-5 pl-7 pr-16 focus:ring-2 focus:ring-paraiso-green transition-all outline-none placeholder:text-slate-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="absolute right-3 top-3 p-3 bg-paraiso-green text-white rounded-xl hover:bg-paraiso-green-light disabled:opacity-50 transition-all shadow-lg hover:shadow-paraiso-green/20"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className=" text-[9px] text-center text-slate-400 mt-4 uppercase font-bold tracking-widest">
                    Sua mensagem é importante para nós
                </p>
            </div>
        </div>
    );
};

export default AssistantAI;
