"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Shield, Bell, Key,
    Globe, Camera, Save, ArrowLeft,
    CheckCircle, ShieldCheck, Fingerprint
} from 'lucide-react';
import { UserAuthGuard } from '@/components/UserAuthGuard';
import Image from 'next/image';

const ProfilePage = () => {
    const [user, setUser] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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

    if (!user) return null;

    return (
        <UserAuthGuard>
            <main className="min-h-screen bg-[#F8FAFC] font-outfit pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="flex items-center gap-6 mb-12">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <label className="cursor-pointer group block">
                                <div className="w-24 h-24 rounded-[2rem] bg-nepal-gold flex items-center justify-center text-white p-1 shadow-2xl shadow-nepal-gold/20 overflow-hidden relative">
                                    {avatar ? (
                                        <img src={avatar} alt={name} className="w-full h-full object-cover rounded-[1.8rem]" />
                                    ) : (
                                        <User size={40} className="text-nepal-navy" strokeWidth={1.5} />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-[#F8FAFC] shadow-lg">
                                <ShieldCheck size={14} />
                            </div>
                        </motion.div>

                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-nepal-navy tracking-tight uppercase truncate">{name || 'Portal User'}</h1>
                            <div className="flex items-center gap-2">
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{user.email}</p>
                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                <p className="text-nepal-gold font-black uppercase text-[10px] tracking-widest">Verified Resident</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                            {[
                                { icon: <User size={18} />, label: 'Personal Information', active: true },
                                { icon: <Shield size={18} />, label: 'Security & Privacy', active: false },
                                { icon: <Bell size={18} />, label: 'Notifications', active: false },
                                { icon: <Key size={18} />, label: 'Authentication Log', active: false },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${item.active ? 'bg-nepal-navy text-white shadow-xl shadow-nepal-navy/10' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-10 shadow-sm space-y-8"
                            >
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Display Identifier</label>
                                        <div className="relative flex items-center bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-nepal-gold/20 transition-all">
                                            <div className="pl-6 text-slate-300"><User size={18} /></div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                placeholder="Your Full Name"
                                                className="w-full bg-transparent px-4 py-5 text-nepal-navy font-black text-sm outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secure Contact</label>
                                        <div className="relative flex items-center bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-nepal-gold/20 transition-all">
                                            <div className="pl-6 text-slate-300"><Globe size={18} /></div>
                                            <input
                                                type="text"
                                                value={phone}
                                                onChange={e => setPhone(e.target.value)}
                                                placeholder="+977-XXXXXXXXXX"
                                                className="w-full bg-transparent px-4 py-5 text-nepal-navy font-black text-sm outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Residential Nexus</label>
                                    <div className="relative flex items-center bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-nepal-gold/20 transition-all">
                                        <div className="pl-6 text-slate-300"><Mail size={18} /></div>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            placeholder="Primary Residence Address"
                                            className="w-full bg-transparent px-4 py-5 text-nepal-navy font-black text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Fingerprint className="text-nepal-gold" size={20} />
                                        <h3 className="text-sm font-black text-nepal-navy tracking-tight uppercase">Registry Verification</h3>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                                        Your account is authenticated via {user.authMethod === 'google' ? 'Google Cloud IAM' : 'Secure Local Registry'}.
                                        Critical data is encrypted using AES-256-GCM protocols.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-6">
                                    <div className="flex items-center gap-2">
                                        {showSuccess && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest"
                                            >
                                                <CheckCircle size={14} /> Records Updated Successfully
                                            </motion.div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="group relative h-[60px] px-10 rounded-2xl overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-nepal-navy" />
                                        <div className="absolute inset-0 bg-[linear-gradient(110deg,#0f172a,45%,#1e293b,55%,#0f172a)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        <span className="relative z-10 flex items-center justify-center gap-3 text-white font-black text-[10px] uppercase tracking-widest">
                                            {isSaving ? (
                                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                                    <Globe size={18} />
                                                </motion.div>
                                            ) : (
                                                <Save size={18} />
                                            )}
                                            {isSaving ? 'Syncing...' : 'Update Settings'}
                                        </span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </UserAuthGuard>
    );
};

export default ProfilePage;
