"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Shield, Bell, Key,
    Globe, Camera, Save, ArrowLeft, ArrowRight,
    CheckCircle, ShieldCheck, Fingerprint, FileText, LayoutDashboard, ArrowUpRight
} from 'lucide-react';
import { UserAuthGuard } from '@/components/UserAuthGuard';
import Image from 'next/image';
import Link from 'next/link';

const ProfilePage = () => {
    const [user, setUser] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [showLogin, setShowLogin] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const session = localStorage.getItem('pf_user_session');
        if (session) {
            const userData = JSON.parse(session);
            setUser(userData);
            setName(userData.name || '');
            setPhone(userData.phone || '');
            setAddress(userData.address || '');
            setAvatar(userData.avatar || '');
        }
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise(r => setTimeout(r, 1200));

        const updatedUser = {
            ...user,
            name,
            phone,
            address,
            avatar
        };

        // Update Session
        localStorage.setItem('pf_user_session', JSON.stringify(updatedUser));

        // Update User DB
        const rawUsers = localStorage.getItem('pf_registered_users');
        if (rawUsers) {
            const users = JSON.parse(rawUsers);
            const index = users.findIndex((u: any) => u.email === user.email);
            if (index !== -1) {
                users[index] = {
                    ...users[index],
                    username: name,
                    phone,
                    address,
                    avatar
                };
                localStorage.setItem('pf_registered_users', JSON.stringify(users));
            }
        }

        // Trigger navbar update
        window.dispatchEvent(new Event('auth-change'));

        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    if (!user && !showLogin) {
        return (
            <main className="min-h-screen bg-[#F8FAFC] font-outfit pt-10 md:pt-32 pb-24 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center px-6"
                >
                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mx-auto mb-8 border border-slate-50">
                        <User size={40} className="text-slate-200" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-nepal-navy uppercase tracking-tight mb-4">
                        Login to see your <span className="text-nepal-gold">details</span>
                    </h2>
                    <p className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.4em] mb-10 max-w-[280px] mx-auto leading-relaxed">
                        Authorized access is required to manage your visa profile and documents
                    </p>

                    <button
                        onClick={() => setShowLogin(true)}
                        className="bg-nepal-navy text-white px-10 py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl shadow-nepal-navy/20 hover:bg-nepal-gold hover:text-nepal-navy transition-all active:scale-95 flex items-center gap-3 mx-auto"
                    >
                        Sign In Now <ArrowRight size={16} />
                    </button>

                    <div className="mt-12 flex items-center justify-center gap-6 opacity-30 grayscale">
                        <ShieldCheck size={20} />
                        <Fingerprint size={20} />
                        <Globe size={20} />
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <UserAuthGuard>
            <main className="min-h-screen bg-[#F8FAFC] font-outfit pt-24 md:pt-32 pb-40 lg:pb-36 overflow-x-hidden w-full">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-full md:max-w-4xl w-full">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-8 mb-10 md:mb-12 text-center md:text-left w-full">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <label className="cursor-pointer group block">
                                <div className="w-20 h-20 md:w-32 md:h-32 rounded-[1.8rem] md:rounded-[2.5rem] bg-nepal-gold flex items-center justify-center text-white p-1 md:p-1.5 shadow-2xl shadow-nepal-gold/20 overflow-hidden relative">
                                    {avatar ? (
                                        <img src={avatar} alt={name} className="w-full h-full object-cover rounded-[1.8rem] md:rounded-[2.2rem]" />
                                    ) : (
                                        <User size={40} className="text-nepal-navy md:size-[48px]" strokeWidth={1.5} />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera size={20} className="md:size-[24px] text-white" />
                                    </div>
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                            <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-emerald-500 text-white p-1.5 md:p-2 rounded-xl border-4 border-[#F8FAFC] shadow-lg">
                                <ShieldCheck size={14} className="md:size-[16px]" />
                            </div>
                        </motion.div>

                        <div className="space-y-1 md:space-y-2 mt-2 md:mt-6 flex flex-col items-center md:items-start w-full">
                            <h1 className="text-xl sm:text-2xl md:text-5xl font-black text-nepal-navy tracking-tight uppercase truncate max-w-[180px] sm:max-w-none">
                                {name || 'User Profile'}
                            </h1>
                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 px-2">
                                <p className="text-slate-400 font-bold uppercase text-[9px] md:text-xs tracking-widest truncate max-w-[200px] md:max-w-none">{user?.email}</p>
                                <span className="hidden md:block w-1.5 h-1.5 bg-slate-200 rounded-full shrink-0" />
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-nepal-gold/10 rounded-full border border-nepal-gold/5 shrink-0">
                                    <span className="w-1 h-1 bg-nepal-gold rounded-full animate-pulse shrink-0" />
                                    <p className="text-nepal-gold font-black uppercase text-[8px] md:text-[10px] tracking-widest whitespace-nowrap">Active Identity</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
                        {/* Sidebar / Tabs */}
                        <div className="lg:col-span-1 w-full relative z-[20]">
                            <div className="flex lg:flex-col gap-2 md:gap-4 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 w-screen sm:w-full max-w-full">
                                {[
                                    { id: 'personal', icon: <User size={16} className="md:size-[18px]" />, label: 'Profile' },
                                    { id: 'applications', icon: <FileText size={16} className="md:size-[18px]" />, label: 'Applications' },
                                    { id: 'security', icon: <Shield size={16} className="md:size-[18px]" />, label: 'Security' },
                                    { id: 'notifications', icon: <Bell size={16} className="md:size-[18px]" />, label: 'Alerts' },
                                    { id: 'logs', icon: <Key size={16} className="md:size-[18px]" />, label: 'Activity' },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-sm uppercase tracking-widest transition-all shrink-0 lg:w-full border ${activeTab === item.id ? 'bg-nepal-navy text-white shadow-xl shadow-nepal-navy/15 border-nepal-navy' : 'bg-white text-slate-400 hover:bg-slate-50 border-slate-100 shadow-sm'}`}
                                    >
                                        <span className={activeTab === item.id ? 'text-nepal-gold' : 'text-slate-300'}>{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-2 min-h-[500px] w-full min-w-0">
                            <AnimatePresence mode="wait">
                                {activeTab === 'personal' && (
                                    <motion.div
                                        key="personal"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-8 md:p-10 shadow-sm flex flex-col gap-6 md:gap-8 w-full max-w-full overflow-hidden"
                                    >
                                        <div className="flex flex-col md:flex-row gap-5 md:gap-8 w-full">
                                            <div className="space-y-3 md:space-y-4 w-full">
                                                <label className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest ml-1 md:ml-2">Name</label>
                                                <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:border-nepal-gold focus-within:shadow-xl focus-within:shadow-nepal-gold/10 transition-all">
                                                    <div className="pl-4 md:pl-6 text-slate-400"><User size={16} className="md:w-[18px] md:h-[18px]" /></div>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={e => setName(e.target.value)}
                                                        placeholder="Your Full Name"
                                                        className="w-full bg-transparent px-3 md:px-4 py-3 md:py-5 text-nepal-navy font-black text-xs md:text-sm outline-none placeholder:text-slate-200 min-w-0"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:space-y-4 w-full">
                                                <label className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest ml-1 md:ml-2">Phone Number</label>
                                                <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:border-nepal-gold focus-within:shadow-xl focus-within:shadow-nepal-gold/10 transition-all">
                                                    <div className="pl-4 md:pl-6 text-slate-400"><Globe size={16} className="md:w-[18px] md:h-[18px]" /></div>
                                                    <input
                                                        type="text"
                                                        value={phone}
                                                        onChange={e => setPhone(e.target.value)}
                                                        placeholder="+977-XXXXXXXXXX"
                                                        className="w-full bg-transparent px-3 md:px-4 py-3 md:py-5 text-nepal-navy font-black text-xs md:text-sm outline-none placeholder:text-slate-200 min-w-0"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 md:space-y-4 w-full">
                                            <label className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest ml-1 md:ml-2">Home Address</label>
                                            <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:border-nepal-gold focus-within:shadow-xl focus-within:shadow-nepal-gold/10 transition-all">
                                                <div className="pl-4 md:pl-6 text-slate-400"><Mail size={16} className="md:w-[18px] md:h-[18px]" /></div>
                                                <input
                                                    type="text"
                                                    value={address}
                                                    onChange={e => setAddress(e.target.value)}
                                                    placeholder="Primary Residence Address"
                                                    className="w-full bg-transparent px-3 md:px-4 py-3 md:py-5 text-nepal-navy font-black text-xs md:text-sm outline-none placeholder:text-slate-200 min-w-0"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-100">
                                            <div className="flex items-center gap-3 mb-2 md:mb-4">
                                                <Fingerprint className="text-nepal-gold md:size-5" size={18} />
                                                <h3 className="text-[10px] md:text-base font-black text-nepal-navy tracking-tight uppercase">Security Status</h3>
                                            </div>
                                            <p className="text-[9px] sm:text-xs md:text-base text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-4 sm:p-5 md:p-8 rounded-[1.25rem] md:rounded-[2rem] border border-slate-100 italic break-words w-full">
                                                Your account is {user?.authMethod === 'google' ? 'linked with Google' : 'secured'}.
                                                Data is encrypted in the Pathfinder database.
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 pt-4 md:pt-6 w-full">
                                            <div className="flex items-center gap-2">
                                                {showSuccess && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="flex items-center gap-2 text-emerald-500 font-bold text-sm uppercase tracking-widest"
                                                    >
                                                        <CheckCircle size={14} /> Saved!
                                                    </motion.div>
                                                )}
                                            </div>
                                            <button
                                                onClick={handleSave}
                                                disabled={isSaving}
                                                className="group relative h-[50px] md:h-[60px] px-8 md:px-10 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-50 w-full sm:w-auto"
                                            >
                                                <div className="absolute inset-0 bg-nepal-navy" />
                                                <div className="absolute inset-0 bg-[linear-gradient(110deg,#0f172a,45%,#1e293b,55%,#0f172a)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                                <span className="relative z-10 flex items-center justify-center gap-3 text-white font-black text-sm uppercase tracking-widest">
                                                    {isSaving ? (
                                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                                            <Globe size={18} />
                                                        </motion.div>
                                                    ) : (
                                                        <Save size={18} />
                                                    )}
                                                    {isSaving ? 'Saving...' : 'Save'}
                                                </span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'applications' && (
                                    <motion.div
                                        key="applications"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 md:p-10 shadow-sm flex flex-col items-center justify-center text-center space-y-5 md:space-y-8 min-h-[350px] md:min-h-[400px] w-full overflow-hidden"
                                    >
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-nepal-gold/10 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-nepal-gold shrink-0">
                                            <LayoutDashboard size={28} className="md:w-8 md:h-8" />
                                        </div>
                                        <div className="space-y-2 w-full max-w-sm px-2">
                                            <h3 className="text-xl md:text-2xl font-black text-nepal-navy tracking-tight uppercase break-words">Application Status</h3>
                                            <p className="text-slate-500 font-medium text-xs md:text-sm lg:text-base leading-relaxed">
                                                View, track, and manage all your visa applications and required documents from your centralized archive.
                                            </p>
                                        </div>
                                        <Link
                                            href="/my-applications"
                                            className="inline-flex items-center justify-center gap-2 md:gap-3 w-[260px] sm:w-auto overflow-hidden bg-nepal-navy text-white px-4 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[12px] uppercase tracking-widest hover:bg-nepal-gold transition-colors mt-4 shrink-0"
                                        >
                                            <span className="truncate">Go to My Applications</span> <ArrowUpRight size={16} className="shrink-0 md:size-[18px]" />
                                        </Link>
                                    </motion.div>
                                )}

                                {activeTab === 'security' && (
                                    <motion.div
                                        key="security"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-8 md:p-10 shadow-sm space-y-6 md:space-y-8 w-full max-w-full overflow-hidden"
                                    >
                                        <div className="space-y-5 md:space-y-6">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100">
                                                <div className="flex items-center gap-3 md:gap-4 w-full">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/10 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                                                        <ShieldCheck size={20} className="md:size-[24px]" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-sm md:text-base font-black text-nepal-navy uppercase tracking-tight truncate">Extra Login Security</h4>
                                                        <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest truncate">Extra security is on</p>
                                                    </div>
                                                </div>
                                                <div className="w-12 h-6 bg-emerald-500 rounded-full relative p-1 shrink-0 self-start sm:self-auto">
                                                    <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
                                                </div>
                                            </div>

                                            <div className="space-y-3 md:space-y-4">
                                                <h3 className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-1 md:ml-2">Privacy</h3>
                                                <div className="space-y-1">
                                                    <button className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-slate-50 transition-colors rounded-xl md:rounded-2xl group border border-transparent hover:border-slate-100 text-left">
                                                        <div className="flex items-center gap-3 md:gap-4 text-nepal-navy font-bold text-xs md:text-base min-w-0 flex-1">
                                                            <Key size={16} className="text-slate-300 group-hover:text-nepal-gold transition-colors shrink-0 md:size-[18px]" />
                                                            <span className="truncate">Change Account Password</span>
                                                        </div>
                                                        <ArrowLeft size={16} className="text-slate-300 rotate-180 shrink-0" />
                                                    </button>
                                                    <button className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-slate-50 transition-colors rounded-xl md:rounded-2xl group border border-transparent hover:border-slate-100 text-left">
                                                        <div className="flex items-center gap-3 md:gap-4 text-nepal-navy font-bold text-xs md:text-base min-w-0 flex-1">
                                                            <Fingerprint size={16} className="text-slate-300 group-hover:text-nepal-gold transition-colors shrink-0 md:size-[18px]" />
                                                            <span className="truncate">Face ID / Fingerprint Settings</span>
                                                        </div>
                                                        <ArrowLeft size={16} className="text-slate-300 rotate-180 shrink-0" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-5 md:p-8 bg-rose-50 rounded-2xl md:rounded-3xl border border-rose-100">
                                                <h4 className="text-rose-500 text-sm md:text-base font-black uppercase tracking-widest mb-2 md:mb-4">Remove Account</h4>
                                                <p className="text-rose-400/80 text-xs md:text-sm font-bold leading-relaxed mb-4 md:mb-6">
                                                    Deleting your account means you will lose all your application history.
                                                </p>
                                                <button className="w-full sm:w-auto px-5 md:px-6 py-3 bg-rose-500 text-white rounded-xl font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 truncate">
                                                    Remove Account
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'notifications' && (
                                    <motion.div
                                        key="notifications"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-5 sm:p-8 md:p-10 shadow-sm space-y-6 md:space-y-8 w-full max-w-full overflow-hidden"
                                    >
                                        <div className="space-y-4 md:space-y-6">
                                            {[
                                                { title: 'Application Updates', desc: 'Get notified when your visa status changes', active: true },
                                                { title: 'Security Alerts', desc: 'Get notified of new login attempts to your account', active: true },
                                                { title: 'Immigration News', desc: 'Get updates from Nepal Immigration on rules and policies', active: false },
                                                { title: 'Tips & News', desc: 'Get news and tips about this website', active: false },
                                            ].map((n, i) => (
                                                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-6 bg-slate-50/50 rounded-2xl md:rounded-3xl border border-slate-100">
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-sm md:text-base font-black text-nepal-navy uppercase tracking-tight mb-1 truncate">{n.title}</h4>
                                                        <p className="text-xs md:text-sm text-slate-400 font-bold max-w-sm leading-relaxed">{n.desc}</p>
                                                    </div>
                                                    <div className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors shrink-0 self-start sm:self-auto ${n.active ? 'bg-nepal-navy' : 'bg-slate-200'}`}>
                                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${n.active ? 'translate-x-6' : 'translate-x-0'}`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'logs' && (
                                    <motion.div
                                        key="logs"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 md:p-10 shadow-sm space-y-6 md:space-y-8 w-full overflow-hidden"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 md:px-4 pb-4 border-b border-slate-50">
                                                <h3 className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>
                                                <span className="text-[9px] md:text-sm font-black text-emerald-500 uppercase px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 self-start sm:self-auto shrink-0">System Active</span>
                                            </div>

                                            <div className="space-y-2 md:space-y-3">
                                                {[
                                                    { event: 'Login Successful', location: 'Kathmandu, NP', ip: '110.44.113.2', time: 'Today, 10:42 AM' },
                                                    { event: 'Login Successful', location: 'Pokhara, NP', ip: '202.166.205.1', time: 'Yesterday, 08:15 PM' },
                                                    { event: 'Profile Updated', location: 'Cloud', ip: '76.76.21.21', time: 'Nov 24, 2023, 03:22 PM' },
                                                    { event: 'New Device Logged In', location: 'Lalitpur, NP', ip: '103.1.201.55', time: 'Nov 20, 2023, 09:00 AM' },
                                                ].map((log, i) => (
                                                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 rounded-xl group gap-3 md:gap-4 overflow-hidden">
                                                        <div className="flex gap-3 md:gap-4 w-full md:w-auto min-w-0 flex-1">
                                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-lg md:rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-nepal-navy group-hover:text-white transition-all shrink-0">
                                                                <Globe size={16} className="md:size-[18px]" />
                                                            </div>
                                                            <div className="space-y-0.5 md:space-y-1 min-w-0 flex-1">
                                                                <p className="text-xs md:text-sm font-black text-nepal-navy uppercase tracking-tight truncate">{log.event}</p>
                                                                <p className="text-[10px] md:text-sm font-bold text-slate-400 truncate">{log.location} • {log.ip}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[9px] md:text-sm font-black text-slate-300 uppercase tracking-widest shrink-0 self-start md:self-auto">{log.time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </UserAuthGuard >
    );
};

export default ProfilePage;
