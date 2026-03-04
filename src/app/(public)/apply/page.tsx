"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, MapPin, FileUp, CreditCard, CheckCircle, ChevronRight, ChevronLeft,
    ShieldAlert, Fingerprint, Zap, ShieldCheck, Download, Loader2, AlertTriangle, Copy,
    Mail, Globe, Hash, Shield, Briefcase, GraduationCap, Home, Plane, Layers, Clock
} from 'lucide-react';
import Image from 'next/image';
import { UserAuthGuard } from '@/components/UserAuthGuard';

const FlightPathSVG = ({ viewBox = '0 0 1440 520', paths }: any) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        {paths.map((p: any, i: number) => (
            <path key={i} d={p.d} stroke={p.color} strokeWidth={p.thin ? 0.8 : 1.2} strokeDasharray={p.dash} strokeLinecap="round" opacity={p.opacity} style={p.animate ? { animation: 'dashMove 2.4s linear infinite' } : undefined} />
        ))}
    </svg>
);

const VISA_FEES: Record<string, string> = {
    Working: '$140.00', Study: '$60.00', Residential: '$750.00', Tourist: '$30.00',
};
const DURATIONS: Record<string, string> = {
    '6_months': 'Interim (6 Months)', '1_year': 'Standard (1 Year)', '5_years': 'Residential (5 Years)',
};

const ApplyPage = () => {
    const [step, setStep] = useState(1);
    const [selectedVisa, setSelectedVisa] = useState('Working');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', passportNumber: '',
        nationality: 'United States', visaType: 'working',
        duration: '1_year', address: '', email: '',
        documents: {} as Record<string, string>,
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [successData, setSuccessData] = useState<{ refId: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const steps = [
        { id: 1, name: 'Identity', icon: User },
        { id: 2, name: 'Mission', icon: MapPin },
        { id: 3, name: 'Archives', icon: FileUp },
        { id: 4, name: 'Finalize', icon: CreditCard },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileUpload = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setSubmitError(`SECURITY PROTOCOL VIOLATION: File ${file.name} exceeds 2MB limit.`);
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    documents: {
                        ...prev.documents,
                        [docName]: reader.result as string
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const nextStep = () => { setSubmitError(''); setStep(s => s + 1); };
    const prevStep = () => { setSubmitError(''); setStep(s => s - 1); };

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitError('');
        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    visaType: selectedVisa.toLowerCase(),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSuccessData({ refId: data.refId });
            } else {
                setSubmitError(data.error ?? 'Submission failed. Please try again.');
            }
        } catch {
            setSubmitError('Network error. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    const copyRef = () => {
        if (successData?.refId) {
            navigator.clipboard.writeText(successData.refId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (successData) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center font-outfit py-40">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-lg w-full mx-auto px-6 text-center space-y-8"
                >
                    <div className="w-28 h-28 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10">
                        <ShieldCheck size={52} className="text-emerald-500" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-4xl font-black text-nepal-navy tracking-tighter">
                            Application <span className="text-emerald-500 italic">Filed</span>
                        </h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Your visa application has been securely archived. Save your reference number — you&apos;ll need it to track your status.
                        </p>
                    </div>

                    <div className="bg-nepal-navy rounded-[2.5rem] p-8 text-white space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Official Reference ID</p>
                        <h2 className="text-4xl font-black tracking-[0.3em] font-mono text-nepal-gold">{successData.refId}</h2>
                        <button
                            onClick={copyRef}
                            className="flex items-center gap-2 mx-auto text-xs font-black uppercase tracking-widest text-white/40 hover:text-nepal-gold transition-colors"
                        >
                            <Copy size={14} />
                            {copied ? 'Copied!' : 'Copy to clipboard'}
                        </button>
                    </div>

                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Use this ID + your passport number on the{' '}
                        <a href="/track" className="text-nepal-gold underline">Track Application</a> page.
                    </p>
                </motion.div>
            </main>
        );
    }

    return (
        <UserAuthGuard>
            <main className="min-h-screen bg-white overflow-hidden font-outfit">
                {/* ── Hero ── */}
                <section className="relative pt-40 pb-24 bg-nepal-navy overflow-hidden">
                    <div className="absolute inset-0 opacity-20 scale-105">
                        <Image src="/images/mount_everest.png" alt="" fill className="object-cover" priority />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-nepal-navy/80 via-nepal-navy to-white" />
                    <div className="absolute inset-0 pointer-events-none z-[1]">
                        <FlightPathSVG paths={[{ d: 'M1440 300 C 1000 100, 400 500, 0 200', color: '#D4A017', dash: '8 6', opacity: 0.1, animate: true }]} />
                    </div>
                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="max-w-4xl">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="w-12 h-[2px] bg-nepal-gold" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nepal-gold">Official Entry Registry</span>
                            </div>
                            <h1 className="text-4xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
                                Visa <span className="text-nepal-gold italic">Deployment</span>
                            </h1>
                            <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                                Begin your secure application for Nepal. Our digital conduit ensures
                                your credentials are processed through the Department of Immigration&apos;s primary infrastructure.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── Form Section ── */}
                <section className="py-24 bg-white relative z-10 -mt-10">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="bg-white rounded-[4rem] shadow-[0_60px_100px_-30px_rgba(0,0,0,0.1)] border border-slate-100 p-8 lg:p-20 overflow-hidden relative"
                        >
                            {/* Stepper */}
                            <div className="mb-20">
                                <div className="flex justify-between relative px-2 sm:px-10">
                                    <div className="absolute top-6 left-12 right-12 h-[2px] bg-slate-50" />
                                    <div className="absolute top-6 left-12 h-[2px] bg-nepal-gold transition-all duration-1000" style={{ width: `${((step - 1) / (steps.length - 1)) * 90}%` }} />
                                    {steps.map((s) => (
                                        <div key={s.id} className="flex flex-col items-center relative z-10">
                                            <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 bg-white ${step >= s.id ? 'border-nepal-gold text-nepal-navy shadow-xl shadow-nepal-gold/20 scale-110' : 'border-slate-100 text-slate-300'}`}>
                                                {step > s.id ? <CheckCircle size={20} /> : <s.icon size={20} />}
                                            </div>
                                            <span className={`mt-4 text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-nepal-navy' : 'text-slate-300'}`}>{s.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form steps */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="space-y-12"
                                >
                                    {/* Step 1: Identity */}
                                    {step === 1 && (
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {[
                                                { label: 'Given Name', placeholder: 'AS PER PASSPORT', name: 'firstName', icon: User },
                                                { label: 'Surname', placeholder: 'FAMILY NAME', name: 'lastName', icon: User },
                                                { label: 'Email Access', placeholder: 'CITIZEN@PROTOCOL.COM', name: 'email', icon: Mail },
                                                { label: 'Passport ID', placeholder: 'OFFICIAL ID NUMBER', name: 'passportNumber', icon: Shield },
                                            ].map((field, i) => (
                                                <div key={i} className="space-y-4">
                                                    <div className="flex items-center gap-3 ml-2">
                                                        <field.icon className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                        <label className="text-[11px] font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">{field.label}</label>
                                                    </div>
                                                    <div className="relative group/field transition-all duration-500">
                                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-[2rem] group-focus-within/field:bg-white group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                            <input
                                                                type="text"
                                                                name={field.name}
                                                                value={(formData as any)[field.name]}
                                                                onChange={handleChange}
                                                                placeholder={field.placeholder}
                                                                required
                                                                className="w-full bg-transparent px-8 py-6 text-nepal-navy font-black placeholder:text-slate-300 placeholder:font-black outline-none text-base"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="space-y-4 md:col-span-2">
                                                <div className="flex items-center gap-3 ml-2">
                                                    <Globe className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                    <label className="text-[11px] font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Jurisdiction (Nationality)</label>
                                                </div>
                                                <div className="relative group/field transition-all duration-500">
                                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                    <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-[2rem] group-focus-within/field:bg-white group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                        <select
                                                            name="nationality"
                                                            value={formData.nationality}
                                                            onChange={handleChange}
                                                            className="w-full bg-transparent px-8 py-6 text-nepal-navy font-black outline-none appearance-none cursor-pointer"
                                                        >
                                                            {['United States', 'United Kingdom', 'China', 'India', 'Germany', 'France', 'Japan', 'Canada', 'Australia', 'Other'].map(c => <option key={c}>{c}</option>)}
                                                        </select>
                                                        <div className="absolute right-8 pointer-events-none text-slate-400">
                                                            <Zap size={14} className="group-focus-within/field:text-nepal-gold transition-colors" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Visa type */}
                                    {step === 2 && (
                                        <div className="space-y-12">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 ml-2">
                                                    <Layers className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                    <label className="text-[11px] font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Select Mission Category</label>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {[
                                                        { name: 'Working', icon: Briefcase },
                                                        { name: 'Study', icon: GraduationCap },
                                                        { name: 'Residential', icon: Home },
                                                        { name: 'Tourist', icon: Plane },
                                                    ].map((v) => (
                                                        <button
                                                            key={v.name}
                                                            type="button"
                                                            onClick={() => setSelectedVisa(v.name)}
                                                            className={`group relative p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-4 text-center overflow-hidden ${v.name === selectedVisa ? 'border-nepal-gold bg-nepal-gold/5 shadow-xl shadow-nepal-gold/10' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200'}`}
                                                        >
                                                            <div className={`transition-all duration-500 ${v.name === selectedVisa ? 'text-nepal-gold scale-110' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                                                <v.icon size={28} strokeWidth={1.5} />
                                                            </div>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${v.name === selectedVisa ? 'text-nepal-navy' : 'text-slate-400'}`}>
                                                                {v.name}
                                                            </span>
                                                            <div className={`absolute bottom-0 inset-x-0 h-1 bg-nepal-gold transition-transform duration-500 ${v.name === selectedVisa ? 'scale-x-100' : 'scale-x-0'}`} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 ml-2">
                                                    <Clock className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                    <label className="text-[11px] font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Requested Term</label>
                                                </div>
                                                <div className="relative group/field transition-all duration-500">
                                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                    <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-[2rem] group-focus-within/field:bg-white group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                        <select
                                                            name="duration"
                                                            value={formData.duration}
                                                            onChange={handleChange}
                                                            className="w-full bg-transparent px-8 py-6 text-nepal-navy font-black outline-none appearance-none cursor-pointer"
                                                        >
                                                            {Object.entries(DURATIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                                        </select>
                                                        <div className="absolute right-8 pointer-events-none text-slate-400">
                                                            <Zap size={14} className="group-focus-within/field:text-nepal-gold transition-colors" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 ml-2">
                                                    <MapPin className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                    <label className="text-[11px] font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Intended Domicile in Nepal</label>
                                                </div>
                                                <div className="relative group/field transition-all duration-500">
                                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                    <div className="relative bg-slate-50 border border-slate-200 rounded-[2rem] group-focus-within/field:bg-white group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                        <textarea
                                                            name="address"
                                                            value={formData.address}
                                                            onChange={handleChange}
                                                            rows={4}
                                                            placeholder="FULL PHYSICAL ADDRESS OR HOTEL CLUSTER..."
                                                            className="w-full bg-transparent px-8 py-6 text-nepal-navy font-black placeholder:text-slate-300 placeholder:font-black outline-none resize-none text-base"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Documents */}
                                    {step === 3 && (
                                        <div className="space-y-10">
                                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex items-center gap-6 relative overflow-hidden group">
                                                <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:rotate-12 transition-transform"><Fingerprint size={100} /></div>
                                                <div className="relative z-10">
                                                    <h4 className="text-xl font-black text-nepal-gold italic mb-2 tracking-tight">Vault Transmission Requirements</h4>
                                                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">Digital Scans Only · PDF/JPG · Max 2MB Protocol</p>
                                                </div>
                                            </div>
                                            <div className="grid gap-4">
                                                {['Passport Biography Page', 'Primary Identification Photo', 'Sponsorship Evidence', 'Fiscal Endorsement'].map((doc, i) => (
                                                    <div key={i} className="group flex items-center justify-between p-8 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-nepal-gold/30 hover:shadow-2xl hover:shadow-nepal-gold/5 transition-all">
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h4 className="text-sm font-black text-nepal-navy tracking-tight">{doc}</h4>
                                                                {formData.documents[doc] && (
                                                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
                                                                        <CheckCircle size={10} /> Archived
                                                                    </motion.span>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{i < 3 ? 'Required' : 'Optional'}</p>
                                                        </div>
                                                        <div className="relative">
                                                            <input
                                                                type="file"
                                                                id={`doc-${i}`}
                                                                className="hidden"
                                                                onChange={(e) => handleFileUpload(doc, e)}
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                            />
                                                            <label
                                                                htmlFor={`doc-${i}`}
                                                                className={`cursor-pointer px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${formData.documents[doc] ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border border-slate-200 text-nepal-navy hover:bg-nepal-gold group-hover:border-nepal-gold'}`}
                                                            >
                                                                <FileUp size={16} /> {formData.documents[doc] ? 'Replace' : 'Upload'}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Review */}
                                    {step === 4 && (
                                        <div className="space-y-12 text-center">
                                            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl border border-emerald-100">
                                                <ShieldCheck size={48} strokeWidth={1.5} />
                                            </motion.div>
                                            <div className="space-y-4">
                                                <h2 className="text-4xl lg:text-5xl font-black text-nepal-navy tracking-tighter uppercase italic">Pre-Flight <span className="text-nepal-gold">Verification</span></h2>
                                                <p className="text-slate-500 font-medium">Verify your payload before final ledger commitment.</p>
                                            </div>
                                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-left space-y-6 relative overflow-hidden group">
                                                <div className="absolute inset-0 opacity-5 pointer-events-none"><Image src="/images/airplane_bg_1.png" alt="" fill className="object-cover" /></div>
                                                {[
                                                    { label: 'Designated Agent', val: `${formData.firstName} ${formData.lastName}`.trim() || '—' },
                                                    { label: 'Passport ID', val: formData.passportNumber || '—' },
                                                    { label: 'Visa Protocol', val: `${selectedVisa} / ${DURATIONS[formData.duration]}` },
                                                    { label: 'Deployment Fee', val: VISA_FEES[selectedVisa] ?? '—', accent: true },
                                                ].map((row, i) => (
                                                    <div key={i} className={`flex justify-between items-center ${i !== 3 ? 'border-b border-white/5 pb-4' : 'pt-2'}`}>
                                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{row.label}</span>
                                                        <span className={`font-black ${row.accent ? 'text-nepal-gold text-2xl' : 'text-white'}`}>{row.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 bg-amber-50 p-6 rounded-2xl text-amber-800 border border-amber-100 italic">
                                                <ShieldAlert size={24} className="shrink-0" />
                                                <p className="text-left text-xs font-bold leading-relaxed uppercase tracking-tighter">I certify that all identification patterns provided match my official archival records.</p>
                                            </div>
                                            {submitError && (
                                                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-left">
                                                    <AlertTriangle size={18} className="text-red-400 shrink-0" />
                                                    <p className="text-red-600 text-sm font-bold">{submitError}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation controls */}
                            <div className="flex justify-between mt-20 pt-12 border-t border-slate-100">
                                <button
                                    onClick={prevStep}
                                    disabled={step === 1}
                                    className={`flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.4em] px-10 py-5 rounded-2xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-nepal-navy hover:bg-slate-50 active:scale-95'}`}
                                >
                                    <ChevronLeft size={16} strokeWidth={3} />
                                    <span>Secure Step Back</span>
                                </button>

                                <button
                                    onClick={step === 4 ? handleSubmit : nextStep}
                                    disabled={submitting}
                                    className="group relative h-[80px] px-12 rounded-[2rem] overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-nepal-navy/10"
                                >
                                    {/* Static Base Background */}
                                    <div className="absolute inset-0 bg-[#0F172A]" />

                                    {/* Animated Gradient Overlay */}
                                    <div className="absolute inset-0 bg-[linear-gradient(110deg,#0F172A,45%,#1e293b,55%,#0F172A)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    {/* Border Glow */}
                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-nepal-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <span className="relative z-10 flex items-center justify-center gap-4 text-white font-black text-xs uppercase tracking-[0.4em]">
                                        {step === 4 ? (
                                            submitting ? (
                                                <><Loader2 className="animate-spin text-nepal-gold" size={18} /> Transmitting Registry...</>
                                            ) : (
                                                <><ShieldCheck size={18} className="text-nepal-gold" /> Commit Mission Briefing</>
                                            )
                                        ) : (
                                            <>Passage to Next Sector <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </span>
                                </button>
                            </div>

                            {/* Footer meta */}
                            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-40">
                                <div className="flex items-center gap-4">
                                    <Download size={20} className="text-slate-300" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Download Offline Submission Log</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Zap size={20} className="text-nepal-gold" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Protocol v3.8.4 Active</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </UserAuthGuard>
    );
};

export default ApplyPage;
