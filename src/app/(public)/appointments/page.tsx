"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle, ChevronRight, AlertCircle, ShieldCheck, Download, Zap, Globe } from 'lucide-react';
import Image from 'next/image';
import { UserAuthGuard } from '@/components/UserAuthGuard';

/* ── Flight Path Helper (Consistent with Brand) ── */
const FlightPathSVG = ({ viewBox = '0 0 1440 520', paths }: any) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        {paths.map((p: any, i: number) => (
            <path key={i} d={p.d} stroke={p.color} strokeWidth={p.thin ? 0.8 : 1.2} strokeDasharray={p.dash} strokeLinecap="round" opacity={p.opacity} style={p.animate ? { animation: 'dashMove 2.4s linear infinite' } : undefined} />
        ))}
    </svg>
);

const AppointmentsPage = () => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [step, setStep] = useState(1);

    const timeSlots = ["10:30 AM", "11:00 AM", "11:30 AM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"];

    return (
        <UserAuthGuard>
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
                                { d: 'M0 300 Q 720 0 1440 300', color: '#D4A017', dash: '8 6', opacity: 0.1, animate: true }
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
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nepal-gold">Field Verification Session</span>
                            </div>
                            <h1 className="text-4xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
                                Biometric <span className="text-nepal-gold italic">Access</span>
                            </h1>
                            <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                                Reserve your slot for official biometric enrollment and interview at the
                                Department of Immigration. This final checkpoint is required for all long-term deployments.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── Scheduling Infrastructure ── */}
                <section className="py-24 bg-white relative z-10 -mt-10">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white rounded-[4rem] shadow-[0_60px_100px_-30px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative"
                        >
                            <div className="grid lg:grid-cols-12">
                                {/* Mission Briefing Sidebar */}
                                <div className="lg:col-span-4 bg-nepal-navy p-10 lg:p-16 text-white relative">
                                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none translate-x-1/2 -translate-y-1/2">
                                        <Globe size={300} strokeWidth={0.5} />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tighter mb-10 italic text-nepal-gold">Briefing Node</h3>

                                    <div className="space-y-10 relative z-10">
                                        {[
                                            { icon: MapPin, title: "Deployment HQ", val: "Kalikasthan, Kathmandu" },
                                            { icon: AlertCircle, title: "Mandatory Gear", val: "Passport & Confirmation ID" },
                                            { icon: Clock, title: "Grace Period", val: "Arrive 15 min prior" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-5">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-all">
                                                    <item.icon className="text-nepal-gold" size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">{item.title}</p>
                                                    <p className="text-sm font-bold text-white/90 leading-snug">{item.val}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-20 p-8 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                                        <p className="text-[10px] font-black text-nepal-gold/50 mb-6 uppercase tracking-[0.2em] italic">Current Buffer Selection</p>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-white/30 font-bold uppercase tracking-widest">Protocol Date</span>
                                                <span className="font-black text-white underline decoration-nepal-gold">{selectedDate || 'Pending...'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-white/30 font-bold uppercase tracking-widest">Time Window</span>
                                                <span className="font-black text-white underline decoration-nepal-gold">{selectedTime || 'Pending...'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Window Selection Area */}
                                <div className="lg:col-span-8 p-10 lg:p-20 relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-16">
                                        <h4 className="text-2xl font-black text-nepal-navy tracking-tighter">Availability <span className="text-nepal-gold">Matrix</span></h4>
                                        <div className="flex gap-2">
                                            {[1, 2].map(i => (
                                                <div key={i} className={`h-1 rounded-full transition-all duration-700 ${step >= i ? 'w-12 bg-nepal-gold' : 'w-4 bg-slate-50'}`}></div>
                                            ))}
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, y: 18 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                className="space-y-12"
                                            >
                                                <div className="space-y-6">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">Select Mission Cycle (Date)</label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                        {[
                                                            { day: 'Mon', date: 'Mar 10' },
                                                            { day: 'Tue', date: 'Mar 11' },
                                                            { day: 'Wed', date: 'Mar 12' },
                                                            { day: 'Thu', date: 'Mar 13' },
                                                            { day: 'Fri', date: 'Mar 14' },
                                                            { day: 'Sun', date: 'Mar 16' },
                                                            { day: 'Mon', date: 'Mar 17' },
                                                            { day: 'Tue', date: 'Mar 18' },
                                                        ].map((item) => (
                                                            <button
                                                                key={item.date}
                                                                onClick={() => setSelectedDate(item.date)}
                                                                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center group ${selectedDate === item.date
                                                                    ? 'border-nepal-gold bg-nepal-gold/5 text-nepal-navy'
                                                                    : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-white'
                                                                    }`}
                                                            >
                                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">{item.day}</span>
                                                                <span className="text-sm font-black tracking-tight">{item.date}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">Slot Allocation (Time)</label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {timeSlots.map((time) => (
                                                            <button
                                                                key={time}
                                                                onClick={() => setSelectedTime(time)}
                                                                className={`p-4 rounded-2xl border-2 transition-all text-[11px] font-black uppercase tracking-widest ${selectedTime === time
                                                                    ? 'border-nepal-navy bg-nepal-navy text-white shadow-xl shadow-nepal-navy/20'
                                                                    : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 text-slate-400'
                                                                    }`}
                                                            >
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    disabled={!selectedDate || !selectedTime}
                                                    onClick={() => setStep(2)}
                                                    className="group relative w-full bg-nepal-navy text-white py-6 rounded-2xl overflow-hidden font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-nepal-gold hover:text-nepal-navy transition-all duration-500 active:scale-95 disabled:opacity-50"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                                        Archive Selection & Proceed
                                                        <ChevronRight size={18} />
                                                    </span>
                                                    <div className="absolute inset-0 bg-nepal-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                                                </button>
                                            </motion.div>
                                        )}

                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                className="text-center py-10 space-y-10"
                                            >
                                                <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl border border-emerald-100">
                                                    <ShieldCheck size={56} strokeWidth={1.5} />
                                                </div>
                                                <div className="space-y-4">
                                                    <h3 className="text-4xl lg:text-5xl font-black text-nepal-navy tracking-tighter uppercase italic">Reservation <span className="text-emerald-500">Locked.</span></h3>
                                                    <p className="text-slate-500 font-medium">Your session is archived in the Department's central registry.</p>
                                                </div>

                                                <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-3xl text-left max-w-sm mx-auto relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-8 opacity-5 text-white underline decoration-nepal-gold">
                                                        <Download size={100} />
                                                    </div>
                                                    <div className="flex justify-between items-center mb-6">
                                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Archival Ref</span>
                                                        <span className="text-xs font-black text-nepal-gold font-mono tracking-widest uppercase">APT-99283-KM</span>
                                                    </div>
                                                    <div className="space-y-4 mb-10 text-white">
                                                        <div className="flex items-center gap-4">
                                                            <Calendar size={16} className="text-white/30" />
                                                            <span className="text-sm font-bold tracking-tight">{selectedDate}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <Clock size={16} className="text-white/30" />
                                                            <span className="text-sm font-bold tracking-tight">{selectedTime}</span>
                                                        </div>
                                                    </div>
                                                    <button className="w-full bg-white text-nepal-navy py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-nepal-gold transition-all active:scale-95">
                                                        Download Protocol Voucher
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => window.location.href = '/'}
                                                    className="text-[10px] font-black text-nepal-navy uppercase tracking-[0.3em] hover:text-nepal-gold transition-colors"
                                                >
                                                    Return to Terminal Home
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* Support Node */}
                        <div className="mt-16 pt-16 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-10 opacity-40">
                            <div className="flex items-center gap-4">
                                <Zap size={20} className="text-nepal-gold" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">High-Fidelity Biometric Encryption Active</p>
                            </div>
                            <div className="flex gap-10">
                                <button className="text-[10px] font-black uppercase tracking-widest hover:text-nepal-navy">Cancellation Protocol</button>
                                <button className="text-[10px] font-black uppercase tracking-widest hover:text-nepal-navy">Help Archives</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </UserAuthGuard>
    );
};

export default AppointmentsPage;
