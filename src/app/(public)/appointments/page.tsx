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
                    <motion.div
                        initial={{ scale: 1, x: 0 }}
                        animate={{ scale: [1, 1.1, 1], x: [10, -10, 10] }}
                        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 opacity-25"
                    >
                        <Image
                            src="/images/hero_kathmandu_4k.png"
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
                            <div className="flex items-center gap-4 mb-4">
                                <span className="w-10 h-[2px] bg-nepal-gold" />
                                <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.5em] text-nepal-gold">Your Visit</span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
                                Book Your <span className="text-nepal-gold italic">Visit</span>
                            </h1>
                            <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed opacity-80">
                                Book your time for fingerprints and interview. This is the final step for your visa.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── Scheduling Infrastructure ── */}
                <section className="py-24 bg-white relative z-10 -mt-2">
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
                                    <h3 className="text-4xl font-black tracking-tighter mb-10 italic text-nepal-gold">Important</h3>

                                    <div className="space-y-10 relative z-10">
                                        {[
                                            { icon: MapPin, title: "Location", val: "Kalikasthan, Kathmandu" },
                                            { icon: AlertCircle, title: "What to Bring", val: "Passport & Confirmation ID" },
                                            { icon: Clock, title: "When to Arrive", val: "Arrive 15 min prior" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-5">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-all">
                                                    <item.icon className="text-nepal-gold" size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white/30 uppercase tracking-[0.3em] mb-1">{item.title}</p>
                                                    <p className="text-lg font-bold text-white/90 leading-snug">{item.val}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-20 p-8 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                                        <p className="text-sm font-black text-nepal-gold/50 mb-6 uppercase tracking-[0.2em] italic">Your Choice</p>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-white/30 font-bold uppercase tracking-widest">Date</span>
                                                <span className="font-black text-white underline decoration-nepal-gold text-base">{selectedDate || 'Select...'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-white/30 font-bold uppercase tracking-widest">Time</span>
                                                <span className="font-black text-white underline decoration-nepal-gold text-base">{selectedTime || 'Select...'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Window Selection Area */}
                                <div className="lg:col-span-8 p-10 lg:p-20 relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-16">
                                        <h4 className="text-4xl font-black text-nepal-navy tracking-tighter">Choose Your <span className="text-nepal-gold">Time</span></h4>
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
                                                    <label className="text-base font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">Select a Date</label>
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
                                                                <span className="text-sm font-black uppercase tracking-[0.2em] mb-1 opacity-50">{item.day}</span>
                                                                <span className="text-xl font-black tracking-tight">{item.date}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <label className="text-base font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">Select a Time</label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {timeSlots.map((time) => (
                                                            <button
                                                                key={time}
                                                                onClick={() => setSelectedTime(time)}
                                                                className={`p-4 rounded-2xl border-2 transition-all text-sm font-black uppercase tracking-widest ${selectedTime === time
                                                                    ? 'border-nepal-navy bg-nepal-navy text-white shadow-xl shadow-nepal-navy/20'
                                                                    : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 text-slate-400'
                                                                    }`}
                                                            >
                                                                <span className="text-base font-black uppercase tracking-widest">{time}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    disabled={!selectedDate || !selectedTime}
                                                    onClick={() => setStep(2)}
                                                    className="group relative w-full bg-nepal-navy text-white py-6 rounded-2xl overflow-hidden font-black text-base uppercase tracking-[0.4em] shadow-2xl hover:bg-nepal-gold hover:text-nepal-navy transition-all duration-500 active:scale-95 disabled:opacity-50"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                                        Confirm & Continue
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
                                                    <h3 className="text-4xl lg:text-6xl font-black text-nepal-navy tracking-tighter uppercase italic">Stay <span className="text-emerald-500">Booked!</span></h3>
                                                    <p className="text-slate-500 font-medium text-xl">Your visit has been successfully saved.</p>
                                                </div>

                                                <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-3xl text-left max-w-sm mx-auto relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-8 opacity-5 text-white underline decoration-nepal-gold">
                                                        <Download size={100} />
                                                    </div>
                                                    <div className="flex justify-between items-center mb-6">
                                                        <span className="text-sm font-black text-white/30 uppercase tracking-[0.4em]">Ref ID</span>
                                                        <span className="text-base font-black text-nepal-gold font-mono tracking-widest uppercase">APT-99283-KM</span>
                                                    </div>
                                                    <div className="space-y-4 mb-10 text-white">
                                                        <div className="flex items-center gap-4">
                                                            <Calendar size={16} className="text-white/30" />
                                                            <span className="text-xl font-bold tracking-tight">{selectedDate}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <Clock size={16} className="text-white/30" />
                                                            <span className="text-xl font-bold tracking-tight">{selectedTime}</span>
                                                        </div>
                                                    </div>
                                                    <button className="w-full bg-white text-nepal-navy py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-nepal-gold transition-all active:scale-95">
                                                        Get Slip
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => window.location.href = '/'}
                                                    className="text-sm font-black text-nepal-navy uppercase tracking-[0.3em] hover:text-nepal-gold transition-colors"
                                                >
                                                    Back to Home
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
                                <p className="text-sm font-black uppercase tracking-widest text-slate-400">Secure System Active</p>
                            </div>
                            <div className="flex gap-10">
                                <button className="text-sm font-black uppercase tracking-widest hover:text-nepal-navy">Cancel Visit</button>
                                <button className="text-sm font-black uppercase tracking-widest hover:text-nepal-navy">Get Help</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </UserAuthGuard>
    );
};

export default AppointmentsPage;
