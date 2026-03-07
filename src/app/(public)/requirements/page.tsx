"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, FileText, Building2, Briefcase, GraduationCap, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* ── Flight Path Helper (Consistent with Brand) ── */
const FlightPathSVG = ({ viewBox = '0 0 1440 520', paths }: any) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        {paths.map((p: any, i: number) => (
            <path key={i} d={p.d} stroke={p.color} strokeWidth={p.thin ? 0.8 : 1.2} strokeDasharray={p.dash} strokeLinecap="round" opacity={p.opacity} style={p.animate ? { animation: 'dashMove 2.4s linear infinite' } : undefined} />
        ))}
    </svg>
);

const RequirementsPage = () => {
    const [activeTab, setActiveTab] = useState('general');

    const categories = [
        { id: 'general', label: 'All Applicants', icon: FileText, subtitle: "Basic Info" },
        { id: 'business', label: 'Business Visa', icon: Building2, subtitle: "Trade Info" },
        { id: 'working', label: 'Working Visa', icon: Briefcase, subtitle: "Job Info" },
        { id: 'study', label: 'Study Visa', icon: GraduationCap, subtitle: "Student Info" },
    ];

    const requirements = {
        general: [
            "A valid passport for at least six months from the date of application.",
            "A high-resolution color scan of the bio-data page (PDF/JPG).",
            "A recently taken professional digital passport photo (White background).",
            "Completed digital application profile through this official portal.",
            "Valid proof of international health insurance coverage."
        ],
        business: [
            "Official Recommendation Letter from the relevant Ministry or Government Agency.",
            "Evidence of Investment or Business Partnership in Nepal.",
            "Authorized Letter from the Nepalese business partner or company.",
            "Company registration and tax clearance of the Nepalese host.",
            "Recent bank statements showing financial standing for business activities."
        ],
        working: [
            "Official Appointment Letter from the registered employer in Nepal.",
            "Government Approval (Department of Labor / Tourism / Industry).",
            "Company registration and tax clearance certificates (Latest FY).",
            "Professional Bio-data (CV/Resume) detailing relevant expertise.",
            "Work permit issued by the Ministry of Labor."
        ],
        study: [
            "Letter of Admission from a University.",
            "Official recommendation from the Ministry of Education of Nepal.",
            "Proof of money in bank (Last 6 months verified statements).",
            "Academic transcripts from previous institutions.",
            "No Objection Certificate (NOC) from your home country's embassy."
        ],
    };

    return (
        <main className="min-h-screen bg-white overflow-hidden font-outfit">
            {/* ── Cinematic Hero Architecture ── */}
            <section className="relative pt-24 lg:pt-40 pb-16 lg:pb-24 bg-nepal-navy overflow-hidden">
                <motion.div
                    initial={{ scale: 1, x: 0, y: 0 }}
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [20, 0, 20],
                        y: [-10, 0, -10]
                    }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "linear"
                    }}
                    className="absolute inset-0 opacity-25"
                >
                    <Image
                        src="/images/airplane_bg_2.png"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-nepal-navy/85 via-nepal-navy to-nepal-navy" />

                {/* Decorative Flight Path */}
                <div className="absolute inset-0 pointer-events-none z-[1]">
                    <FlightPathSVG
                        paths={[
                            { d: 'M0 300 C 400 150, 800 450, 1440 200', color: '#D4A017', dash: '8 6', opacity: 0.1, animate: true }
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
                            <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.5em] text-nepal-gold">Official Checklist</span>
                        </div>
                        <h1 className="text-3xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
                            Document <span className="text-nepal-gold italic">Checklist</span>
                        </h1>
                        <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed opacity-80">
                            Make sure all your documents are ready before starting your application.
                            Clear scans are needed for our records.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Tabs & Requirement Orchestration ── */}
            <section className="py-12 lg:py-24 bg-white relative z-10 -mt-2">
                <div className="container mx-auto px-6 max-w-6xl">
                    {/* Premium Glass Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`relative flex flex-col items-center gap-2 px-6 lg:px-8 py-4 lg:py-5 rounded-3xl transition-all duration-500 min-w-[140px] lg:min-w-[160px] group ${activeTab === cat.id
                                    ? 'bg-nepal-navy text-white shadow-[0_20px_40px_-10px_rgba(27,43,75,0.3)] scale-105'
                                    : 'bg-slate-50 text-slate-400 hover:bg-white hover:border-slate-200 border border-transparent'
                                    }`}
                            >
                                <cat.icon size={22} className={activeTab === cat.id ? 'text-nepal-gold' : 'group-hover:text-nepal-gold transition-colors'} />
                                <span className={`text-sm font-black uppercase tracking-widest ${activeTab === cat.id ? 'opacity-100' : 'opacity-60'}`}>{cat.label}</span>
                                {activeTab === cat.id && (
                                    <motion.div
                                        layoutId="tab-underline"
                                        className="absolute -bottom-1 w-8 h-[2px] bg-nepal-gold rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        {/* Summary Side */}
                        <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-8">
                            <motion.div
                                key={`side-${activeTab}`}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                <span className="text-nepal-gold font-black uppercase text-sm tracking-[0.3em] block mb-2">
                                    {categories.find(c => c.id === activeTab)?.subtitle}
                                </span>
                                <h2 className="text-3xl lg:text-5xl font-black text-nepal-navy tracking-tighter mb-6">
                                    {categories.find(c => c.id === activeTab)?.label}
                                </h2>
                                <p className="text-slate-500 font-medium leading-relaxed mb-8 text-lg">
                                    Documents needed to apply for a {categories.find(c => c.id === activeTab)?.label.toLowerCase()}.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-nepal-gold shadow-sm">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-nepal-navy uppercase tracking-widest">Safe & Secure</p>
                                            <p className="text-base text-slate-400 font-bold">Secure Upload</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-nepal-gold shadow-sm">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-nepal-navy uppercase tracking-widest">Review Time</p>
                                            <p className="text-base text-slate-400 font-bold">Normal Review</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* List Side */}
                        <div className="lg:col-span-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="space-y-4"
                                >
                                    {requirements[activeTab as keyof typeof requirements].map((req, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.04, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                                            className="flex items-start gap-4 lg:gap-6 p-6 lg:p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-nepal-gold/30 hover:shadow-xl hover:shadow-nepal-gold/5 transition-all group"
                                        >
                                            <div className="mt-1 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <p className="text-slate-700 leading-relaxed font-bold text-lg lg:text-xl group-hover:text-nepal-navy transition-colors">{req}</p>
                                        </motion.div>
                                    ))}

                                    <div className="mt-12 p-8 lg:p-10 bg-amber-50/50 rounded-[2.5rem] border border-amber-100 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                                            <AlertCircle size={120} />
                                        </div>
                                        <div className="flex items-start gap-6 relative z-10">
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-600 shadow-sm">
                                                <AlertCircle size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-nepal-navy uppercase text-base tracking-widest mb-2">Rules</h4>
                                                <p className="text-slate-600/80 leading-relaxed text-lg font-medium max-w-xl">
                                                    All documents must be in <span className="text-nepal-navy font-bold">English Only</span>. If your documents are in another language, you must provide a certified English translation. Max file size: <span className="text-nepal-navy font-bold text-xl">2MB per file</span>.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA Final Node ── */}
            <section className="py-12 lg:py-24 pb-32 lg:pb-32">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="bg-nepal-navy rounded-[3.5rem] p-12 lg:p-20 relative overflow-hidden"
                    >
                        {/* High-res BG overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none scale-110">
                            <Image src="/images/airplane_bg_2.png" alt="" fill className="object-cover" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.9]">Ready to Submit?</h3>
                            <p className="text-white/50 text-lg lg:text-2xl font-medium mb-10 max-w-lg mx-auto leading-relaxed">
                                Join our secure system for a smooth application. Your journey to Nepal starts here.
                            </p>
                            <Link
                                href="/apply"
                                className="inline-flex items-center justify-center gap-3 bg-nepal-gold text-nepal-navy px-12 py-6 rounded-2xl font-black text-base uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(212,160,23,0.3)]"
                            >
                                Start Application <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default RequirementsPage;

