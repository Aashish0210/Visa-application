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
        { id: 'general', label: 'All Applicants', icon: FileText, subtitle: "Standard Protocol" },
        { id: 'working', label: 'Working Visa', icon: Briefcase, subtitle: "Labor Compliance" },
        { id: 'study', label: 'Study Visa', icon: GraduationCap, subtitle: "Academic Intake" },
        { id: 'residential', label: 'Residential Visa', icon: Building2, subtitle: "Long-term Assets" },
    ];

    const requirements = {
        general: [
            "A valid passport for at least six months from the date of application.",
            "A high-resolution color scan of the bio-data page (PDF/JPG).",
            "A recently taken professional digital passport photo (White background).",
            "Completed digital application profile through this official portal.",
            "Valid proof of international health insurance coverage."
        ],
        working: [
            "Official Appointment Letter from the registered employer in Nepal.",
            "Ministerial Approval (Department of Labor / Tourism / Industry).",
            "Company registration and tax clearance certificates (Latest FY).",
            "Professional Bio-data (CV/Resume) detailing relevant expertise.",
            "Consular work permit issued by the Ministry of Labor."
        ],
        study: [
            "Letter of Admission from a University Grant Commission (UGC) institution.",
            "Official recommendation from the Ministry of Education of Nepal.",
            "Proof of financial liquidity (Last 6 months verified statements).",
            "Attested academic transcripts from previous institutions.",
            "No Objection Certificate (NOC) from your home country's embassy."
        ],
        residential: [
            "Verified evidence of investment in Nepal (Min. $100,000 USD equivalent).",
            "Retiree status only: Verified annual income/pension of $20,000+ USD.",
            "Interpol-integrated Police Clearance Certificate (Last 6 months).",
            "Official health clearance issued by a certified Nepalese facility.",
            "Notarized property title or authorized long-term lease agreement."
        ]
    };

    return (
        <main className="min-h-screen bg-white overflow-hidden font-outfit">
            {/* ── Cinematic Hero Architecture ── */}
            <section className="relative pt-40 pb-24 bg-nepal-navy overflow-hidden">
                <div className="absolute inset-0 opacity-20 scale-110">
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
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-[2px] bg-nepal-gold" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nepal-gold">Documentation Pipeline</span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
                            Required <span className="text-nepal-gold italic">Checklist</span>
                        </h1>
                        <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                            Ensure all documentation is verified and digitally ready before initiating your application protocol.
                            High-quality scans are mandatory for archival security.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Tabs & Requirement Orchestration ── */}
            <section className="py-24 bg-white relative z-10">
                <div className="container mx-auto px-6 max-w-6xl">
                    {/* Premium Glass Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`relative flex flex-col items-center gap-2 px-8 py-5 rounded-3xl transition-all duration-500 min-w-[160px] group ${activeTab === cat.id
                                    ? 'bg-nepal-navy text-white shadow-[0_20px_40px_-10px_rgba(27,43,75,0.3)] scale-105'
                                    : 'bg-slate-50 text-slate-400 hover:bg-white hover:border-slate-200 border border-transparent'
                                    }`}
                            >
                                <cat.icon size={22} className={activeTab === cat.id ? 'text-nepal-gold' : 'group-hover:text-nepal-gold transition-colors'} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${activeTab === cat.id ? 'opacity-100' : 'opacity-60'}`}>{cat.label}</span>
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
                                <span className="text-nepal-gold font-black uppercase text-[10px] tracking-[0.3em] block mb-2">
                                    {categories.find(c => c.id === activeTab)?.subtitle}
                                </span>
                                <h2 className="text-4xl font-black text-nepal-navy tracking-tighter mb-6">
                                    {categories.find(c => c.id === activeTab)?.label}
                                </h2>
                                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                    Specific documentation required to validate your entry under the {categories.find(c => c.id === activeTab)?.label.toLowerCase()} framework.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-nepal-gold shadow-sm">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-nepal-navy uppercase tracking-widest">Security Clearance</p>
                                            <p className="text-xs text-slate-400 font-bold">Encrypted Submission</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-nepal-gold shadow-sm">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-nepal-navy uppercase tracking-widest">Review Period</p>
                                            <p className="text-xs text-slate-400 font-bold">Standard Gov Pipe</p>
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
                                            className="flex items-start gap-6 p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-nepal-gold/30 hover:shadow-xl hover:shadow-nepal-gold/5 transition-all group"
                                        >
                                            <div className="mt-1 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <p className="text-slate-700 leading-relaxed font-bold group-hover:text-nepal-navy transition-colors">{req}</p>
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
                                                <h4 className="font-black text-nepal-navy uppercase text-xs tracking-widest mb-2">Technical Standards</h4>
                                                <p className="text-slate-600/80 leading-relaxed text-sm font-medium max-w-xl">
                                                    All documentation must be in <span className="text-nepal-navy font-bold">Official English</span>. If the original documents are in another language, they must be accompanied by an officially notarized English translation. Max file size: <span className="text-nepal-navy font-bold text-base">2MB per file</span>.
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
            <section className="py-24 pb-32">
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
                            <h3 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tighter">Ready to Submit?</h3>
                            <p className="text-white/50 text-lg font-medium mb-10 max-w-lg mx-auto leading-relaxed">
                                Join our encrypted ecosystem for a seamless application experience. Your journey to Nepal starts here.
                            </p>
                            <Link
                                href="/apply"
                                className="inline-flex items-center justify-center gap-3 bg-nepal-gold text-nepal-navy px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(212,160,23,0.3)]"
                            >
                                Start Application Access <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default RequirementsPage;

