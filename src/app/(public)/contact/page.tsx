"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Globe, ShieldCheck, Zap, CheckCircle2, AlertTriangle, Loader2, User, MessageSquare, Layers } from 'lucide-react';
import Image from 'next/image';
import { UserAuthGuard } from '@/components/UserAuthGuard';

const FlightPathSVG = ({ viewBox = '0 0 1440 520', paths }: any) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        {paths.map((p: any, i: number) => (
            <path key={i} d={p.d} stroke={p.color} strokeWidth={p.thin ? 0.8 : 1.2} strokeDasharray={p.dash} strokeLinecap="round" opacity={p.opacity} style={p.animate ? { animation: 'dashMove 2.4s linear infinite' } : undefined} />
        ))}
    </svg>
);

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', department: 'Consular Visa Inquiry', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [refId, setRefId] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');
        try {
            const res = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setRefId(data.id);
                setStatus('success');
                setForm({ name: '', email: '', department: 'Consular Visa Inquiry', message: '' });
            } else {
                setErrorMsg(data.error ?? 'Submission failed. Please try again.');
                setStatus('error');
            }
        } catch {
            setErrorMsg('Network error. Please check your connection.');
            setStatus('error');
        }
    };

    return (
        <UserAuthGuard>
            <main className="min-h-screen bg-white overflow-hidden font-outfit">
                {/* ── Cinematic Hero Architecture ── */}
                <section className="relative pt-40 pb-24 bg-nepal-navy overflow-hidden">
                    <motion.div
                        initial={{ scale: 1, y: 0 }}
                        animate={{ scale: [1, 1.12, 1], y: [0, -15, 0] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 opacity-25"
                    >
                        <Image src="/images/official_building.png" alt="" fill className="object-cover" priority />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-b from-nepal-navy/85 via-nepal-navy to-nepal-navy" />
                    <div className="absolute inset-0 pointer-events-none z-[1]">
                        <FlightPathSVG paths={[{ d: 'M0 200 Q 720 500 1440 200', color: '#D4A017', dash: '8 6', opacity: 0.1, animate: true }]} />
                    </div>
                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="max-w-4xl"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <span className="w-10 h-[2px] bg-nepal-gold" />
                                <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.5em] text-nepal-gold">Get In Touch</span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
                                Help & <span className="text-nepal-gold italic">Support</span>
                            </h1>
                            <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed opacity-80">
                                Connect with our team for visas, applications, and any other questions you have.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── Contact Infrastructure ── */}
                <section className="py-24 bg-white relative z-10 -mt-2">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid lg:grid-cols-12 gap-12 items-start">

                            {/* Side Pillars */}
                            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-36">
                                {[
                                    { icon: Mail, title: "Email Us", detail: "support@immigration.gov.np", sub: "For all your questions", accent: "text-rose-500" },
                                    { icon: Phone, title: "Call Us", detail: "+977-1-4429660", sub: "Sun-Fri / 10 AM - 5 PM (NPT)", accent: "text-nepal-blue" },
                                    { icon: MapPin, title: "Our Office", detail: "Kalikasthan, Kathmandu", sub: "Department of Immigration, Nepal", accent: "text-emerald-500" }
                                ].map((pill, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 + i * 0.08, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                                        className="bg-white border border-slate-100 p-8 rounded-[2.5rem] group hover:border-nepal-gold/30 hover:shadow-2xl hover:shadow-nepal-gold/5 transition-all duration-500"
                                    >
                                        <div className={`w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center ${pill.accent} mb-6 border border-slate-100 group-hover:bg-nepal-gold group-hover:text-nepal-navy group-hover:rotate-6 transition-all duration-500`}>
                                            <pill.icon size={26} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{pill.title}</h3>
                                        <p className="text-2xl font-black text-nepal-navy tracking-tight mb-2">{pill.detail}</p>
                                        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">{pill.sub}</p>
                                    </motion.div>
                                ))}

                                <div className="bg-nepal-navy p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-[5s]">
                                        <Globe size={180} />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                        <h4 className="text-2xl font-black tracking-tight italic text-nepal-gold">Official Hours</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                                                <span className="text-white/40">Mon - Fri</span>
                                                <span>09:00 - 17:00</span>
                                            </div>
                                            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                                                <span className="text-white/40">Saturday</span>
                                                <span className="text-rose-400">Closed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transmission Form */}
                            <div className="lg:col-span-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="bg-white rounded-[3.5rem] shadow-[0_60px_100px_-30px_rgba(0,0,0,0.1)] border border-slate-100 p-8 lg:p-20 relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 mb-12">
                                        <Zap className="text-nepal-gold" size={24} />
                                        <h2 className="text-5xl font-black text-nepal-navy tracking-tighter uppercase italic">
                                            Send <span className="text-nepal-gold">Message</span>
                                        </h2>
                                    </div>

                                    {/* ── Success State ── */}
                                    <AnimatePresence mode="wait">
                                        {status === 'success' ? (
                                            <motion.div
                                                key="success"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                className="text-center py-12 space-y-6"
                                            >
                                                <div className="w-24 h-24 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                                                    <CheckCircle2 size={44} className="text-emerald-500" strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-black text-nepal-navy tracking-tighter mb-3">
                                                        Message <span className="text-emerald-500">Sent</span>
                                                    </h3>
                                                    <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed text-xl">
                                                        Your message has been saved in our system. Our team will respond within 1-2 business days.
                                                    </p>
                                                </div>
                                                {refId && (
                                                    <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4">
                                                        <span className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Message ID</span>
                                                        <span className="font-black text-nepal-gold font-mono tracking-widest text-lg">{refId}</span>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => setStatus('idle')}
                                                    className="text-sm font-black uppercase tracking-widest text-nepal-navy hover:text-nepal-gold transition-colors"
                                                >
                                                    Send Another Message
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.form
                                                key="form"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onSubmit={handleSubmit}
                                                className="space-y-12 relative z-10"
                                            >
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    {/* Name Field */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3 ml-2">
                                                            <User className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                            <label className="text-sm font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Full Name</label>
                                                        </div>
                                                        <div className="relative group/field transition-all duration-500">
                                                            <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                            <div className="relative flex items-center bg-white border border-slate-300 rounded-[2rem] group-focus-within/field:border-nepal-gold group-focus-within/field:shadow-2xl group-focus-within/field:shadow-nepal-gold/15 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                                <input
                                                                    name="name"
                                                                    type="text"
                                                                    required
                                                                    value={form.name}
                                                                    onChange={handleChange}
                                                                    placeholder="YOUR NAME"
                                                                    className="w-full bg-transparent px-8 py-6 text-nepal-navy font-black placeholder:text-slate-400 placeholder:font-black outline-none text-xl"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Email Field */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3 ml-2">
                                                            <Mail className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                            <label className="text-sm font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Email</label>
                                                        </div>
                                                        <div className="relative group/field transition-all duration-500">
                                                            <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                            <div className="relative flex items-center bg-white border border-slate-300 rounded-[2rem] group-focus-within/field:border-nepal-gold group-focus-within/field:shadow-2xl group-focus-within/field:shadow-nepal-gold/15 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                                <input
                                                                    name="email"
                                                                    type="email"
                                                                    required
                                                                    value={form.email}
                                                                    onChange={handleChange}
                                                                    placeholder="YOUR EMAIL"
                                                                    className="w-full bg-transparent px-8 py-6 text-nepal-navy font-black placeholder:text-slate-400 placeholder:font-black outline-none text-xl"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Department Selection */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 ml-2">
                                                        <Layers className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                        <label className="text-sm font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Department</label>
                                                    </div>
                                                    <div className="relative group/field transition-all duration-500">
                                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                        <div className="relative flex items-center bg-white border border-slate-300 rounded-[2rem] group-focus-within/field:border-nepal-gold group-focus-within/field:shadow-2xl group-focus-within/field:shadow-nepal-gold/15 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                            <select
                                                                name="department"
                                                                value={form.department}
                                                                onChange={handleChange}
                                                                className="w-full bg-transparent px-8 py-6 text-nepal-navy font-black outline-none appearance-none cursor-pointer text-xl"
                                                            >
                                                                <option>General Questions</option>
                                                                <option>Website Problems</option>
                                                                <option>Payment Issues</option>
                                                                <option>Visa Status</option>
                                                            </select>
                                                            <div className="absolute right-8 pointer-events-none text-slate-400">
                                                                <Zap size={14} className="group-focus-within/field:text-nepal-gold transition-colors" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Message Textarea */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 ml-2">
                                                        <MessageSquare className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                        <label className="text-sm font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Your Message</label>
                                                    </div>
                                                    <div className="relative group/field transition-all duration-500">
                                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                        <div className="relative bg-white border border-slate-300 rounded-[2rem] group-focus-within/field:border-nepal-gold group-focus-within/field:shadow-2xl group-focus-within/field:shadow-nepal-gold/15 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                            <textarea
                                                                name="message"
                                                                rows={5}
                                                                required
                                                                value={form.message}
                                                                onChange={handleChange}
                                                                placeholder="Describe your question here..."
                                                                className="w-full bg-transparent px-8 py-6 text-nepal-navy font-black placeholder:text-slate-400 placeholder:font-black outline-none text-xl resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Error */}
                                                <AnimatePresence>
                                                    {status === 'error' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -8 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-6 py-4"
                                                        >
                                                            <AlertTriangle size={18} className="text-red-400 shrink-0" />
                                                            <p className="text-red-600 text-sm font-bold">{errorMsg}</p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <button
                                                    type="submit"
                                                    disabled={status === 'sending'}
                                                    className="group relative w-full h-[80px] rounded-[2rem] overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-50"
                                                >
                                                    {/* Static Base Background */}
                                                    <div className="absolute inset-0 bg-[#0F172A]" />

                                                    {/* Animated Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-[linear-gradient(110deg,#0F172A,45%,#1e293b,55%,#0F172A)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                                    {/* Border Glow */}
                                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-nepal-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                    <span className="relative z-10 flex items-center justify-center gap-4 text-white font-black text-base uppercase tracking-[0.4em]">
                                                        {status === 'sending' ? (
                                                            <>
                                                                <Loader2 className="animate-spin text-nepal-gold" size={20} />
                                                                <span className="animate-pulse">Sending...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="relative">
                                                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500 text-nepal-gold" />
                                                                    <div className="absolute -inset-2 bg-nepal-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                </div>
                                                                Send Message
                                                            </>
                                                        )}
                                                    </span>
                                                </button>
                                            </motion.form>
                                        )}
                                    </AnimatePresence>

                                    {/* System Health Node */}
                                    <div className="mt-16 pt-16 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-60">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="text-emerald-500" size={18} />
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Secure Connection</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">System: Active</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </UserAuthGuard>
    );
};

export default ContactPage;
