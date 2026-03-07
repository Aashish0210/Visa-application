"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Eye, EyeOff, Lock, Mail, AlertTriangle,
    Globe, Activity, Fingerprint, KeyRound, Loader2
} from 'lucide-react';

/* ── Demo credentials (swap with real auth later) ── */
const ADMIN_EMAIL = 'visa2026@gmail.com';
const ADMIN_PASSWORD = 'visa@2026';
const SESSION_KEY = 'pf_admin_session';

const ScanLine = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-[inherit]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nepal-gold/[0.03] to-transparent animate-[scanline_4s_linear_infinite]" />
    </div>
);

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [locked, setLocked] = useState(false);
    const [lockTimer, setLockTimer] = useState(0);
    const [timeStr, setTimeStr] = useState('');

    /* Clock */
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTimeStr(now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                timeZone: 'Asia/Kathmandu'
            }));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    /* Lock-out timer */
    useEffect(() => {
        if (!locked) return;
        let remaining = 30;
        setLockTimer(remaining);
        const id = setInterval(() => {
            remaining -= 1;
            setLockTimer(remaining);
            if (remaining <= 0) { setLocked(false); setAttempts(0); clearInterval(id); }
        }, 1000);
        return () => clearInterval(id);
    }, [locked]);

    /* Redirect if already logged in */
    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem(SESSION_KEY)) {
            router.replace('/admin/dashboard');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (locked) return;
        setError('');
        setLoading(true);

        await new Promise(r => setTimeout(r, 1400)); // simulated latency

        // Finals fallbacks
        let validEmail = ADMIN_EMAIL;
        let validPass = ADMIN_PASSWORD;

        if (email === validEmail && password === validPass) {
            const savedProfile = localStorage.getItem('pf_admin_profile');
            localStorage.setItem(SESSION_KEY, JSON.stringify({
                user: (savedProfile && JSON.parse(savedProfile).name) || 'Admin Officer',
                email,
                password: validPass, // Keep for dashboard verification
                loginAt: new Date().toISOString(),
                role: 'SUPER_ADMIN'
            }));
            router.replace('/admin/dashboard');
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            if (newAttempts >= 3) {
                setLocked(true);
                setError('Too many failed attempts. Account locked for 30 seconds.');
            } else {
                setError(`Invalid credentials. ${3 - newAttempts} attempt${3 - newAttempts !== 1 ? 's' : ''} remaining.`);
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020B18] font-outfit overflow-hidden flex relative">

            {/* ── Ambient grid background ── */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(212,160,23,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,160,23,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(27,43,75,0.6),transparent)] pointer-events-none" />

            {/* ── Gold corner accents ── */}
            <div className="absolute top-0 left-0 w-48 h-48 border-t-2 border-l-2 border-nepal-gold/20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 border-b-2 border-r-2 border-nepal-gold/20 pointer-events-none" />

            {/* ══════════════════════════════
                LEFT PANEL — Brand/Info
            ══════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 relative overflow-hidden"
            >
                {/* Background glow blobs */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-nepal-gold/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-40 w-72 h-72 bg-blue-800/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Logo */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-nepal-gold rounded-xl flex items-center justify-center shadow-lg shadow-nepal-gold/30">
                            <ShieldCheck size={20} className="text-nepal-navy" strokeWidth={2.5} />
                        </div>
                        <div>
                            <span className="text-white font-black text-xl tracking-tight">Pathfinder</span>
                            <span className="text-nepal-gold font-black text-xl tracking-tight"> Nepal</span>
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20 ml-[52px]">
                        Restricted Administration
                    </p>
                </div>

                {/* Central hero text */}
                <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px w-8 bg-nepal-gold/60" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nepal-gold">
                            Secure Command Center
                        </span>
                    </div>
                    <h1 className="text-5xl xl:text-6xl font-black text-white tracking-tighter leading-[0.9] mb-6">
                        Ministry of<br />
                        <span className="text-nepal-gold italic">Immigration</span><br />
                        Admin Portal
                    </h1>
                    <p className="text-white/40 text-base font-medium leading-relaxed max-w-md">
                        Authorized personnel only. All access attempts are logged,
                        monitored, and reported to the Department of Immigration, Nepal.
                    </p>

                    {/* Live stats */}
                    <div className="grid grid-cols-3 gap-4 mt-12">
                        {[
                            { label: 'Applications', value: '2,841', trend: '+12%' },
                            { label: 'Pending Review', value: '147', trend: 'Active' },
                            { label: 'Approved Today', value: '38', trend: '+8' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">{stat.label}</p>
                                <p className="text-white font-black text-2xl tracking-tight mb-1">{stat.value}</p>
                                <span className="text-[10px] font-bold text-nepal-gold">{stat.trend}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom system status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                            Systems Operational
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe size={12} className="text-white/20" />
                        <span className="text-[10px] font-bold text-white/20 font-mono">{timeStr} NPT</span>
                    </div>
                </div>
            </motion.div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-nepal-gold/20 to-transparent my-16" />

            {/* ══════════════════════════════
                RIGHT PANEL — Login Form
            ══════════════════════════════ */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-14 relative">

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
                    className="w-full max-w-md"
                >
                    {/* Restricted badge */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
                                Restricted Access
                            </span>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[2rem] p-8 lg:p-10 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                        <ScanLine />

                        {/* Top gold line */}
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-nepal-gold/50 to-transparent" />

                        {/* Header */}
                        <div className="mb-8 relative z-10">
                            <div className="w-16 h-16 bg-nepal-navy/60 border border-nepal-gold/30 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-nepal-gold/10">
                                <Fingerprint size={30} className="text-nepal-gold" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tighter mb-1">
                                Identity Verification
                            </h2>
                            <p className="text-white/30 text-[13px] font-medium">
                                Enter your administrative credentials to proceed.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5 relative z-10">

                            {/* Email */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 ml-2">
                                    <Mail className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                    <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Administrator Identity</label>
                                </div>
                                <div className="relative group/field transition-all duration-500">
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-xl opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                    <div className="relative flex items-center bg-white/[0.04] border border-white/[0.12] rounded-xl group-focus-within/field:bg-white/[0.08] group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden shadow-sm">
                                        <input
                                            id="admin-email"
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            disabled={locked || loading}
                                            placeholder="ADMIN@PROTOCOL.COM"
                                            required
                                            autoComplete="username"
                                            className="w-full bg-transparent px-6 py-5 text-white text-sm font-bold placeholder:text-white/10 placeholder:font-black focus:outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 ml-2">
                                    <Lock className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                    <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Access Key</label>
                                </div>
                                <div className="relative group/field transition-all duration-500">
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-xl opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                    <div className="relative flex items-center bg-white/[0.04] border border-white/[0.12] rounded-xl group-focus-within/field:bg-white/[0.08] group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden shadow-sm">
                                        <input
                                            id="admin-password"
                                            type={showPass ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            disabled={locked || loading}
                                            placeholder="••••••••••••"
                                            required
                                            autoComplete="current-password"
                                            className="w-full bg-transparent px-6 py-5 text-white text-sm font-bold placeholder:text-white/10 placeholder:font-black focus:outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed tracking-[0.3em]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="absolute right-6 text-nepal-gold/40 hover:text-nepal-gold transition-colors z-20"
                                            tabIndex={-1}
                                        >
                                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Error message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                                    >
                                        <AlertTriangle size={16} className="text-red-400 shrink-0" />
                                        <p className="text-red-300 text-xs font-bold">{error}</p>
                                        {locked && (
                                            <span className="ml-auto text-red-400 font-black text-xs tabular-nums">
                                                {lockTimer}s
                                            </span>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading || locked || !email || !password}
                                className="group relative w-full h-[70px] rounded-xl overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-nepal-gold/20"
                            >
                                {/* Static Base Background */}
                                <div className="absolute inset-0 bg-nepal-gold" />

                                {/* Animated Gradient Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(110deg,#D4A017,45%,#fcd34d,55%,#D4A017)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Border Glow */}
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <span className="relative z-10 flex items-center justify-center gap-4 text-nepal-navy font-black text-xs uppercase tracking-[0.4em]">
                                    {loading ? (
                                        <><Loader2 className="animate-spin text-white" size={20} /> <span className="animate-pulse italic">Verifying...</span></>
                                    ) : locked ? (
                                        <><Lock size={18} /> Locked Out</>
                                    ) : (
                                        <>
                                            <KeyRound size={18} /> Authorize Payload
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        {/* Security footer */}
                        <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-emerald-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                                    AES-256 Encrypted Session
                                </span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/15">
                                v2.4.1
                            </span>
                        </div>
                    </div>

                    {/* Below card notice */}
                    <div className="mt-6 text-center">
                        <p className="text-[10px] font-bold text-white/15 leading-relaxed">
                            Unauthorized access attempts are a criminal offense under Nepal&apos;s<br />
                            Electronic Transactions Act, 2063.
                        </p>
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                @keyframes scanline {
                    0%   { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                }
            `}</style>
        </div>
    );
}
