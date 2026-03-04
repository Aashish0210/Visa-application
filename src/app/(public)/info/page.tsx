"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, ShieldCheck, ArrowRight, BookOpen, Clock, DollarSign, Newspaper, Zap, Activity } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

/* ── Flight Path Helper (Consistent with Home) ── */
const FlightPathSVG = ({ viewBox = '0 0 1440 520', paths, dots }: any) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        {paths.map((p: any, i: number) => (
            <path key={i} d={p.d} stroke={p.color} strokeWidth={p.thin ? 0.8 : 1.2} strokeDasharray={p.dash} strokeLinecap="round" opacity={p.opacity} style={p.animate ? { animation: 'dashMove 2.4s linear infinite' } : undefined} />
        ))}
    </svg>
);

const InfoPage = () => {
    const visaTypes = [
        {
            title: "Working Visa",
            subtitle: "Employment & Labor",
            icon: FileText,
            accent: "bg-blue-600",
            description: "Issued to foreign nationals who intend to work in Nepal for a specific period. Requires an employment contract and approval from the Department of Labor.",
            details: [
                { label: "Duration", value: "Standard / Renewable" },
                { label: "Fee", value: "$100 – $150 / mo" },
                { label: "Pipeline", value: "10-15 Days" }
            ],
            load: "Standard"
        },
        {
            title: "Study Visa",
            subtitle: "Academic & Research",
            icon: BookOpen,
            accent: "bg-violet-600",
            description: "For students, researchers, and academic professionals enrolled in recognized Nepalese educational institutions. Renewable annually.",
            details: [
                { label: "Duration", value: "Defined Course" },
                { label: "Fee", value: "$30 – $75 / mo" },
                { label: "Pipeline", value: "7-10 Days" }
            ],
            load: "Light"
        },
        {
            title: "Residential Visa",
            subtitle: "Long-term Stay",
            icon: ShieldCheck,
            accent: "bg-emerald-600",
            description: "For investors, retirees, and long-term residents. Ideal for those seeking deep community integration and high-level investments.",
            details: [
                { label: "Duration", value: "5 Years Multi" },
                { label: "Fee", value: "$500 – $1000 / yr" },
                { label: "Pipeline", value: "20-30 Days" }
            ],
            load: "Premium"
        },
        {
            title: "Tourist Visa",
            subtitle: "Travel & Leisure",
            icon: Newspaper,
            accent: "bg-rose-600",
            description: "For visiting Nepal for trekking, mountaineering, or pilgrimage. Extendable up to 150 days per calendar year.",
            details: [
                { label: "Duration", value: "Up to 150 Days" },
                { label: "Fee", value: "$30 – $100 (Arrival)" },
                { label: "Pipeline", value: "1-5 Days" }
            ],
            load: "Optimized"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    };

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

                {/* Flight path decoration */}
                <div className="absolute inset-0 pointer-events-none z-[1]">
                    <FlightPathSVG
                        paths={[
                            { d: 'M1440 100 C 1000 250, 600 50, 0 200', color: '#D4A017', dash: '8 6', opacity: 0.15, animate: true }
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
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nepal-gold">Official Guidelines</span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
                            Visa <span className="text-nepal-gold italic">Information</span>
                        </h1>
                        <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                            Navigate our premium visa classifications designed for global citizens,
                            investors, and explorers seeking high-tier integration in the Himalayas.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Visa Classification Grid ── */}
            <section className="py-24 bg-white relative z-[5]">
                <div className="container mx-auto px-6">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
                    >
                        {visaTypes.map((visa) => (
                            <motion.div
                                key={visa.title}
                                variants={itemVariants}
                                className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-4 lg:p-10 flex flex-col lg:flex-row gap-10 hover:border-nepal-gold/50 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 overflow-hidden"
                            >
                                <div className="flex flex-col items-start shrink-0">
                                    <div className={`w-20 h-20 ${visa.accent} bg-opacity-10 rounded-3xl flex items-center justify-center text-nepal-navy group-hover:bg-opacity-100 group-hover:text-white transition-all duration-700 shadow-xl shadow-transparent group-hover:shadow-current/10 mb-6`}>
                                        <visa.icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[9px] font-black text-nepal-gold uppercase tracking-[0.3em] mb-2">{visa.subtitle}</span>
                                    <h2 className="text-3xl font-black text-nepal-navy tracking-tighter mb-4">{visa.title}</h2>
                                </div>

                                <div className="flex flex-col justify-between flex-1">
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
                                        {visa.description}
                                    </p>

                                    <div className="grid grid-cols-1 gap-2 mb-10">
                                        {visa.details.map((detail) => (
                                            <div key={detail.label} className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl flex items-center justify-between group-hover:bg-white group-hover:border-slate-200 transition-all">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{detail.label}</span>
                                                <span className="text-sm font-black text-nepal-navy tracking-tight">{detail.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href="/apply"
                                        className="inline-flex items-center justify-center gap-3 bg-nepal-navy text-white py-5 px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-nepal-gold hover:text-nepal-navy hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-xl group-hover:shadow-nepal-gold/20"
                                    >
                                        Start Application <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Protocol Panel ── */}
            <section className="py-24 pt-12">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="relative bg-nepal-navy rounded-[3.5rem] p-12 lg:p-20 overflow-hidden shadow-[0_80px_120px_-30px_rgba(0,0,0,0.3)]"
                    >
                        {/* High-res BG for protocol panel */}
                        <motion.div
                            className="absolute inset-0 opacity-20 lg:opacity-30 scale-110 pointer-events-none"
                            animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        >
                            <Image src="/images/airplane_bg_1.png" alt="" fill className="object-cover mix-blend-lighten" />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-r from-nepal-navy via-nepal-navy/90 to-transparent" />

                        <div className="relative z-10 grid lg:grid-cols-3 gap-16">
                            {[
                                { icon: Clock, title: "Renewal Policy", desc: "Most long-term visas are renewable within Nepal at the Department of Immigration in Kathmandu or Pokhara local hubs.", tag: "Timeframe Control" },
                                { icon: DollarSign, title: "Official Fees", desc: "Secure online payment gateway supporting international credit cards and localized bank protocols via AES-256 encryption.", tag: "Secure Gateway" },
                                { icon: Zap, title: "Standard Compliance", desc: "Foreign nationals must strictly adhere to the purpose of their visa category as per the Ministry of Home Affairs protocols.", tag: "Global Integrity" }
                            ].map((policy, idx) => (
                                <div key={idx} className="flex flex-col items-start gap-6 group">
                                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-nepal-gold group-hover:bg-nepal-gold group-hover:text-nepal-navy transition-all duration-500">
                                        <policy.icon size={26} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-black text-white tracking-tight">{policy.title}</h3>
                                            <span className="w-1.5 h-1.5 rounded-full bg-nepal-gold animate-pulse" />
                                        </div>
                                        <p className="text-white/50 text-base leading-relaxed font-medium">
                                            {policy.desc}
                                        </p>
                                        <div className="pt-4 border-t border-white/10 w-full">
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-nepal-gold transition-colors">{policy.tag}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default InfoPage;

