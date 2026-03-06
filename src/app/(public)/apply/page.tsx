"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, MapPin, FileUp, CreditCard, CheckCircle, ChevronRight, ChevronLeft,
    ShieldAlert, Fingerprint, Zap, ShieldCheck, Download, Loader2, AlertTriangle, Copy,
    Mail, Globe, Hash, Shield, Briefcase, GraduationCap, Home, Plane, Layers, Clock, Lock
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
    const [isUpdate, setIsUpdate] = useState(false);
    const [rejectedDocs, setRejectedDocs] = useState<string[]>([]);
    const [originalDocs, setOriginalDocs] = useState<Record<string, string>>({});
    const [refId, setRefId] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showDone, setShowDone] = useState(false);

    React.useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    React.useEffect(() => {
        const session = localStorage.getItem('pf_user_session');
        if (session) {
            const userData = JSON.parse(session);
            setFormData(prev => ({
                ...prev,
                email: userData.email || prev.email,
                firstName: userData.name?.split(' ')[0] || prev.firstName,
                lastName: userData.name?.split(' ').slice(1).join(' ') || prev.lastName,
            }));
        }

        const params = new URLSearchParams(window.location.search);
        const s = params.get('step');
        if (s) setStep(parseInt(s));

        const r = params.get('ref');
        if (r) {
            // ... existing ref logic ...
            setRefId(r);
            setIsUpdate(true);
            fetch('/api/applications')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const app = data.data.find((a: any) => a.refId === r);
                        if (app) {
                            setFormData({
                                firstName: app.firstName || '',
                                lastName: app.lastName || '',
                                email: app.email || '',
                                passportNumber: app.passportNumber || '',
                                nationality: app.nationality || 'United States',
                                visaType: app.visaType || 'working',
                                duration: app.duration || '1_year',
                                address: app.address || '',
                                documents: app.documents || {},
                            });
                            setOriginalDocs(app.documents || {});
                            setRejectedDocs(app.rejectedDocuments || []);
                            // Capitalize first letter for selectedVisa
                            const vt = app.visaType || 'working';
                            setSelectedVisa(vt.charAt(0).toUpperCase() + vt.slice(1));
                        }
                    }
                });
        }
    }, []);

    const steps = [
        { id: 1, name: 'Personal', icon: User },
        { id: 2, name: 'Visa Details', icon: MapPin },
        { id: 3, name: 'Documents', icon: FileUp },
        { id: 4, name: 'Review', icon: CreditCard },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileUpload = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setSubmitError(`File ${file.name} is too large. Max size is 2MB.`);
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
                setToast({ message: `${docName} synchronized successfully.`, type: 'success' });
            };
            reader.readAsDataURL(file);
        }
    };

    const nextStep = () => { setSubmitError(''); setStep(s => s + 1); };
    const prevStep = () => { setSubmitError(''); setStep(s => s - 1); };

    const handleUpdate = async () => {
        setSubmitting(true);
        setSubmitError('');

        // Only send changed documents to the admin
        const updatedDocs: Record<string, string> = {};
        Object.entries(formData.documents).forEach(([name, data]) => {
            if (data !== originalDocs[name]) {
                updatedDocs[name] = data;
            }
        });

        try {
            const res = await fetch('/api/applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refId: refId,
                    documents: updatedDocs,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowDone(true);
                setToast({ message: 'All changes have been successfully committed.', type: 'success' });
                // Brief delay to let user see "DONE" state on button
                setTimeout(() => {
                    setSuccessData({ refId: refId });
                }, 1500);
            } else {
                setSubmitError(data.error ?? 'Update failed. Please try again.');
            }
        } catch {
            setSubmitError('Network error. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

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
                        <p className="text-xs font-black uppercase tracking-[0.5em] text-white/30">Your Reference Number</p>
                        <h2 className="text-4xl font-black tracking-[0.3em] font-mono text-nepal-gold">{successData.refId}</h2>
                        <button
                            onClick={copyRef}
                            className="flex items-center gap-2 mx-auto text-sm font-black uppercase tracking-widest text-white/40 hover:text-nepal-gold transition-colors"
                        >
                            <Copy size={14} />
                            {copied ? 'Copied!' : 'Copy ID'}
                        </button>
                    </div>

                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 max-w-xs mx-auto md:max-w-none">
                        Use this ID + your passport number on the{' '}
                        <Link href="/track" className="text-nepal-gold underline">Track Application</Link> page.
                    </p>
                </motion.div>
            </main>
        );
    }

    return (
        <UserAuthGuard>
            <main className="min-h-screen bg-white overflow-hidden font-outfit">
                {/* ── Hero ── */}
                <section className="relative pt-24 lg:pt-40 pb-16 lg:pb-24 bg-nepal-navy overflow-hidden">
                    <motion.div
                        initial={{ scale: 1, x: 0 }}
                        animate={{ scale: [1, 1.08, 1], x: [-10, 10, -10] }}
                        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 opacity-25"
                    >
                        <Image src="/images/professional_hero_nepal.png" alt="" fill className="object-cover" priority />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-b from-nepal-navy/85 via-nepal-navy to-nepal-navy" />
                    <div className="absolute inset-0 pointer-events-none z-[1]">
                        <FlightPathSVG paths={[{ d: 'M1440 300 C 1000 100, 400 500, 0 200', color: '#D4A017', dash: '8 6', opacity: 0.1, animate: true }]} />
                    </div>
                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="max-w-4xl">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="w-10 h-[2px] bg-nepal-gold" />
                                <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.5em] text-nepal-gold">Official Application</span>
                            </div>
                            <h1 className="text-3xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
                                Visa <span className="text-nepal-gold italic">Application</span>
                            </h1>
                            <p className="text-slate-300 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed opacity-80">
                                Begin your secure application for Nepal. Our easy process ensures
                                your details are correctly submitted to the Department of Immigration.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── Form Section ── */}
                <section className="py-12 lg:py-24 bg-white relative z-10 -mt-2 pb-32 lg:pb-24">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="bg-white rounded-[2.5rem] lg:rounded-[4rem] shadow-[0_60px_100px_-30px_rgba(0,0,0,0.1)] border border-slate-100 p-6 lg:p-20 overflow-hidden relative"
                        >
                            {/* Stepper */}
                            <div className="mb-12 lg:mb-20 overflow-x-auto pb-4 scrollbar-hide">
                                <div className="flex justify-between relative px-4 lg:px-10 min-w-[450px] lg:min-w-0">
                                    <div className="absolute top-5 lg:top-6 left-10 lg:right-12 right-10 lg:left-12 h-[1.5px] bg-slate-50" />
                                    <div className="absolute top-5 lg:top-6 left-10 h-[1.5px] bg-nepal-gold transition-all duration-1000" style={{ width: `${((step - 1) / (steps.length - 1)) * 80}%` }} />
                                    {steps.map((s) => (
                                        <div key={s.id} className="flex flex-col items-center relative z-10">
                                            <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-2xl border flex items-center justify-center transition-all duration-500 bg-white ${step >= s.id ? 'border-nepal-gold text-nepal-navy shadow-lg shadow-nepal-gold/15 scale-110' : 'border-slate-100 text-slate-300'}`}>
                                                {step > s.id ? <CheckCircle size={14} className="lg:size-[18px]" /> : <s.icon size={14} className="lg:size-[18px]" />}
                                            </div>
                                            <span className={`mt-2 lg:mt-4 text-[8px] lg:text-xs font-black uppercase tracking-widest ${step >= s.id ? 'text-nepal-navy' : 'text-slate-300'}`}>{s.name}</span>
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
                                                { label: 'First Name', placeholder: 'AS PER PASSPORT', name: 'firstName', icon: User },
                                                { label: 'Last Name', placeholder: 'FAMILY NAME', name: 'lastName', icon: User },
                                                { label: 'Email', placeholder: 'USER@EMAIL.COM', name: 'email', icon: Mail },
                                                { label: 'Passport No.', placeholder: 'PASSPORT NUMBER', name: 'passportNumber', icon: Shield },
                                            ].map((field, i) => (
                                                <div key={i} className="space-y-4">
                                                    <div className="flex items-center gap-3 ml-2">
                                                        <field.icon className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                        <label className="text-sm font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">{field.label}</label>
                                                    </div>
                                                    <div className="relative group/field transition-all duration-500">
                                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                        <div className="relative flex items-center bg-white border border-slate-200 rounded-xl md:rounded-[2rem] group-focus-within/field:border-nepal-gold group-focus-within/field:shadow-2xl group-focus-within/field:shadow-nepal-gold/10 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                            <input
                                                                type="text"
                                                                name={field.name}
                                                                value={(formData as any)[field.name]}
                                                                onChange={handleChange}
                                                                placeholder={field.placeholder}
                                                                required
                                                                className="w-full bg-transparent px-5 lg:px-8 py-3.5 lg:py-6 text-nepal-navy font-black placeholder:text-slate-300 placeholder:font-black outline-none text-sm lg:text-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="space-y-4 md:col-span-2">
                                                <div className="flex items-center gap-3 ml-2">
                                                    <Globe className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                    <label className="text-sm font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Nationality</label>
                                                </div>
                                                <div className="relative group/field transition-all duration-500">
                                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                    <div className="relative flex items-center bg-white border border-slate-300 rounded-[2rem] group-focus-within/field:border-nepal-gold group-focus-within/field:shadow-2xl group-focus-within/field:shadow-nepal-gold/15 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
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
                                                    <label className="text-sm font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Visa Type</label>
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
                                                            className={`group relative p-4 lg:p-8 rounded-[1.2rem] lg:rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-2 lg:gap-4 text-center overflow-hidden ${v.name === selectedVisa ? 'border-nepal-gold bg-nepal-gold/5 shadow-xl shadow-nepal-gold/10' : 'border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200'}`}
                                                        >
                                                            <div className={`transition-all duration-500 ${v.name === selectedVisa ? 'text-nepal-gold scale-110' : 'text-slate-300 group-hover:text-slate-500'}`}>
                                                                <v.icon size={22} className="md:size-[28px]" strokeWidth={1.5} />
                                                            </div>
                                                            <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${v.name === selectedVisa ? 'text-nepal-navy' : 'text-slate-400'}`}>
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
                                                    <label className="text-sm font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">How long will you stay?</label>
                                                </div>
                                                <div className="relative group/field transition-all duration-500">
                                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                    <div className="relative flex items-center bg-white border border-slate-300 rounded-[2rem] group-focus-within/field:border-nepal-gold group-focus-within/field:shadow-2xl group-focus-within/field:shadow-nepal-gold/15 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
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
                                                    <label className="text-sm font-black text-nepal-navy uppercase tracking-[0.2em] opacity-60">Where will you stay in Nepal?</label>
                                                </div>
                                                <div className="relative group/field transition-all duration-500">
                                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-[2rem] opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                    <div className="relative bg-white border border-slate-300 rounded-[2rem] group-focus-within/field:border-nepal-gold group-focus-within/field:shadow-2xl group-focus-within/field:shadow-nepal-gold/15 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md">
                                                        <textarea
                                                            name="address"
                                                            value={formData.address}
                                                            onChange={handleChange}
                                                            rows={4}
                                                            placeholder="FULL ADDRESS OR HOTEL NAME..."
                                                            className="w-full bg-transparent px-8 py-6 text-nepal-navy font-black placeholder:text-slate-400 placeholder:font-black outline-none resize-none text-lg"
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
                                                    <h4 className="text-xl font-black text-nepal-gold italic mb-2 tracking-tight">Upload Documents</h4>
                                                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">PDF or JPG · Max 2MB per file</p>
                                                </div>
                                            </div>
                                            <div className="grid gap-4">
                                                {['Passport Photo Page', 'Profile Photo', 'Proof of Support', 'Company/Bank Letter'].map((doc, i) => {
                                                    const isRejected = rejectedDocs.includes(doc);
                                                    const isModified = formData.documents[doc] && formData.documents[doc] !== originalDocs[doc];
                                                    const isUploaded = !!formData.documents[doc];
                                                    const isLocked = isUpdate && !isRejected && !!originalDocs[doc];

                                                    return (
                                                        <div key={i} className={`group flex items-center justify-between p-5 lg:p-8 rounded-2xl lg:rounded-[2rem] border transition-all ${isLocked ? 'bg-slate-50 border-emerald-100/50 opacity-80' : isRejected && !isModified ? 'bg-rose-50/50 border-rose-100 hover:border-rose-300' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-nepal-gold/30 hover:shadow-2xl hover:shadow-nepal-gold/5'}`}>
                                                            <div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex items-center gap-2">
                                                                        {isLocked && <Lock size={12} className="text-emerald-500" />}
                                                                        <h4 className={`text-sm font-black tracking-tight ${isLocked ? 'text-slate-500' : 'text-nepal-navy'}`}>{doc}</h4>
                                                                    </div>
                                                                    {isLocked ? (
                                                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                                            <ShieldCheck size={10} /> Verified
                                                                        </motion.span>
                                                                    ) : isModified ? (
                                                                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
                                                                            <CheckCircle size={10} /> Updated
                                                                        </motion.span>
                                                                    ) : isUploaded ? (
                                                                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">
                                                                            <CheckCircle size={10} /> File Present
                                                                        </motion.span>
                                                                    ) : null}
                                                                    {isRejected && !isModified && (
                                                                        <span className="flex items-center gap-1 text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-full">
                                                                            <AlertTriangle size={10} /> Action Needed
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${isLocked ? 'text-emerald-600/60' : isRejected && !isModified ? 'text-rose-400' : 'text-slate-400'}`}>
                                                                    {isLocked ? 'Document verified by immigration' : isRejected ? 'Admin requested re-upload' : (i < 3 ? 'Required' : 'Optional')}
                                                                </p>
                                                            </div>
                                                            <div className="relative">
                                                                {!isLocked && (
                                                                    <>
                                                                        <input
                                                                            type="file"
                                                                            id={`doc-${i}`}
                                                                            className="hidden"
                                                                            onChange={(e) => handleFileUpload(doc, e)}
                                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                                        />
                                                                        <label
                                                                            htmlFor={`doc-${i}`}
                                                                            className={`cursor-pointer px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${isModified ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : (isRejected ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white border border-slate-200 text-nepal-navy hover:bg-nepal-gold group-hover:border-nepal-gold')}`}
                                                                        >
                                                                            <FileUp size={16} /> {isUploaded ? 'Replace' : 'Upload'}
                                                                        </label>
                                                                    </>
                                                                )}
                                                                {isLocked && (
                                                                    <div className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-2">
                                                                        <ShieldCheck size={16} /> Secure
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
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
                                                <h2 className="text-3xl lg:text-5xl font-black text-nepal-navy tracking-tighter uppercase italic">Review your <span className="text-nepal-gold">Application</span></h2>
                                                <p className="text-slate-500 font-medium text-lg">Please check your details before submitting.</p>
                                            </div>
                                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-left space-y-6 relative overflow-hidden group">
                                                <div className="absolute inset-0 opacity-5 pointer-events-none"><Image src="/images/airplane_bg_1.png" alt="" fill className="object-cover" /></div>
                                                {[
                                                    { label: 'Full Name', val: `${formData.firstName} ${formData.lastName}`.trim() || '—' },
                                                    { label: 'Passport No.', val: formData.passportNumber || '—' },
                                                    { label: 'Visa Details', val: `${selectedVisa} / ${DURATIONS[formData.duration]}` },
                                                    { label: 'Visa Fee', val: VISA_FEES[selectedVisa] ?? '—', accent: true },
                                                ].map((row, i) => (
                                                    <div key={i} className={`flex justify-between items-center ${i !== 3 ? 'border-b border-white/5 pb-4' : 'pt-2'}`}>
                                                        <span className="text-xs font-black text-white/30 uppercase tracking-[0.3em]">{row.label}</span>
                                                        <span className={`font-black ${row.accent ? 'text-nepal-gold text-2xl' : 'text-white text-lg'}`}>{row.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 bg-amber-50 p-6 rounded-2xl text-amber-800 border border-amber-100 italic">
                                                <ShieldAlert size={24} className="shrink-0" />
                                                <p className="text-left text-sm font-bold leading-relaxed uppercase tracking-tighter">I certify that all information provided is true and matches my passport.</p>
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
                                    className={`flex items-center gap-3 font-black text-xs lg:text-sm uppercase tracking-widest lg:tracking-[0.4em] px-6 lg:px-10 py-5 rounded-2xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-nepal-navy hover:bg-slate-50 active:scale-95'}`}
                                >
                                    <ChevronLeft size={16} strokeWidth={3} />
                                    <span>Back</span>
                                </button>
                                <button
                                    onClick={isUpdate && step === 3 ? handleUpdate : (step === 4 ? handleSubmit : nextStep)}
                                    disabled={submitting}
                                    className={`group relative h-[80px] px-12 rounded-[2rem] overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-50 shadow-2xl ${isUpdate && step === 3 ? 'shadow-emerald-500/20' : 'shadow-nepal-navy/10'}`}
                                >
                                    {/* Static Base Background */}
                                    <div className={`absolute inset-0 ${isUpdate && step === 3 ? 'bg-emerald-600' : 'bg-[#0F172A]'}`} />

                                    {/* Animated Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-[linear-gradient(110deg,transparent,45%,rgba(255,255,255,0.1),55%,transparent)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                    {/* Border Glow */}
                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <span className="relative z-10 flex items-center justify-center gap-4 text-white font-black text-sm uppercase tracking-[0.4em]">
                                        {isUpdate && step === 3 ? (
                                            submitting ? (
                                                <><Loader2 className="animate-spin text-white" size={18} /> Updating...</>
                                            ) : showDone ? (
                                                <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-3"><CheckCircle size={20} className="text-white" /> Done</motion.span>
                                            ) : (
                                                <><ShieldCheck size={18} className="text-white" /> Update Application</>
                                            )
                                        ) : step === 4 ? (
                                            submitting ? (
                                                <><Loader2 className="animate-spin text-nepal-gold" size={18} /> Submitting...</>
                                            ) : (
                                                <><ShieldCheck size={18} className="text-nepal-gold" /> Submit Application</>
                                            )
                                        ) : (
                                            <>Next <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </span>
                                </button>
                            </div>

                            {/* Footer meta */}
                            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-40">
                                <div className="flex items-center gap-4">
                                    <Download size={20} className="text-slate-300" />
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Download Offline Form</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Zap size={20} className="text-nepal-gold" />
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Secure System Active</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Toast Notification */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex items-center gap-4 text-white min-w-[320px]"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                            </div>
                            <span className="text-sm font-black tracking-tight">{toast.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </UserAuthGuard>
    );
};

export default ApplyPage;
