"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Loader2, CheckCircle, Clock, ShieldAlert,
    FileText, ScanFace, Fingerprint, Database, Download,
    Hash, Shield, Globe, Calendar, MapPin, ArrowRight,
    Info, KeyRound, ShieldCheck, Camera, User, Mail
} from 'lucide-react';
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

const TrackPage = () => {
    const [refNumber, setRefNumber] = useState('');
    const [passport, setPassport] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<null | 'not_found' | { refId: string; fullName: string; visaLabel: string; status: string; submittedAt: string; nationality: string }>(null);

    // Recovery States
    const [recoveryMode, setRecoveryMode] = useState<'none' | 'email' | 'question' | 'success'>('none');
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryQuestion, setRecoveryQuestion] = useState('');
    const [recoveryAnswer, setRecoveryAnswer] = useState('');
    const [recoveryError, setRecoveryError] = useState('');
    const [recoveredRefs, setRecoveredRefs] = useState<string[]>([]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!refNumber || !passport) return;
        setIsSearching(true);
        setResult(null);
        try {
            const res = await fetch(`/api/track?refId=${encodeURIComponent(refNumber)}&passport=${encodeURIComponent(passport)}`);
            const data = await res.json();
            if (data.success && data.found) {
                setResult(data.data);
            } else {
                setResult('not_found');
            }
        } catch {
            setResult('not_found');
        } finally {
            setIsSearching(false);
        }
    };

    const initiateRecovery = (e: React.FormEvent) => {
        e.preventDefault();
        setRecoveryError('');
        const rawUsers = localStorage.getItem('pf_registered_users');
        if (!rawUsers) {
            setRecoveryError('Registry database is empty. Please ensure you are registered.');
            return;
        }
        const users = JSON.parse(rawUsers);
        const foundUser = users.find((u: any) => u.email.toLowerCase() === recoveryEmail.toLowerCase());

        if (foundUser && foundUser.securityQuestion) {
            setRecoveryQuestion(foundUser.securityQuestion);
            setRecoveryMode('question');
        } else {
            setRecoveryError('This email is not associated with a security protocol in our registry.');
        }
    };

    const verifyAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        setRecoveryError('');
        const rawUsers = localStorage.getItem('pf_registered_users');
        const users = JSON.parse(rawUsers || '[]');
        const foundUser = users.find((u: any) => u.email.toLowerCase() === recoveryEmail.toLowerCase());

        if (foundUser && foundUser.securityAnswer.toLowerCase() === recoveryAnswer.toLowerCase().trim()) {
            // Success! Now fetch applications
            try {
                const res = await fetch('/api/applications');
                const data = await res.json();
                if (data.success) {
                    const apps = data.data.filter((a: any) => a.email.toLowerCase() === recoveryEmail.toLowerCase());
                    setRecoveredRefs(apps.map((a: any) => a.refId));
                    setRecoveryMode('success');
                }
            } catch {
                setRecoveryError('Failed to fetch dossier records. Internal link error.');
            }
        } else {
            setRecoveryError('Security verification failed. Secret answer mismatch.');
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

                {/* Decorative Flight Path */}
                <div className="absolute inset-0 pointer-events-none z-[1]">
                    <FlightPathSVG
                        paths={[
                            { d: 'M1440 400 C 1000 100, 400 600, 0 300', color: '#D4A017', dash: '8 6', opacity: 0.15, animate: true }
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
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nepal-gold">Tracking Terminal</span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
                            Status <span className="text-nepal-gold italic">Checkpoint</span>
                        </h1>
                        <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                            Access our secure verification gateway to retrieve the real-time status
                            of your immigration journey. Every milestone is digitally logged for your convenience.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Search Interface & Result Logic ── */}
            <section className="py-24 bg-white relative z-10 -mt-10 overflow-hidden">
                {/* Decorative Glass Background Blobs */}
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-nepal-gold/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-nepal-navy/5 rounded-full blur-[100px]" />

                <div className="container mx-auto px-6 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="backdrop-blur-[20px] bg-white/70 rounded-[3.5rem] shadow-[0_60px_100px_-30px_rgba(0,0,0,0.15)] border border-white/80 p-8 lg:p-20 overflow-hidden relative"
                    >
                        {/* Background subtle iconography */}
                        <div className="absolute top-10 right-10 text-nepal-navy/5 opacity-40 pointer-events-none ring-1 ring-nepal-navy/5 rounded-full p-12">
                            <Database size={240} strokeWidth={0.3} />
                        </div>

                        {/* Glass Highlight */}
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/30 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-nepal-gold/10 blur-[80px] rounded-full pointer-events-none" />

                        <form onSubmit={handleTrack} className="relative z-10 space-y-12">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 ml-2">
                                        <Fingerprint className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                        <label className="text-[11px] font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">System Reference</label>
                                    </div>
                                    <div className="relative group/field transition-all duration-500">
                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                        <div className="relative flex items-center bg-white/40 backdrop-blur-md border border-white/60 rounded-[2rem] group-focus-within/field:bg-white/80 group-focus-within/field:border-nepal-gold/30 transition-all duration-500 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg">
                                            <div className="pl-8 text-slate-400 group-focus-within/field:text-nepal-gold transition-colors">
                                                <Hash size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={refNumber}
                                                onChange={(e) => setRefNumber(e.target.value)}
                                                placeholder="NV-XXXXXX"
                                                className="w-full bg-transparent px-6 py-6 text-nepal-navy font-black tracking-widest placeholder:text-slate-300 placeholder:font-black outline-none text-base"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 ml-2">
                                        <ScanFace className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                        <label className="text-[11px] font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Identity Document</label>
                                    </div>
                                    <div className="relative group/field transition-all duration-500">
                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                        <div className="relative flex items-center bg-white/40 backdrop-blur-md border border-white/60 rounded-[2rem] group-focus-within/field:bg-white/80 group-focus-within/field:border-nepal-gold/30 transition-all duration-500 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg">
                                            <div className="pl-8 text-slate-400 group-focus-within/field:text-nepal-gold transition-colors">
                                                <Shield size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={passport}
                                                onChange={(e) => setPassport(e.target.value)}
                                                placeholder="PASSPORT NUMBER"
                                                className="w-full bg-transparent px-6 py-6 text-nepal-navy font-black tracking-widest placeholder:text-slate-300 placeholder:font-black outline-none text-base"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSearching}
                                className="group relative w-full h-[80px] rounded-[2rem] overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-50"
                            >
                                {/* Static Base Background */}
                                <div className="absolute inset-0 bg-[#0F172A]" />

                                {/* Animated Gradient Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(110deg,#0F172A,45%,#1e293b,55%,#0F172A)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Border Glow */}
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-nepal-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <span className="relative z-10 flex items-center justify-center gap-4 text-white font-black text-sm uppercase tracking-[0.4em]">
                                    {isSearching ? (
                                        <>
                                            <Loader2 className="animate-spin text-nepal-gold" size={20} />
                                            <span className="animate-pulse">Accessing Secure Vault...</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="relative">
                                                <Search size={20} className="group-hover:scale-110 transition-transform duration-500 text-nepal-gold" />
                                                <div className="absolute -inset-2 bg-nepal-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            Authorize Pipeline Search
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        {/* Result Handlers */}
                        <AnimatePresence mode="wait">
                            {result && (
                                <motion.div
                                    key={typeof result === 'string' ? result : result?.refId ?? 'found'}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mt-16 pt-16 border-t border-slate-100"
                                >
                                    {result === 'not_found' && (
                                        <div className="bg-rose-50/50 p-8 rounded-[2.5rem] border border-rose-100 flex flex-col lg:flex-row items-center gap-8 lg:text-left text-center">
                                            <div className="w-16 h-16 bg-white shadow-xl shadow-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
                                                <ShieldAlert size={32} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-black text-nepal-navy tracking-tight mb-2">Identification Error</h3>
                                                <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
                                                    Our global ledger could not verify this combination. Please ensure your reference number matches the ID provided in your <span className="text-nepal-navy font-bold underline decoration-rose-200">official confirmation email</span>.
                                                </p>
                                            </div>
                                            <button onClick={() => setResult(null)} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Clear Search</button>
                                        </div>
                                    )}

                                    {result && result !== 'not_found' && (
                                        <div className="space-y-12">
                                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 bg-nepal-navy text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                                                        <FileText size={26} />
                                                    </div>
                                                    <div>
                                                        <span className="text-nepal-gold font-black uppercase text-[10px] tracking-[0.3em]">{result.visaLabel}</span>
                                                        <h3 className="text-3xl font-black text-nepal-navy tracking-tighter">{result.refId}</h3>
                                                        <p className="text-slate-400 text-sm font-bold mt-1">{result.fullName} · {result.nationality}</p>
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-3 px-6 py-3 rounded-full border ${result.status === 'Approved'
                                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                                    : result.status === 'Rejected'
                                                        ? 'bg-rose-50 border-rose-100 text-rose-600'
                                                        : 'bg-blue-50 border-blue-100 text-blue-600'
                                                    }`}>
                                                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                                    <span className="text-xs font-black uppercase tracking-widest">{result.status}</span>
                                                </div>
                                            </div>

                                            {/* Stepper */}
                                            <div className="relative px-8">
                                                <div className="absolute top-6 left-12 right-12 h-[2px] bg-slate-100" />
                                                <div className="absolute top-6 left-12 w-1/4 h-[2px] bg-nepal-blue" />
                                                <div className="grid grid-cols-4 relative z-10">
                                                    {[
                                                        { label: 'Submitted', date: new Date(result.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), done: true },
                                                        { label: 'Screening', date: 'In Progress', done: false },
                                                        { label: 'Verification', date: 'Pending', done: false },
                                                        { label: 'Decision', date: 'Await', done: false },
                                                    ].map((st, i) => (
                                                        <div key={i} className="flex flex-col items-center">
                                                            <div className={`w-12 h-12 rounded-2xl border-2 mb-4 flex items-center justify-center transition-all ${st.done ? 'bg-nepal-blue border-blue-200 text-white shadow-xl shadow-nepal-blue/20 -translate-y-1' : 'bg-white border-slate-100 text-slate-300'}`}>
                                                                {st.done ? <CheckCircle size={20} /> : <span className="font-black text-sm">{i + 1}</span>}
                                                            </div>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${st.done ? 'text-nepal-navy' : 'text-slate-400'}`}>{st.label}</span>
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase">{st.date}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 border border-slate-100/50 p-6 rounded-[2rem] flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <Clock className="text-slate-300" size={18} />
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Submitted: <span className="text-nepal-navy">{new Date(result.submittedAt).toLocaleString()}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Support Node */}
                    <div className="mt-20">
                        {/* ... existing Support Node ... */}
                    </div>

                    {/* Recovery Modal */}
                    <AnimatePresence>
                        {recoveryMode !== 'none' && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setRecoveryMode('none')}
                                    className="absolute inset-0 bg-nepal-navy/80 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.05, y: 20 }}
                                    className="w-full max-w-md bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative z-10 border border-slate-100"
                                >
                                    <div className="text-center space-y-4 mb-8">
                                        <div className="w-16 h-16 bg-nepal-gold/10 rounded-2xl flex items-center justify-center mx-auto text-nepal-gold">
                                            <ShieldCheck size={32} />
                                        </div>
                                        <h2 className="text-2xl font-black text-nepal-navy tracking-tight uppercase">Identity Recovery</h2>
                                        <p className="text-slate-400 text-xs font-semibold">Accessing secure encryption for reference retrieval.</p>
                                    </div>

                                    {recoveryMode === 'email' && (
                                        <form onSubmit={initiateRecovery} className="space-y-6">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Registry Email</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={recoveryEmail}
                                                    onChange={e => setRecoveryEmail(e.target.value)}
                                                    placeholder="citizen@protocol.com"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-nepal-navy font-bold text-sm outline-none focus:ring-2 focus:ring-nepal-gold/20"
                                                />
                                            </div>
                                            {recoveryError && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">{recoveryError}</p>}
                                            <button type="submit" className="w-full bg-nepal-navy text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-nepal-gold hover:text-nepal-navy transition-all">
                                                Next Protocol
                                            </button>
                                        </form>
                                    )}

                                    {recoveryMode === 'question' && (
                                        <form onSubmit={verifyAnswer} className="space-y-6">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Security Verification</label>
                                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                                    <p className="text-[11px] font-black text-nepal-navy uppercase tracking-widest opacity-40">Challenge:</p>
                                                    <p className="text-sm font-black text-nepal-navy leading-relaxed">{recoveryQuestion}</p>
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={recoveryAnswer}
                                                    onChange={e => setRecoveryAnswer(e.target.value)}
                                                    placeholder="Enter Secret Secret Answer"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-nepal-navy font-bold text-sm outline-none focus:ring-2 focus:ring-nepal-gold/20"
                                                />
                                            </div>
                                            {recoveryError && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">{recoveryError}</p>}
                                            <button type="submit" className="w-full bg-nepal-navy text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-nepal-gold hover:text-nepal-navy transition-all shadow-xl">
                                                Verify Identity
                                            </button>
                                        </form>
                                    )}

                                    {recoveryMode === 'success' && (
                                        <div className="space-y-8">
                                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center">
                                                <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-4">Records Decrypted</p>
                                                <div className="space-y-2">
                                                    {recoveredRefs.length > 0 ? recoveredRefs.map(ref => (
                                                        <p key={ref} className="text-xl font-black text-nepal-navy select-all cursor-copy">{ref}</p>
                                                    )) : (
                                                        <p className="text-sm font-bold text-emerald-600/60">No application dossier found for this citizen.</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button onClick={() => setRecoveryMode('none')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all">
                                                Return to Portal
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </main>
    );
};

export default TrackPage;

