"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight, CheckCircle2, ShieldCheck, Languages, FileText,
    Users, Shield, Globe, BookOpen, HomeIcon, Newspaper, Clock,
    MapPin, Lock, Award, TrendingUp, Activity, BadgeCheck, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from './Hero';

/* ══════════════════════════════════════════════════════════
   FLIGHT PATH SVG — refined aviation route aesthetic
   Provides the subtle travel-themed background lines
══════════════════════════════════════════════════════════ */
const FlightPathSVG = ({
    viewBox = '0 0 1440 520',
    paths,
    dots,
}: {
    viewBox?: string;
    paths: { d: string; color: string; dash?: string; opacity: number; animate?: boolean; thin?: boolean }[];
    dots?: { cx: number; cy: number; r: number; color: string; opacity: number }[];
}) => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {paths.map((p, i) => (
            <path
                key={i}
                d={p.d}
                stroke={p.color}
                strokeWidth={p.thin ? 0.8 : 1.2}
                strokeDasharray={p.dash}
                strokeLinecap="round"
                opacity={p.opacity}
                style={p.animate ? { animation: 'dashMove 2.4s linear infinite' } : undefined}
            />
        ))}
        {dots?.map((dot, i) => (
            <g key={i}>
                <circle cx={dot.cx} cy={dot.cy} r={dot.r * 2.5} stroke={dot.color} strokeWidth="0.7" opacity={dot.opacity * 0.3} />
                <circle cx={dot.cx} cy={dot.cy} r={dot.r * 1.4} stroke={dot.color} strokeWidth="0.9" opacity={dot.opacity * 0.5} />
                <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.color} opacity={dot.opacity} />
            </g>
        ))}
    </svg>
);

/* ══════════════════════════════════════════════════════════
   KATHMANDU HUB - Elite Radar Tag
══════════════════════════════════════════════════════════ */
const KathmanduHub = () => (
    <div className="flex flex-col items-center">
        {/* Elite Pulse & Halo System (Static) */}
        <div className="relative">
            <div className="w-32 h-32 rounded-full border border-nepal-gold/30 opacity-20" />
            <div className="absolute inset-0 w-32 h-32 rounded-full border border-nepal-gold/10 opacity-10" />
            {/* Radar Halo (Static) */}
            <div className="absolute inset-[-10px] rounded-full border border-t-nepal-gold border-r-transparent border-b-transparent border-l-transparent" />
        </div>

        {/* Cinematic Radar Tag - Ultra-Premium Glassmorphism */}
        <div className="mt-8 bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] px-5 py-2.5 rounded-full flex items-center gap-4 group transition-all duration-700 hover:scale-110 active:scale-95 hover:border-nepal-gold/50">
            <div className="relative flex">
                <div className="w-2.5 h-2.5 rounded-full bg-nepal-gold shadow-[0_0_12px_rgba(212,160,23,0.8)]" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-nepal-gold opacity-60" />
            </div>

            <div className="flex flex-col">
                <span className="text-white text-xs font-black tracking-[0.2em] uppercase leading-none mb-0.5">Kathmandu</span>
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-nepal-gold uppercase tracking-widest whitespace-nowrap">Official Hub</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-sm font-black text-white/40 uppercase tracking-widest">TIA Int'l</span>
                </div>
            </div>

            <div className="h-7 w-[1px] bg-white/10 mx-1" />

            <div className="flex flex-col items-end opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-mono font-bold text-nepal-gold leading-none mb-1">27.70° N</span>
                <span className="text-sm font-mono font-bold text-white/70 leading-none">85.32° E</span>
            </div>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════════
   PASSPORT STAMP WATERMARK
   Used for institutional, officially-vetted feel
══════════════════════════════════════════════════════════ */
const PassportStamp = () => (
    <svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="65" cy="65" r="60" stroke="#1B2B4B" strokeWidth="2.5" strokeDasharray="5 3.5" />
        <circle cx="65" cy="65" r="52" stroke="#1B2B4B" strokeWidth="1" />
        <text x="65" y="55" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#1B2B4B"
            fontFamily="Outfit,sans-serif" letterSpacing="3.5">MINISTRY OF</text>
        <text x="65" y="67" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#1B2B4B"
            fontFamily="Outfit,sans-serif" letterSpacing="3">IMMIGRATION</text>
        <text x="65" y="80" textAnchor="middle" fontSize="8" fontWeight="700" fill="#D4A017"
            fontFamily="Outfit,sans-serif" letterSpacing="4">NEPAL</text>
        <path d="M33 88 L97 88" stroke="#1B2B4B" strokeWidth="0.8" opacity="0.5" />
        <path d="M42 94 L88 94" stroke="#D4A017" strokeWidth="1.2" opacity="0.7" />
    </svg>
);


/* ══════════════════════════════════════════════════════════
   VISA CATEGORIES
   Main display of visa options with detailed cards
══════════════════════════════════════════════════════════ */
const visaTypes = [
    {
        title: 'Working Visa', subtitle: 'Employment & Labour',
        desc: 'Issued to foreign nationals who have secured employment with a registered Nepalese company. Requires a valid job offer letter and Department of Labour approval.',
        icon: FileText, accentBg: 'bg-blue-600', fee: 'USD 100 – 150 / month', days: '10–15 business days', load: 'Standard', color: 'text-blue-500'
    },
    {
        title: 'Study Visa', subtitle: 'Academic & Research',
        desc: 'For international students admitted to UGC-recognised universities and colleges in Nepal. Can be renewed annually for the duration of the course.',
        icon: BookOpen, accentBg: 'bg-violet-600', fee: 'USD 30 – 75 / month', days: '7–10 business days', load: 'Light', color: 'text-emerald-500'
    },
    {
        title: 'Residential Visa', subtitle: 'Long-term Residence',
        desc: 'Granted to foreign investors, retired individuals, and those with genuine long-term ties to Nepal. Minimum investment threshold may apply.',
        icon: HomeIcon, accentBg: 'bg-emerald-600', fee: 'USD 500 – 1,000 / year', days: '20–30 business days', load: 'Heavy', color: 'text-rose-500'
    },
    {
        title: 'Tourist Visa', subtitle: 'Travel & Tourism',
        desc: 'For foreign nationals visiting Nepal for leisure, trekking, mountaineering, pilgrimage, or family visits. Extendable up to 150 days per calendar year.',
        icon: Newspaper, accentBg: 'bg-rose-600', fee: 'USD 30 – 100 (on arrival)', days: '1–5 business days', load: 'Optimized', color: 'text-blue-500'
    },
];

const VisaTypes = () => (
    <section className="py-12 lg:py-24 bg-black relative overflow-hidden font-outfit" id="residency">
        {/* Ultimate Cinematic Background - Seamless Integration */}
        <div className="absolute inset-0 pointer-events-none z-[0] flex items-center justify-center overflow-hidden">
            {/* NEW HIGH-RES PLANE BACKGROUND 1 */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen scale-110">
                <Image
                    src="/images/airplane_bg_1.png"
                    alt=""
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* SUBTLE WATERMARK TEXT - Background Layer */}
            <div className="absolute inset-0 flex items-center justify-center select-none opacity-[0.1]">
                <span className="text-[18rem] lg:text-[45rem] font-black text-slate-800 tracking-tighter uppercase leading-none transform -rotate-12 translate-x-32">
                    VISA
                </span>
            </div>

            {/* CINEMATIC DEPTH OVERLAY - Fuses everything together */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-transparent to-black/90 z-[15]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.25)_0%,transparent_80%)] z-[15]" />
        </div>

        <div className="container mx-auto px-6 relative z-30">
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-20 gap-8">
                <div className="max-w-2xl text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="flex items-center justify-center lg:justify-start gap-4 mb-4"
                    >
                        <span className="w-10 h-[2px] bg-nepal-gold" />
                        <span className="text-base font-black uppercase tracking-[0.3em] text-nepal-gold">Visa Options</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
                        className="text-3xl lg:text-7xl font-black text-white tracking-tight leading-tight"
                    >
                        Pick Your <span className="text-nepal-gold">Visa</span>
                    </motion.h2>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
                    className="text-slate-400 max-w-md lg:text-right text-base leading-relaxed font-bold border-l-2 lg:border-l-0 lg:border-r-2 border-nepal-gold/30 pl-6 lg:pl-0 lg:pr-6"
                >
                    Find the right visa for your stay in Nepal. We help professionals,
                    investors, and students join our community.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {visaTypes.map((type, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 }}
                        className="group relative bg-slate-950/30 backdrop-blur-[40px] border border-white/5 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 flex flex-col h-full
                                   hover:border-nepal-gold/40 hover:bg-slate-900/40 transition-all duration-700 overflow-hidden shadow-2xl"
                    >
                        {/* Interactive Background Glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-nepal-gold/5 rounded-full blur-[80px] group-hover:bg-nepal-gold/10 transition-all duration-1000" />

                        {/* Elite Badge Header */}
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl ${type.accentBg} bg-opacity-10 border border-white/5 flex items-center justify-center text-white
                                           group-hover:bg-opacity-100 transition-all duration-700 shadow-2xl group-hover:rotate-3 group-hover:scale-110`}>
                                <type.icon size={26} strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-3 mb-8 relative z-10">
                            <span className="text-sm font-black text-nepal-gold uppercase tracking-[0.3em] block opacity-80 group-hover:opacity-100 transition-opacity">
                                {type.subtitle}
                            </span>
                            <h3 className="text-2xl lg:text-4xl font-black text-white tracking-tighter leading-none group-hover:text-nepal-gold transition-colors">
                                {type.title}
                            </h3>
                            <p className="text-slate-400 text-base leading-relaxed line-clamp-3 font-medium group-hover:text-slate-300 transition-colors">
                                {type.desc}
                            </p>
                        </div>

                        {/* Optimized Data Grid */}
                        <div className="space-y-2 mt-auto relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-px flex-1 bg-white/10" />
                                <span className="text-sm font-black text-white/20 uppercase tracking-[0.4em]">Info</span>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 group-hover:border-white/10 transition-colors">
                                    <span className="text-white/30 text-sm font-bold uppercase tracking-widest block mb-1">Time</span>
                                    <span className="text-nepal-gold font-black text-base tracking-tight">{type.days.split(' ')[0]} {type.days.split(' ')[1]}</span>
                                </div>
                                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 group-hover:border-white/10 transition-colors">
                                    <span className="text-white/30 text-sm font-bold uppercase tracking-widest block mb-1">Fees</span>
                                    <span className="text-white font-black text-base tracking-tight group-hover:text-nepal-gold transition-colors">Standard Fees</span>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Action Button */}
                        <Link
                            href="/info"
                            className="inline-flex items-center justify-center w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs tracking-[0.3em] uppercase
                                       group-hover:bg-nepal-gold group-hover:text-nepal-navy group-hover:border-nepal-gold transition-all duration-500 shadow-2xl relative overflow-hidden active:scale-[0.98]"
                        >
                            <span className="relative z-10">Visa Guide</span>
                            <ArrowRight size={16} className="ml-3 translate-x-0 group-hover:translate-x-2 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

/* ══════════════════════════════════════════════════════════
   HOW IT WORKS
   Step-by-step application guide
══════════════════════════════════════════════════════════ */
const steps = [
    { num: '01', title: 'ID Check', desc: 'Securely upload your valid passport and info for quick identity check.', icon: ShieldCheck },
    { num: '02', title: 'Sign Up', desc: 'Create your account on our secure system.', icon: Lock },
    { num: '03', title: 'Easy Apply', desc: 'Fill out the simple application form for your visa type.', icon: FileText },
    { num: '04', title: 'Review', desc: 'Your documents go through a standard review process.', icon: BadgeCheck },
    { num: '05', title: 'Pay Safely', desc: "Finalize your payment through our secure system.", icon: Zap },
    { num: '06', title: 'Get Visa', desc: 'Receive your official digital visa letter via our secure messaging system.', icon: Award },
];

const HowItWorks = () => (
    <section className="py-16 lg:py-32 bg-nepal-snow border-b border-slate-200 relative overflow-hidden">

        {/* Passport stamp watermarks */}
        <div className="absolute bottom-6 right-6 w-56 h-56 opacity-[0.06] pointer-events-none select-none rotate-[-15deg]">
            <PassportStamp />
        </div>

        {/* Decorative noise/texture overlay for premium look */}
        <div className="absolute inset-0 opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] pointer-events-none" />

        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <FlightPathSVG
                paths={[
                    { d: 'M1540 380 C 1160 270, 720 90, 360 200 S -60 400, -80 150', color: '#D4A017', dash: '9 7', opacity: 0.2, animate: true },
                ]}
                dots={[
                    { cx: 860, cy: 154, r: 3, color: '#D4A017', opacity: 0.38 },
                ]}
            />
        </div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row gap-20 items-start">
                <div className="lg:w-5/12 lg:sticky lg:top-36">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <span className="bg-nepal-navy text-white px-4 py-2 rounded-lg text-sm font-black uppercase tracking-[0.3em] mb-6 inline-block">The Process</span>
                        <h2 className="text-4xl lg:text-7xl font-black text-nepal-navy mb-8 tracking-tighter leading-[0.9]">
                            Streamlined<br />
                            <span className="text-nepal-gold">Easy E-Visa</span>
                        </h2>
                        <p className="text-slate-500 mb-10 leading-relaxed text-xl font-medium max-w-sm">
                            Our online system reduces complexity, ensuring a secure and
                            easy application for your trip to the Himalayas.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4 mb-12">
                        {[
                            { icon: Activity, label: '99.9% Uptime', sub: 'Always Online' },
                            { icon: Lock, label: 'Secure System', sub: 'Verified' },
                            { icon: BadgeCheck, label: 'Verified ID', sub: 'Official' },
                            { icon: Globe, label: 'Global Access', sub: 'Everywhere' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.25 + i * 0.08 }}
                                className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm group hover:border-nepal-gold/50 transition-all cursor-default"
                            >
                                <item.icon size={20} className="text-nepal-gold mb-3 transition-transform group-hover:scale-110" />
                                <span className="text-base font-black text-nepal-navy block mb-0.5">{item.label}</span>
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.sub}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/apply" className="flex items-center justify-center gap-3 bg-nepal-gold text-nepal-navy px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-nepal-navy hover:text-white transition-all shadow-xl shadow-nepal-gold/20 active:scale-95">
                            Start Application <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                <div className="lg:w-7/12 grid sm:grid-cols-2 gap-6">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.09 }}
                            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:border-nepal-gold/40 transition-all relative overflow-hidden group"
                        >
                            <span className="absolute -top-4 -right-2 text-9xl font-black text-slate-100 group-hover:text-nepal-gold/5 transition-colors leading-none select-none">
                                {step.num}
                            </span>
                            <div className="flex items-center gap-4 mb-6 relative z-10 transition-transform group-hover:translate-x-2">
                                <div className="w-12 h-12 bg-nepal-navy text-nepal-gold rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-nepal-gold group-hover:text-nepal-navy transition-colors duration-500">
                                    <step.icon size={22} />
                                </div>
                                <span className="text-sm font-black uppercase tracking-[0.3em] text-nepal-gold">Step {step.num}</span>
                            </div>
                            <h3 className="text-2xl font-black text-nepal-navy mb-3 relative z-10 group-hover:text-nepal-gold transition-colors">{step.title}</h3>
                            <p className="text-slate-500 text-base leading-relaxed relative z-10 font-medium group-hover:text-slate-600 transition-colors">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);


/* ══════════════════════════════════════════════════════════
   CTA
   Final call to action with high-res imagery
══════════════════════════════════════════════════════════ */
const CTA = () => (
    <section className="py-12 lg:py-24 bg-nepal-snow relative overflow-hidden pb-32 lg:pb-24">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <FlightPathSVG
                viewBox="0 0 1440 380"
                paths={[
                    { d: 'M-60 300 C 260 180, 680 50, 980 130 S 1340 340, 1520 70', color: '#D4A017', dash: '9 7', opacity: 0.15, animate: true },
                ]}
                dots={[
                    { cx: 980, cy: 130, r: 4, color: '#D4A017', opacity: 0.35 },
                ]}
            />
        </div>

        <div className="container mx-auto px-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative bg-[#020617] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-[0_100px_150px_-50px_rgba(0,0,0,0.4)] border border-white/5"
            >
                {/* NEW HIGH-RES PLANE BACKGROUND 2 */}
                <motion.div
                    className="absolute inset-0 opacity-40 mix-blend-screen scale-110"
                    animate={{
                        x: [0, 15, 0],
                        y: [0, -10, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Image
                        src="/images/airplane_bg_2.png"
                        alt=""
                        fill
                        className="object-cover"
                        loading="lazy"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-nepal-gold/50 to-transparent" />

                {/* Kathmandu Hub - Elite centerpiece (Static) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] pointer-events-none opacity-[0.05] lg:opacity-[0.1] scale-[2.5] lg:scale-[3.5]">
                    <KathmanduHub />
                </div>

                <div className="relative z-10 px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:px-16">
                    <div className="max-w-xl text-center lg:text-left">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-sm font-black uppercase tracking-[0.4em] text-nepal-gold mb-4 block"
                        >
                            Visit Nepal
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl lg:text-5xl font-black text-white mb-6 tracking-tighter leading-[0.9]"
                        >
                            Ready to Begin Your<br />
                            <span className="text-nepal-gold italic">Journey to Nepal?</span>
                        </motion.h2>
                        <p className="text-white/50 text-lg leading-relaxed mb-8 font-medium max-w-lg mx-auto lg:mx-0">
                            Join thousands of global citizens who have traveled to the Himalayas
                            through our secure website.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm font-black uppercase tracking-[0.2em] text-white/40">
                            {['Secure Login', 'Safe System', 'Online Now', '24/7 Support'].map(t => (
                                <span key={t} className="flex items-center gap-2 group cursor-default">
                                    <span className="w-1.5 h-1.5 rounded-full bg-nepal-gold animate-pulse group-hover:scale-150 transition-transform" /> {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 shrink-0 min-w-[280px] w-full lg:w-auto relative z-20">
                        <Link href="/apply" className="group relative flex items-center justify-center gap-3 bg-nepal-gold text-nepal-navy px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_-15px_rgba(212,160,23,0.4)] overflow-hidden">
                            <span className="relative z-10">Apply For Visa</span>
                            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                            <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 opacity-20" />
                        </Link>
                        <Link href="/track" className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">
                            <Clock size={18} className="text-nepal-gold" /> Track Status
                        </Link>
                        <Link href="/contact" className="text-center text-white/40 hover:text-nepal-gold text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-2 group">
                            Support Center <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);


/* ══════════════════════════════════════════════════════════
   PAGE ROOT
══════════════════════════════════════════════════════════ */
export default function Home() {
    return (
        <div className="bg-white">
            <Hero />
            <VisaTypes />
            <HowItWorks />
            <CTA />
        </div>
    );
}
