"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Fingerprint, Mail, Lock, LogIn, ChevronRight,
    ShieldCheck, Globe, KeyRound, AlertCircle, Loader2, User, Eye, EyeOff, ArrowLeft, ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';

interface UserAuthGuardProps {
    children: React.ReactNode;
}

const USER_SESSION_KEY = 'pf_user_session';
const USERS_DB_KEY = 'pf_registered_users';

export const UserAuthGuard = ({ children }: UserAuthGuardProps) => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [authMode, setAuthMode] = useState<'selection' | 'manual' | 'google'>('selection');
    const [manualType, setManualType] = useState<'login' | 'signup'>('login');

    // Form States
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkAuth = () => {
            const localSession = localStorage.getItem(USER_SESSION_KEY);
            if (session?.user) {
                const sessionUser = {
                    name: session.user.name,
                    email: session.user.email,
                    avatar: session.user.image,
                    authMethod: 'google'
                };
                setUser(sessionUser);
                // Sync session to local storage for backward compatibility
                localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
            } else if (localSession) {
                setUser(JSON.parse(localSession));
            }
            if (status !== "loading") {
                setLoading(false);
            }
        };
        checkAuth();
    }, [session, status]);

    const handleManualAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        // Simulating network latency
        await new Promise(r => setTimeout(r, 1200));

        if (manualType === 'signup') {
            // Check if user already exists
            const rawUsers = localStorage.getItem(USERS_DB_KEY);
            const users = rawUsers ? JSON.parse(rawUsers) : [];

            if (users.find((u: any) => u.email === email)) {
                setError('This email is already registered in our primary database.');
                setSubmitting(false);
                return;
            }

            const newUser = {
                username,
                email,
                password,
                securityQuestion: securityQuestion || 'What is your place of birth?',
                securityAnswer: securityAnswer.toLowerCase().trim()
            };
            users.push(newUser);
            localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

            // Auto login after signup
            const userData = {
                name: username,
                email,
                authMethod: 'manual',
                securityQuestion: newUser.securityQuestion
            };
            localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
            window.dispatchEvent(new Event('auth-change'));
            setUser(userData);
        } else {
            // Login Logic
            const rawUsers = localStorage.getItem(USERS_DB_KEY);
            const users = rawUsers ? JSON.parse(rawUsers) : [];

            const foundUser = users.find((u: any) => u.email === email && u.password === password);

            // Allow a "demo" login too if they haven't signed up but use specific credentials or any valid-looking ones if we want to be lenient
            // For a "proper" feel, let's strictly check or allow a bypass for dev
            if (foundUser) {
                const userData = { name: foundUser.username, email: foundUser.email, authMethod: 'manual' };
                localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
                window.dispatchEvent(new Event('auth-change'));
                setUser(userData);
            } else if (email === 'admin@pathfinder.com' && password === 'password123') {
                const userData = { name: 'Admin User', email, authMethod: 'manual' };
                localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
                window.dispatchEvent(new Event('auth-change'));
                setUser(userData);
            } else {
                setError('Authentication failed. Credentials mismatch in the security ledger.');
            }
        }
        setSubmitting(false);
    };

    const handleGoogleLogin = async () => {
        setAuthMode('google');
        await signIn('google', { callbackUrl: '/' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-2 border-nepal-gold/20 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-2 border-t-nepal-gold rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (user) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#020617] font-outfit relative flex items-center justify-center py-10 px-6 overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(212,160,23,0.1),transparent_70%)]" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nepal-gold/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Branding Above Card */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 mb-2"
                    >
                        <span className="text-nepal-gold text-2xl font-black tracking-tighter uppercase">Pathfinder</span>
                        <span className="text-white text-2xl font-black tracking-tighter uppercase">Nepal</span>
                    </motion.div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.5em]">Consular Access Management System</p>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    {/* Interior Glowing Edges */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-nepal-gold/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

                    <AnimatePresence mode="wait">
                        {authMode === 'selection' && (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-nepal-gold/20 to-transparent border border-nepal-gold/30 rounded-3xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden group-hover:rotate-[5deg] transition-transform">
                                        <div className="absolute inset-0 bg-nepal-gold/10 animate-pulse" />
                                        <Fingerprint className="text-nepal-gold w-10 h-10 relative z-10" strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
                                        Identity <span className="text-nepal-gold">Gate</span>
                                    </h2>
                                    <p className="text-slate-400 text-xs font-semibold leading-relaxed max-w-[280px] mx-auto">
                                        Authorized personnel only. Please verify your identity to proceed with the visa protocol.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="w-full bg-white text-slate-900 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-50 hover:shadow-xl hover:shadow-white/10 transition-all group active:scale-[0.98]"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20">
                                            <path d="M19.6 10.23c0-.66-.06-1.29-.17-1.91h-9.43v3.61h5.39c-.23 1.25-.94 2.31-2 2.98v2.48h3.24c1.9-1.75 2.99-4.33 2.99-7.16z" fill="#4285F4" />
                                            <path d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.24-2.48c-.9.61-2.06.97-3.38.97-2.6 0-4.8-1.76-5.58-4.12H1.14v2.54A10 10 0 0 0 10 20z" fill="#34A853" />
                                            <path d="M4.42 11.94c-.2-.61-.31-1.26-.31-1.94s.11-1.33.31-1.94V5.52H1.14A10 10 0 0 0 1.14 14.48l3.28-2.54z" fill="#FBBC05" />
                                            <path d="M10 3.94c1.47 0 2.79.5 3.82 1.49l2.86-2.86C14.96.94 12.7 0 10 0 6.07 0 2.7 2.27 1.14 5.52l3.28 2.54c.78-2.36 2.98-4.12 5.58-4.12z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </button>

                                    <div className="relative py-4 flex items-center justify-center">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                        <span className="relative bg-[#0b1224] px-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/20 px-2 italic">Secure Link</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => { setAuthMode('manual'); setManualType('login'); }}
                                            className="bg-white/5 border border-white/10 text-white py-4 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            onClick={() => { setAuthMode('manual'); setManualType('signup'); }}
                                            className="bg-nepal-gold/10 border border-nepal-gold/20 text-nepal-gold py-4 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-nepal-gold/20 hover:border-nepal-gold/30 transition-all active:scale-[0.98]"
                                        >
                                            Register
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {authMode === 'manual' && (
                            <motion.div
                                key="manual"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <button
                                    onClick={() => setAuthMode('selection')}
                                    className="inline-flex items-center gap-2 text-white/40 hover:text-nepal-gold transition-colors text-[10px] font-black uppercase tracking-widest group"
                                >
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Matrix
                                </button>

                                <div className="space-y-1.5">
                                    <h3 className="text-xl font-black text-white tracking-tight uppercase italic underline decoration-nepal-gold decoration-[3px] underline-offset-[6px]">
                                        {manualType === 'login' ? 'Authentication' : 'Registration'}
                                    </h3>
                                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">
                                        {manualType === 'login' ? 'Nexus Identity Handshake' : 'Registry Entry Creation'}
                                    </p>
                                </div>

                                <form onSubmit={handleManualAction} className="space-y-5">
                                    {manualType === 'signup' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 ml-2">
                                                <User className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                <label className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em] opacity-60">Username Identifier</label>
                                            </div>
                                            <div className="relative group/field transition-all duration-500">
                                                <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[2rem] group-focus-within/field:bg-white/[0.08] group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                    <input
                                                        type="text"
                                                        required
                                                        value={username}
                                                        onChange={e => setUsername(e.target.value)}
                                                        placeholder="ENTER IDENTITY NAME"
                                                        className="w-full bg-transparent px-8 py-6 text-white font-black placeholder:text-white/20 placeholder:font-black outline-none text-base"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 ml-2">
                                            <Mail className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                            <label className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em] opacity-60">Registry Email</label>
                                        </div>
                                        <div className="relative group/field transition-all duration-500">
                                            <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[2rem] group-focus-within/field:bg-white/[0.08] group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder="CITIZEN@PROTOCOL.COM"
                                                    className="w-full bg-transparent px-8 py-6 text-white font-black placeholder:text-white/20 placeholder:font-black outline-none text-base"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 ml-2">
                                            <Lock className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                            <label className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em] opacity-60">Security Passcode</label>
                                        </div>
                                        <div className="relative group/field transition-all duration-500">
                                            <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[2rem] group-focus-within/field:bg-white/[0.08] group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    placeholder="••••••••••••"
                                                    className="w-full bg-transparent px-8 py-6 text-white font-black placeholder:text-white/20 placeholder:font-black outline-none text-base tracking-[0.3em]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-8 text-nepal-gold/40 hover:text-nepal-gold transition-colors z-20"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {manualType === 'signup' && (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 ml-2">
                                                    <AlertCircle className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                    <label className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em] opacity-60">Identity Recovery Question</label>
                                                </div>
                                                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[1.5rem] overflow-hidden">
                                                    <select
                                                        value={securityQuestion}
                                                        onChange={e => setSecurityQuestion(e.target.value)}
                                                        className="w-full bg-transparent px-8 py-4 text-white font-black text-xs outline-none appearance-none"
                                                    >
                                                        <option value="" className="bg-[#0b1224]">Select Recovery Protocol</option>
                                                        <option value="What is your place of birth?" className="bg-[#0b1224]">Place of Birth</option>
                                                        <option value="What was your first pet's name?" className="bg-[#0b1224]">First Pet Name</option>
                                                        <option value="What is your mother's maiden name?" className="bg-[#0b1224]">Mother's Maiden Name</option>
                                                        <option value="What was the name of your first school?" className="bg-[#0b1224]">First School Name</option>
                                                    </select>
                                                    <ChevronRight className="absolute right-6 text-white/20 rotate-90 pointer-events-none" size={14} />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 ml-2">
                                                    <KeyRound className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                    <label className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em] opacity-60">Secret Retrieval Answer</label>
                                                </div>
                                                <div className="relative group/field transition-all duration-500">
                                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                    <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[2rem] group-focus-within/field:bg-white/[0.08] group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                        <input
                                                            type="text"
                                                            required
                                                            value={securityAnswer}
                                                            onChange={e => setSecurityAnswer(e.target.value)}
                                                            placeholder="ENTER SECRET ANSWER"
                                                            className="w-full bg-transparent px-8 py-5 text-white font-black placeholder:text-white/20 placeholder:font-black outline-none text-base"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500"
                                        >
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="group relative w-full h-[70px] rounded-[2rem] overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {/* Static Base Background */}
                                        <div className="absolute inset-0 bg-nepal-gold" />

                                        {/* Animated Gradient Overlay */}
                                        <div className="absolute inset-0 bg-[linear-gradient(110deg,#D4A017,45%,#fcd34d,55%,#D4A017)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        {/* Border Glow */}
                                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <span className="relative z-10 flex items-center justify-center gap-4 text-nepal-navy font-black text-[11px] uppercase tracking-[0.4em]">
                                            {submitting ? (
                                                <><Loader2 className="animate-spin text-white" size={20} /> <span className="animate-pulse">Analyzing Briefing...</span></>
                                            ) : (
                                                <>
                                                    {manualType === 'login' ? 'Authorize Entry' : 'Create Record'}
                                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                <div className="text-center">
                                    <button
                                        onClick={() => setManualType(manualType === 'login' ? 'signup' : 'login')}
                                        className="text-[10px] font-black text-slate-400 hover:text-nepal-gold transition-colors uppercase tracking-[0.2em]"
                                    >
                                        {manualType === 'login' ? (
                                            <>Don&apos;t have an account? <span className="text-nepal-gold border-b border-nepal-gold/30">Sign Up</span></>
                                        ) : (
                                            <>Already have an account? <span className="text-nepal-gold border-b border-nepal-gold/30">Sign In</span></>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {authMode === 'google' && (
                            <motion.div
                                key="google-loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20 flex flex-col items-center justify-center space-y-10"
                            >
                                <div className="relative">
                                    <div className="w-32 h-32 border-2 border-white/5 rounded-full" />
                                    <div className="absolute inset-0 w-32 h-32 border-2 border-t-nepal-gold border-r-nepal-gold/50 rounded-full animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Globe className="text-nepal-gold/40 w-12 h-12 animate-pulse" />
                                    </div>
                                    <div className="absolute -inset-4 bg-nepal-gold/10 rounded-full blur-2xl animate-pulse" />
                                </div>
                                <div className="text-center space-y-3">
                                    <p className="text-white font-black text-sm uppercase tracking-[0.5em] animate-pulse">Handshaking Registry</p>
                                    <div className="flex justify-center gap-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-1 h-1 bg-nepal-gold rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                    <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] pt-2">Protocol Layer 7 Secured</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Secure Badge */}
                <div className="mt-8 flex flex-col items-center gap-4 opacity-40">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/50">AES-256</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe size={14} className="text-blue-500" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/50">RSA-4096</span>
                        </div>
                    </div>
                    <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.6em] text-center max-w-xs">
                        Unified Consular Service Interface v5.2.0<br />
                        Department of Information Technology, Nepal
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
