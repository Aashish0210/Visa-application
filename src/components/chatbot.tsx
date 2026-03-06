"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
    id: number;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
    link?: { label: string; href: string } | null;
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, text: "Namaste! 🙏 I am your Visa Assistant for Nepal. How can I help you with your journey today?", sender: 'bot', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg: ChatMessage = { id: Date.now(), text: inputValue, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response based on the knowledge base architecture
        // In a real app, this would be an API call to a backend AI service
        setTimeout(() => {
            let responseText = "I'm searching our official database for that information... ";
            let actionLink = null;

            const query = inputValue.toLowerCase();
            if (query.includes('document') || query.includes('require')) {
                responseText = "For a long-term visa, you generally need: 1. Passport with 6 months validity, 2. Recent passport photo, 3. Proof of accommodation, 4. Financial sustenance evidence (bank statements), and 5. Specific documents related to your visa type (Job offer for Work, Enrollment for Study).";
                actionLink = { label: "View Requirement Checklist", href: "/requirements" };
            } else if (query.includes('time') || query.includes('long')) {
                responseText = "Processing times for long-term visas typically range from 7 to 15 business days depending on the visa category and completeness of documents.";
                actionLink = { label: "Learn More About Visas", href: "/info" };
            } else if (query.includes('status') || query.includes('check') || query.includes('track')) {
                responseText = "You can check your status by clicking on 'Track Application' in the main menu and entering your Reference Number and Passport Number.";
                actionLink = { label: "Track My Application", href: "/track" };
            } else if (query.includes('appoint') || query.includes('book') || query.includes('visit')) {
                responseText = "Biometric appointments can be scheduled online after your application is processed. You can also view available slots here.";
                actionLink = { label: "Manage Appointments", href: "/appointments" };
            } else if (query.includes('hello') || query.includes('hi') || query.includes('namaste')) {
                responseText = "Namaste! I am here to assist you with the Nepal Long-Term Visa process. You can ask me about visa types, requirements, or how to track your application.";
            } else {
                responseText = "I'm here to help with visa requirements, application steps, and general queries about Nepal Long-Term Visas. Would you like to see the list of document requirements or check your eligibility?";
            }

            const botMsg: ChatMessage = {
                id: Date.now() + 1,
                text: responseText,
                sender: 'bot',
                timestamp: new Date(),
                link: actionLink
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-28 lg:bottom-6 right-4 md:right-6 z-[100]" ref={chatRef}>
            {/* Launcher */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 md:w-14 md:h-14 bg-nepal-blue rounded-full flex items-center justify-center shadow-2xl border-2 md:border-4 border-white text-white relative"
            >
                {isOpen ? <X size={20} className="md:size-6" /> : <MessageSquare size={20} className="md:size-6" />}
                {!isOpen && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-nepal-gold rounded-full border-2 border-white animate-pulse"></span>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, x: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, x: 10 }}
                        className="absolute bottom-16 md:bottom-20 right-0 w-[calc(100vw-32px)] md:w-[380px] h-[75vh] md:h-[550px] bg-white dark:bg-slate-900 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
                    >
                        <div className="bg-nepal-blue p-5 text-white flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center border border-white/20">
                                    <Bot size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Nepal Visa Helper</h3>
                                    <div className="flex items-center space-x-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                        <span className="text-xs text-white/80">Online | Available</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-end space-x-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${msg.sender === 'bot' ? 'bg-nepal-blue text-white' : 'bg-slate-200 text-slate-600'}`}>
                                            {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                                        </div>
                                        <div className={`p-3 rounded text-sm shadow-sm ${msg.sender === 'user'
                                            ? 'bg-slate-800 text-white rounded-tr-none'
                                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                                            }`}>
                                            <p>{msg.text}</p>
                                            {msg.link && (
                                                <Link
                                                    href={msg.link.href}
                                                    className="mt-3 block p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-nepal-blue font-bold text-xs flex items-center justify-between hover:bg-slate-100 transition-colors"
                                                >
                                                    <span>{msg.link.label}</span>
                                                    <ArrowRight size={14} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex items-end space-x-2 max-w-[85%]">
                                        <div className="w-8 h-8 rounded bg-nepal-blue text-white flex items-center justify-center shrink-0">
                                            <Bot size={16} />
                                        </div>
                                        <div className="p-3 bg-white rounded rounded-tl-none border border-slate-200 shadow-sm">
                                            <Loader2 className="w-4 h-4 animate-spin text-nepal-blue" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-nepal-blue focus:border-nepal-blue transition-all outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 p-2 text-nepal-blue disabled:text-slate-400 hover:bg-slate-100 rounded transition-all"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <div className="mt-3 flex justify-center">
                                <p className="text-xs text-slate-400">Visa Support • Secure Channel</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
