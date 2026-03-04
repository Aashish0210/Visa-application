"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search, HelpCircle, MessageSquare, Phone, ArrowUpRight, Zap } from 'lucide-react';
import Image from 'next/image';

/* ── Flight Path Helper (Consistent with Brand) ── */
const FlightPathSVG = ({ viewBox = '0 0 1440 520', paths }: any) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        {paths.map((p: any, i: number) => (
            <path key={i} d={p.d} stroke={p.color} strokeWidth={p.thin ? 0.8 : 1.2} strokeDasharray={p.dash} strokeLinecap="round" opacity={p.opacity} style={p.animate ? { animation: 'dashMove 2.4s linear infinite' } : undefined} />
        ))}
    </svg>
);

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            q: "Can I apply for a long-term visa before arriving in Nepal?",
            a: "Yes, this portal is specifically designed for foreign nationals to apply for long-term visas (Working, Study, Residential) before they travel to Nepal. Once approved, you will receive a grant letter to present upon entry."
        },
        {
            q: "How long does the visa approval process take?",
            a: "The processing time depends on the visa category. Generally, Working and Study visas take 7-15 business days, while Residential visas may take up to 30 business days for complete verification."
        },
        {
            q: "What documents are required for a Work Visa?",
            a: "Key documents include an appointment letter from a Nepalese employer, approval from the relevant Ministry, company registration documents of the employer, and your work permit from the Department of Labor."
        },
        {
            q: "Can I renew my long-term visa online?",
            a: "Currently, this portal supports new applications. Renewals must be processed at the Department of Immigration in Kathmandu with the physical presentation of your passport and supporting documents."
        },
        {
            q: "Are the visa fees refundable if my application is rejected?",
            a: "Government processing fees are generally non-refundable. We recommend ensuring all your documents meet the requirements before completing the payment and submission."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-white overflow-hidden font-outfit">
            {/* ── Cinematic Hero Architecture ── */}
            <section className="relative pt-40 pb-24 bg-nepal-navy overflow-hidden">
                <div className="absolute inset-0 opacity-20 scale-105">
                    <Image
                        src="/images/mount_everest.png"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-nepal-navy/80 via-nepal-navy to-white" />

                {/* Decorative Flight Path */}
                <div className="absolute inset-0 pointer-events-none z-[1]">
                    <FlightPathSVG
                        paths={[
                            { d: 'M1440 300 C 1000 100, 400 500, 0 200', color: '#D4A017', dash: '8 6', opacity: 0.1, animate: true }
                        ]}
                    />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-[2px] bg-nepal-gold" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nepal-gold">Knowledge Base Terminal</span>
                        </div>
                        <h1 className="text-5xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
                            Mission <span className="text-nepal-gold italic">Intelligence</span>
                        </h1>
                        <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                            Access real-time answers and procedural clarity for the Nepal Long-Term
                            Visa ecosystem. Our database is synchronized with latest immigration protocols.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── FAQ Infrastructure ── */}
            <section className="py-24 bg-white relative z-10 -mt-10">
                <div className="container mx-auto px-6 max-w-5xl">
                    {/* Search Architecture */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative mb-24 group/field"
                    >
                        <div className="absolute -inset-[2px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2.5rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                        <div className="relative flex items-center bg-white border border-slate-200 rounded-[2.5rem] group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden shadow-2xl shadow-slate-200/50 hover:shadow-3xl">
                            <div className="pl-10 text-slate-400 group-focus-within/field:text-nepal-gold transition-colors">
                                <Search size={24} strokeWidth={2.5} />
                            </div>
                            <input
                                type="text"
                                placeholder="SEARCH KNOWLEDGE ARCHIVE..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent px-8 py-8 text-nepal-navy font-black placeholder:text-slate-300 placeholder:font-black outline-none text-xl"
                            />
                        </div>
                    </motion.div>

                    {/* FAQ Grid */}
                    <div className="space-y-6">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden group hover:border-nepal-gold/20 transition-all"
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                        className="w-full text-left px-10 py-10 flex items-center justify-between gap-8 group"
                                    >
                                        <span className={`text-xl font-black tracking-tight leading-snug transition-colors ${openIndex === i ? 'text-nepal-gold italic' : 'text-nepal-navy'}`}>
                                            {faq.q}
                                        </span>
                                        <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${openIndex === i ? 'bg-nepal-navy text-nepal-gold rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-nepal-gold/10'}`}>
                                            {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openIndex === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                <div className="px-10 pb-10 text-slate-500 font-medium leading-relaxed pt-2">
                                                    <div className="h-[2px] w-12 bg-nepal-gold/30 mb-8" />
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-slate-50 rounded-[4rem] border border-dashed border-slate-200">
                                <HelpCircle className="mx-auto text-slate-200 mb-6" size={60} />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">No matching intelligence patterns found.</p>
                            </div>
                        )}
                    </div>

                    {/* Support Architecture */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mt-32 p-12 lg:p-24 bg-nepal-navy rounded-[4rem] text-white relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-[10s]">
                            <Image src="/images/airplane_bg_1.png" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-nepal-gold rounded-[2rem] flex items-center justify-center mb-10 shadow-3xl shadow-nepal-gold/20 rotate-12 group-hover:rotate-0 transition-transform">
                                <MessageSquare className="text-nepal-navy" size={32} />
                            </div>
                            <h3 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6 uppercase italic leading-none">Terminal <span className="text-nepal-gold">Human Support</span></h3>
                            <p className="text-white/40 font-bold uppercase tracking-widest text-[11px] mb-12">Active Sync: Sun-Fri • 10:00 - 17:00 NPT</p>

                            <div className="grid sm:grid-cols-2 gap-4 w-full">
                                <a href="mailto:support@immigration.gov.np" className="group flex items-center justify-between bg-white text-nepal-navy px-10 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-nepal-gold transition-all">
                                    Email Nexus <ArrowUpRight size={16} />
                                </a>
                                <a href="tel:+97714429660" className="group flex items-center justify-between border border-white/10 text-white px-10 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all">
                                    Direct Uplink <Phone size={16} />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer Meta */}
                    <div className="mt-16 flex items-center justify-center gap-6 opacity-30">
                        <Zap size={16} className="text-nepal-gold" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Knowledge Core v4.2 // Real-time Synchronization Enabled</p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default FAQPage;

