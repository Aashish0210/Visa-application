"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles, ArrowRight, Shield } from 'lucide-react';
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
    const [userContext, setUserContext] = useState<any>(null);

    // Official Site Knowledge Base for AI
    const KNOWLEDGE_BASE = {
        location: "Kupandol, Lalitpur, Nepal",
        contact: "+977-1-4429660 | support@immigration.gov.np",
        visa_types: ["Working", "Business", "Study", "Tourist"],
        fees: {
            "Working": "$300 (1 Year)",
            "Business": "$250 (1 Year)",
            "Study": "$150 (1 Semester)",
            "Tourist": "$30 (15 Days), $50 (30 Days), $125 (90 Days)"
        },
        requirements: "Passport (6m validity), Photos, Fee Receipt, and specific documents (Job Letter, Enrollment, or Bank Statements).",
        office_hours: "Sunday to Friday, 10:00 AM - 5:00 PM"
    };

    useEffect(() => {
        const session = localStorage.getItem('pf_user_session');
        if (session) {
            setUserContext(JSON.parse(session));
        }
    }, []);

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

        // Highly Responsive AI Logic Simulation
        setTimeout(() => {
            let responseText = "";
            let actionLink = null;
            const q = inputValue.toLowerCase().trim();

            // 1. Basic Greetings
            if (q === 'hi' || q === 'hello' || q === 'namaste' || q === 'hey') {
                responseText = userContext
                    ? `Namaste, **${userContext.name}**! Welcome back. How can I assist you with your visa today?`
                    : "Namaste! I am your Nepal Visa Assistant. How can I help you today?";
            }
            // 2. Visa Categories & General Lists
            else if (q.includes('visa') && (q.includes('type') || q.includes('different') || q.includes('list') || q.includes('what') || q.includes('available') || q.includes('info'))) {
                responseText = "Nepal offers several visa categories for international visitors through this portal: \n\n• **Tourist Visa**: For leisure and short visits ($30+)\n• **Working Visa**: For official employment ($300)\n• **Business Visa**: For investors and traders ($250)\n• **Study Visa**: For students in recognized institutions ($150)\n\nWhich one would you like to explore in detail?";
                actionLink = { label: "Compare All Visas", href: "/info" };
            }
            // 3. Specific Visa Details
            else if (q.includes('tourist')) {
                responseText = "The **Tourist Visa** is the most common. It costs **$30** (15 days), **$50** (30 days), or **$125** (90 days). It's a multiple-entry visa. You can apply on arrival or here to skip the line.";
                actionLink = { label: "Tourist Requirements", href: "/requirements" };
            }
            else if (q.includes('business')) {
                responseText = `The **Business Visa** is designed for investors. It costs **${KNOWLEDGE_BASE.fees.Business}** for 1 year. Key documents: Investment certificate from the Dept. of Industries and business registration.`;
                actionLink = { label: "Business Checklist", href: "/requirements" };
            }
            else if (q.includes('work') || q.includes('working')) {
                responseText = `The **Working Visa** costs **${KNOWLEDGE_BASE.fees.Working}** for a year. You MUST have an appointment letter and a labor permit. We handle the document verification as the first step.`;
                actionLink = { label: "Apply for Work Visa", href: "/apply" };
            }
            else if (q.includes('study') || q.includes('student') || q.includes('education')) {
                responseText = `The **Study Visa** is **${KNOWLEDGE_BASE.fees.Study}** per semester. You'll need an admission letter from a Nepali University and proof of financial support.`;
                actionLink = { label: "Study Requirements", href: "/requirements" };
            }
            // 4. Documents & Requirements
            else if (q.includes('document') || q.includes('paper') || q.includes('need') || q.includes('require')) {
                responseText = "Basic requirements for ALL visas: \n1. Original Passport (valid for 6 months)\n2. Digital Photo (white background)\n3. Previous Visa copy (if applicable)\n4. Specific Letters (Job/Business/Admission).";
                actionLink = { label: "Detailed Document Guide", href: "/requirements" };
            }
            // 5. Processing Time & Validity
            else if (q.includes('time') || q.includes('long') || q.includes('duration') || q.includes('fast')) {
                responseText = "Standard processing is **7-15 business days**. Once approved, your visa validity starts from the date of entry into Nepal. You can track your real-time progress in the 'Track' section.";
                actionLink = { label: "Track My Progress", href: "/track" };
            }
            // 6. Location & Contact
            else if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('office') || q.includes('kupandol')) {
                responseText = `Our official headquarters is located in **${KNOWLEDGE_BASE.location}**. Visit us Sunday through Friday, between 10:00 AM and 5:00 PM for biometrics or inquiries.`;
                actionLink = { label: "See Map Location", href: "/info#location" };
            }
            else if (q.includes('phone') || q.includes('email') || q.includes('contact') || q.includes('call') || q.includes('support')) {
                responseText = `For urgent support, call us at **+977-1-4429660** or email **support@immigration.gov.np**. Our technical team responds within 24 hours.`;
            }
            // 7. Procedures & Fees
            else if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('money') || q.includes('pay') || q.includes('dollar')) {
                responseText = "Official Fees: Working ($300), Business ($250), Study ($150), Tourist ($30-$125). Payments are accepted via Credit Card or Bank Transfer after your documents are initially reviewed.";
                actionLink = { label: "Payment Portal", href: "/track" };
            }
            else if (q.includes('how') && (q.includes('apply') || q.includes('start') || q.includes('begin'))) {
                responseText = "To begin: \n1. Click **Apply** in the menu\n2. Fill in your passport details\n3. Upload required documents\n4. Submit and wait for the 'Verified' status to appear in your profile.";
                actionLink = { label: "Begin Application", href: "/apply" };
            }
            else if (q.includes('status') || q.includes('track') || q.includes('check') || q.includes('update')) {
                responseText = "Enter your Reference ID (e.g., NV-123456) and Passport Number in our tracking tool to see your current status (Submitted, Under Review, or Approved).";
                actionLink = { label: "Track Application", href: "/track" };
            }
            // 8. User Specific Context
            else if (q.includes('my') && (q.includes('detail') || q.includes('application') || q.includes('visa') || q.includes('info'))) {
                if (userContext) {
                    responseText = `**${userContext.name}**, you are currently logged in. You can check the 'Verified' documents, system feedback, and payment buttons directly in your personalized dashboard.`;
                    actionLink = { label: "Go to My Apps", href: "/my-applications" };
                } else {
                    responseText = "Please **Log In** to view your specific application data, download receipts, or see admin feedback on your documents.";
                    actionLink = { label: "Log In to Account", href: "/login" };
                }
            }
            // 9. Polite Fallbacks / Basic Nepali phrases
            else if (q.includes('thank') || q.includes('dhanyabad')) {
                responseText = "You're very welcome! I'm glad I could help. Is there anything else you need for your journey to Nepal?";
            }
            else if (q.includes('bye') || q.includes('tata')) {
                responseText = "Goodbye! We hope to see you in Nepal soon. Feel free to return if you have more questions.";
            }
            // Absolute Fallback
            else {
                responseText = "I'm sorry, I'm still learning that specific topic. I can provide detailed info on: \n\n• **Visa Types & Fees** (Tourist, Work, etc.)\n• **Document Requirements**\n• **Application Tracking**\n• **Our Kupandol Office**\n\nTry asking 'What are the different visas?' or 'How do I track my status?'";
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
        }, 1000);
    };

    return (
        <div className="fixed bottom-32 lg:bottom-8 right-4 md:right-8 z-[100]" ref={chatRef}>
            {/* Launcher */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 md:w-16 md:h-16 bg-nepal-blue rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white text-white relative group"
            >
                {isOpen ? <X size={24} /> : <div className="relative"><MessageSquare size={28} /><Sparkles className="absolute -top-2 -right-2 text-nepal-gold size-4 animate-pulse" /></div>}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white ring-4 ring-emerald-500/10 transition-all"></span>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-full right-0 mb-6 w-[calc(100vw-32px)] md:w-[400px] h-[60vh] md:h-[550px] max-h-[600px] min-h-[350px] bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.25)] border border-slate-100 flex flex-col overflow-hidden origin-bottom-right"
                    >
                        <div className="bg-nepal-blue p-6 md:p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Shield size={120} /></div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                                        <Bot size={26} className="text-nepal-gold" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg tracking-tight">Visa Intelligence</h3>
                                        <div className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Assistant</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all">
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
                                        <div className={`p-4 rounded-3xl text-sm shadow-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-slate-900 text-white rounded-tr-none'
                                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 font-medium'
                                            }`}>
                                            {msg.text.split('**').map((part, i) => (
                                                i % 2 === 1 ? <strong key={i} className="text-nepal-blue">{part}</strong> : part
                                            ))}
                                            {msg.link && (
                                                <Link
                                                    href={msg.link.href}
                                                    className="mt-4 block p-3 bg-slate-50 rounded-2xl text-nepal-blue font-black text-[10px] uppercase tracking-widest flex items-center justify-between hover:bg-nepal-gold hover:text-nepal-navy transition-all border border-slate-100"
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
                                    <div className="flex items-end space-x-3 max-w-[85%]">
                                        <div className="w-9 h-9 rounded-xl bg-nepal-blue text-white flex items-center justify-center shrink-0">
                                            <Bot size={18} className="text-nepal-gold" />
                                        </div>
                                        <div className="p-4 bg-white rounded-3xl rounded-tl-none border border-slate-100 shadow-sm">
                                            <Loader2 className="w-4 h-4 animate-spin text-nepal-blue" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-slate-50">
                            <div className="relative flex items-center group/input">
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-2xl opacity-0 group-focus-within/input:opacity-100 transition-opacity blur-[2px]" />
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask anything about Nepal Visas..."
                                    className="relative w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-nepal-navy placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:tracking-widest outline-none focus:bg-white focus:border-nepal-gold transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 p-3 text-nepal-navy bg-nepal-gold rounded-xl hover:bg-yellow-400 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg shadow-nepal-gold/10"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <div className="mt-4 flex justify-center items-center gap-2">
                                <Sparkles size={12} className="text-nepal-gold" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Official Visa Support • AI Powered</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
