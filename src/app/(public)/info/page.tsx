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
                { label: "Time", value: "10-15 Days" }
            ],
            load: "Normal"
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
                { label: "Time", value: "7-10 Days" }
            ],
            load: "Quick"
        },
        {
            title: "Residential Visa",
            subtitle: "Long-term Stay",
            icon: ShieldCheck,
            accent: "bg-emerald-600",
            description: "For investors, retirees, and long-term residents. Ideal for those seeking to stay long term and make high-level investments.",
            details: [
                { label: "Duration", value: "5 Years Multi" },
                { label: "Fee", value: "$500 – $1000 / yr" },
                { label: "Time", value: "20-30 Days" }
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
                { label: "Time", value: "1-5 Days" }
            ],
            load: "Fast"
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
            <section className="relative pt-24 lg:pt-40 pb-16 lg:pb-24 bg-nepal-navy overflow-hidden">
                <motion.div
                    initial={{ scale: 1, x: 0, y: 0 }}
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, -20, 0],
                        y: [0, -10, 0]
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "linear"
                    }}
                    className="absolute inset-0 opacity-25"
                >
                    <Image
                        src="/images/adventure.png"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-nepal-navy/85 via-nepal-navy to-nepal-navy" />

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
                        <div className="flex items-center gap-4 mb-4">
                            <span className="w-10 h-[2px] bg-nepal-gold" />
                            <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.5em] text-nepal-gold">Helpful Tips</span>
                        </div>
                        <h1 className="text-3xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
                            Visa <span className="text-nepal-gold italic">Info</span>
                        </h1>
                        <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed opacity-80">
                            Find the right visa for your needs. We help professionals,
                            investors, and students join the Nepal community.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Visa Classification Grid ── */}
            <section className="py-12 lg:py-24 bg-white relative z-[5] -mt-2">
                <div className="container mx-auto px-6">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid md:grid-cols-2 gap-10 max-w-7xl mx-auto"
                    >
                        {visaTypes.map((visa) => (
                            <motion.div
                                key={visa.title}
                                variants={itemVariants}
                                className="group relative bg-white border border-slate-200 rounded-[2.5rem] lg:rounded-[3rem] p-6 lg:p-12 flex flex-col hover:border-nepal-gold/50 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 overflow-hidden"
                            >
                                {/* Decorative Gradient Glow */}
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-nepal-gold/5 rounded-full blur-[100px] group-hover:bg-nepal-gold/10 transition-all duration-1000" />

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="w-8 h-[1.5px] bg-nepal-gold opacity-50" />
                                            <span className="text-[11px] font-black text-nepal-gold uppercase tracking-[0.4em]">{visa.subtitle}</span>
                                        </div>
                                        <h2 className="text-3xl lg:text-5xl font-black text-nepal-navy tracking-tighter leading-none group-hover:text-nepal-gold transition-colors duration-500">
                                            {visa.title}
                                        </h2>
                                    </div>
                                    <div className={`w-20 h-20 ${visa.accent} bg-opacity-10 rounded-3xl flex items-center justify-center text-nepal-navy group-hover:bg-opacity-100 group-hover:text-white transition-all duration-700 shadow-xl shadow-transparent group-hover:shadow-current/10 shrink-0`}>
                                        <visa.icon size={32} strokeWidth={1.5} />
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1 relative z-10">
                                    <p className="text-slate-500 text-lg leading-relaxed font-medium mb-10 max-w-2xl">
                                        {visa.description}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                                        {visa.details.map((detail) => (
                                            <div key={detail.label} className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-1 group-hover:bg-white group-hover:border-nepal-gold/20 transition-all duration-500">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{detail.label}</span>
                                                <span className="text-base font-black text-nepal-navy tracking-tight">{detail.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href="/apply"
                                        className="inline-flex items-center justify-center gap-3 bg-nepal-navy text-white py-6 px-10 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-nepal-gold hover:text-nepal-navy hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-xl group-hover:shadow-nepal-gold/20 mt-auto"
                                    >
                                        Start Your Application <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
                        className="relative bg-nepal-navy rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-20 overflow-hidden shadow-[0_80px_120px_-30px_rgba(0,0,0,0.3)] pb-32 lg:pb-20"
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
                                { icon: Clock, title: "Visa Renewal", desc: "You can renew most long-term visas at our offices in Kathmandu or Pokhara.", tag: "Reliable" },
                                { icon: DollarSign, title: "Visa Fees", desc: "Pay safely online with your credit card or local bank.", tag: "Safe" },
                                { icon: Zap, title: "Rules", desc: "You must follow the rules of your visa type while staying in Nepal.", tag: "Fair" }
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
                                            <span className="text-sm font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-nepal-gold transition-colors">{policy.tag}</span>
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

