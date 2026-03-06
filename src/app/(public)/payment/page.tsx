"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, ShieldCheck, ArrowRight, Loader2,
    CheckCircle2, AlertCircle, Lock, Globe,
    Zap, Landmark, Wallet
} from 'lucide-react';
import { UserAuthGuard } from '@/components/UserAuthGuard';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const PaymentPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refId = searchParams.get('ref');

    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [selectedMethod, setSelectedMethod] = useState<'card' | 'esewa' | 'khalti'>('card');

    useEffect(() => {
        if (!refId) {
            router.push('/my-applications');
            return;
        }

        fetch('/api/applications')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const app = data.data.find((a: any) => a.refId === refId);
                    if (app) {
                        setApplication(app);
                    } else {
                        setError('Application record not found in secure registry.');
                    }
                }
            })
            .catch(() => setError('Failed to establish connection with primary vault.'))
            .finally(() => setLoading(false));
    }, [refId, router]);

    const handlePayment = async () => {
        setProcessing(true);
        setError('');

        // Simulating high-security payment processing gateway
        await new Promise(r => setTimeout(r, 2500));

        try {
            const res = await fetch('/api/applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refId,
                    status: 'In Progress', // After payment, start the process
                    paymentStatus: 'Paid',
                    paymentMethod: selectedMethod === 'card' ? 'Global Card' : selectedMethod === 'esewa' ? 'eSewa Nepal' : 'Khalti Wallet',
                    paidAt: new Date().toISOString()
                })
            });

            const data = await res.json();
            if (data.success) {
                // Update local application state with the data from server (includes timeline)
                setApplication(data.data);
                setSuccess(true);
                setTimeout(() => {
                    router.push('/my-applications');
                }, 3000);
            } else {
                setError(data.error || 'Payment authorization failed.');
            }
        } catch (err) {
            setError('Electronic handshake failure. Please retry.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFEFE] flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <Loader2 className="w-12 h-12 text-nepal-gold animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-nepal-navy">Establishing Secure Channel</p>
                </div>
            </div>
        );
    }

    if (!application && !loading) {
        return (
            <div className="min-h-screen bg-[#FDFEFE] flex items-center justify-center p-6">
                <div className="max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-nepal-navy uppercase mb-4">Registry Error</h2>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error || 'Unknown protocol violation detected.'}</p>
                    <button onClick={() => router.back()} className="px-8 py-4 bg-nepal-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest">Return to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <UserAuthGuard>
            <main className="min-h-screen bg-[#FDFEFE] font-outfit pt-32 pb-24 relative overflow-hidden">
                {/* Visual Architecture */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-nepal-gold/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <AnimatePresence mode="wait">
                        {!success ? (
                            <motion.div
                                key="payment-form"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="grid lg:grid-cols-12 gap-12"
                            >
                                {/* Left Side: Order Intelligence */}
                                <div className="lg:col-span-4 space-y-8">
                                    <div className="bg-nepal-navy rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none translate-x-1/4 -translate-y-1/4">
                                            <Globe size={300} strokeWidth={0.5} />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-10">
                                                <div className="w-1 h-8 bg-nepal-gold rounded-full" />
                                                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-nepal-gold">Billing Briefing</h2>
                                            </div>

                                            <div className="space-y-8 mb-12">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Application Ref</p>
                                                    <p className="text-2xl font-black tracking-tight">{application.refId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Applicant Name</p>
                                                    <p className="text-lg font-bold">{application.fullName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Visa Protocol</p>
                                                    <p className="text-lg font-bold">{application.visaLabel}</p>
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-white/10 mt-12">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-nepal-gold mb-1">Total Fee Payable</p>
                                                        <p className="text-4xl font-black tracking-tighter">$150.00</p>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">USD Equiv.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100/50">
                                        <div className="flex gap-5">
                                            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-1 italic underline decoration-emerald-200 decoration-2">Secure Gateway</p>
                                                <p className="text-xs text-emerald-800/60 font-medium leading-relaxed uppercase">Your financial credentials are encrypted via AES-256 military-grade architecture.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Payment Infrastructure */}
                                <div className="lg:col-span-8 flex flex-col gap-8">
                                    <div className="bg-white rounded-[3rem] border border-slate-100 p-10 lg:p-16 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.03)] relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-12">
                                            <h3 className="text-4xl font-black text-nepal-navy tracking-tighter uppercase italic underline decoration-nepal-gold decoration-[4px] underline-offset-[8px]">Authorize <span className="text-nepal-gold">Payment</span></h3>
                                            <div className="flex gap-1">
                                                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-100" />)}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                                            {[
                                                { id: 'card', name: 'Global Card', icon: CreditCard },
                                                { id: 'esewa', name: 'eSewa Nepal', icon: Wallet },
                                                { id: 'khalti', name: 'Khalti Wallet', icon: Zap }
                                            ].map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setSelectedMethod(method.id as any)}
                                                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 group ${selectedMethod === method.id
                                                        ? 'border-nepal-gold bg-nepal-gold/5 shadow-xl shadow-nepal-gold/5'
                                                        : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-white'}`}
                                                >
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedMethod === method.id ? 'bg-nepal-navy text-white' : 'bg-slate-200/50 group-hover:bg-white'}`}>
                                                        <method.icon size={22} strokeWidth={2} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{method.name}</span>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-8">
                                            {selectedMethod === 'card' ? (
                                                <div className="space-y-6">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cardholder Authority</label>
                                                        <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:border-nepal-gold focus-within:shadow-xl focus-within:shadow-nepal-gold/15 transition-all">
                                                            <input type="text" placeholder="IDENTITY NAME AS PER RECORD" className="w-full bg-transparent px-8 py-5 text-nepal-navy font-black text-sm outline-none placeholder:text-slate-200 uppercase tracking-widest" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Identification Identifier</label>
                                                        <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:border-nepal-gold focus-within:shadow-xl focus-within:shadow-nepal-gold/15 transition-all">
                                                            <input type="text" placeholder="XXXX  XXXX  XXXX  XXXX" className="w-full bg-transparent px-8 py-5 text-nepal-navy font-black text-sm outline-none placeholder:text-slate-200 tracking-[0.5em]" />
                                                            <div className="absolute right-8 text-slate-300"><Lock size={20} /></div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Cipher</label>
                                                            <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl focus-within:border-nepal-gold transition-all">
                                                                <input type="text" placeholder="MM / YY" className="w-full bg-transparent px-8 py-5 text-nepal-navy font-black text-sm outline-none placeholder:text-slate-200 uppercase tracking-widest" />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV Key</label>
                                                            <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl focus-within:border-nepal-gold transition-all">
                                                                <input type="password" placeholder="•••" className="w-full bg-transparent px-8 py-5 text-nepal-navy font-black text-sm outline-none placeholder:text-slate-200 tracking-widest" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center space-y-6">
                                                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                                                        {selectedMethod === 'esewa' ? (
                                                            <div className="font-black text-emerald-600 text-3xl italic">eS</div>
                                                        ) : (
                                                            <Zap className="text-purple-600" size={40} />
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="text-xl font-black text-nepal-navy uppercase tracking-tight">External Gateway Redirect</h4>
                                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest max-w-[280px] mx-auto">Authorize via the {selectedMethod.toUpperCase()} secure node</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-16 space-y-6">
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex items-center gap-4 p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-xs font-black uppercase tracking-widest"
                                                >
                                                    <AlertCircle size={18} />
                                                    {error}
                                                </motion.div>
                                            )}

                                            <button
                                                onClick={handlePayment}
                                                disabled={processing}
                                                className="group relative w-full h-[80px] rounded-[2rem] overflow-hidden transition-all duration-700 active:scale-[0.98] disabled:opacity-50"
                                            >
                                                <div className="absolute inset-0 bg-nepal-navy" />
                                                <div className="absolute inset-0 bg-[linear-gradient(110deg,#0f172a,45%,#1e293b,55%,#0f172a)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                                <span className="relative z-10 flex items-center justify-center gap-4 text-white font-black text-sm uppercase tracking-[0.5em]">
                                                    {processing ? (
                                                        <><Loader2 className="animate-spin text-nepal-gold" size={24} /> <span className="animate-pulse">Authorizing Vault...</span></>
                                                    ) : (
                                                        <>Execute Transaction <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" /></>
                                                    )}
                                                </span>
                                            </button>

                                            <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] italic">
                                                Transaction layer 12 secured by Pathfinder Core v.24.1
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between px-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Pay Verified</span>
                                        </div>
                                        <div className="flex items-center gap-3 opacity-30 grayscale contrast-125">
                                            <Landmark size={20} />
                                            <ShieldCheck size={20} />
                                            <Lock size={20} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="payment-success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-xl mx-auto text-center space-y-12 py-10"
                            >
                                <div className="relative">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                                        className="w-40 h-40 bg-emerald-500 text-white rounded-[4rem] flex items-center justify-center mx-auto shadow-[0_40px_80px_rgba(16,185,129,0.3)] border-8 border-white group"
                                    >
                                        <CheckCircle2 size={90} strokeWidth={1} />
                                    </motion.div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-5xl lg:text-7xl font-black text-nepal-navy uppercase tracking-tighter leading-none italic">Payment <span className="text-emerald-500 underline decoration-nepal-navy decoration-[8px] underline-offset-[12px]">Confirmed</span></h2>
                                    <p className="text-slate-400 font-bold text-lg uppercase tracking-widest pt-4">Authorization Token: {Math.random().toString(36).substring(2, 10).toUpperCase()}-PAY</p>
                                </div>

                                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 max-w-sm mx-auto">
                                    <p className="text-nepal-navy font-black text-lg mb-4 italic">"The process has officially started."</p>
                                    <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8 italic">
                                        {application.issuanceTimeline || "Your visa is estimated to be issued within 5-7 business days. A digital record has been sent to your email."}
                                    </p>

                                    <div className="flex items-center justify-center gap-3 py-4 bg-slate-50 rounded-2xl animate-pulse">
                                        <Loader2 size={16} className="animate-spin text-nepal-gold" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nepal-navy">Redirecting to Applications...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </UserAuthGuard>
    );
};

export default PaymentPage;
