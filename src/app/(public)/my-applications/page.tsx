"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Briefcase, Clock, CheckCircle,
    XCircle, ChevronRight, Search, Filter,
    ArrowUpRight, Download, FileText, Calendar,
    AlertCircle, Loader2, RefreshCw
} from 'lucide-react';
import { UserAuthGuard } from '@/components/UserAuthGuard';
import Image from 'next/image';
import Link from 'next/link';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Linking states
    const [isLinking, setIsLinking] = useState(false);
    const [linkRef, setLinkRef] = useState('');
    const [linkPassport, setLinkPassport] = useState('');
    const [linkError, setLinkError] = useState('');
    const [linkSuccess, setLinkSuccess] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem('pf_user_session');
        if (session) {
            const userData = JSON.parse(session);
            setUser(userData);
            fetchApplications(userData.email);
        }
    }, []);

    const fetchApplications = async (email: string) => {
        try {
            const res = await fetch('/api/applications');
            const data = await res.json();
            if (data.success) {
                const userApps = data.data.filter((app: any) => app.email === email);
                setApplications(userApps);
            }
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLink = async () => {
        if (!linkRef || !linkPassport) return;
        setLoading(true);
        setLinkError('');
        try {
            const res = await fetch('/api/applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refId: linkRef,
                    passportNumber: linkPassport,
                    linkEmail: user?.email
                })
            });
            const data = await res.json();
            if (data.success) {
                setLinkSuccess(true);
                fetchApplications(user?.email);
                setTimeout(() => {
                    setIsLinking(false);
                    setLinkSuccess(false);
                    setLinkRef('');
                    setLinkPassport('');
                }, 2000);
            } else {
                setLinkError(data.error || 'Failed to link application');
            }
        } catch (err) {
            setLinkError('Connection protocols failed');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'rejected':
                return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'under review':
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'in progress':
                return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            default:
                return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    const getStatusIcon = (status: string) => {
        const size = 13;
        switch (status.toLowerCase()) {
            case 'approved':
                return <CheckCircle size={size} />;
            case 'rejected':
                return <XCircle size={size} />;
            case 'in progress':
            case 'under review':
                return <Clock size={size} />;
            default:
                return <Clock size={size} />;
        }
    };

    return (
        <UserAuthGuard>
            <main className="min-h-screen bg-[#F8FAFC] font-outfit pt-28 pb-24">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-2xl font-black text-nepal-navy tracking-tight uppercase mb-1">
                                Application <span className="text-nepal-gold">Records</span>
                            </h1>
                            <p className="text-slate-400 font-medium text-[12px] uppercase tracking-widest">Linked Immigration Profiles</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-8"
                        >
                            <div className="flex items-center gap-5 bg-white px-6 py-4 rounded-xl border border-slate-100 shadow-sm">
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Active</p>
                                    <p className="text-base font-black text-nepal-navy leading-none">{applications.length}</p>
                                </div>
                                <div className="w-[1px] h-5 bg-slate-100" />
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Cleared</p>
                                    <p className="text-base font-black text-emerald-500 leading-none">{applications.filter(a => a.status === 'Approved').length}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {loading ? (
                        <div className="h-48 flex flex-col items-center justify-center gap-4 text-slate-300">
                            <Loader2 className="animate-spin text-nepal-gold" size={24} />
                            <p className="font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse">Scanning...</p>
                        </div>
                    ) : applications.length > 0 ? (
                        <div className="space-y-6">
                            {applications.map((app, idx) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-sm hover:shadow-md transition-all group relative"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-nepal-navy group-hover:bg-nepal-navy group-hover:text-white transition-all shrink-0">
                                                <Briefcase size={22} strokeWidth={1.5} />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-[9px] font-black text-nepal-gold uppercase tracking-widest">{app.visaLabel}</span>
                                                    <div className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{new Date(app.submittedAt).toLocaleDateString()}</span>
                                                </div>
                                                <h3 className="text-lg lg:text-xl font-black text-nepal-navy tracking-tight uppercase leading-tight">{app.refId}</h3>
                                                <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                                                    <span>{app.fullName}</span>
                                                    <span className="text-slate-200">|</span>
                                                    <span>{app.nationality}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between lg:justify-end gap-8 flex-1">
                                            <div className="flex items-center gap-4">
                                                <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(app.status)}`}>
                                                    {getStatusIcon(app.status)}
                                                    {app.status}
                                                </div>
                                                {app.documents && Object.keys(app.documents).length > 0 && (
                                                    <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-50 rounded-xl">
                                                        <FileText size={14} />
                                                        {Object.keys(app.documents).length} Assets
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-nepal-navy hover:bg-white hover:border-nepal-navy transition-all group/dl">
                                                    <Download size={18} />
                                                </button>
                                                <Link href="/apply" className="flex items-center gap-3 bg-nepal-navy text-white px-7 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-nepal-gold hover:text-nepal-navy transition-all active:scale-95 group/open">
                                                    Open
                                                    <ChevronRight size={14} className="group-hover/open:translate-x-0.5 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alert Notification - Properly Scaled */}
                                    {((app.rejectedDocuments && app.rejectedDocuments.length > 0) || app.adminFeedback) && (
                                        <div className="mt-6 border-t border-slate-50 pt-6">
                                            <div className="bg-red-50/30 rounded-2xl p-6 lg:p-7 border border-red-50 relative overflow-hidden">
                                                <div className="relative z-10 space-y-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-md shrink-0">
                                                                <AlertCircle size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-red-400 mb-0.5">Attention Profile Required</p>
                                                                <h4 className="text-[12px] lg:text-[13px] font-black text-nepal-navy uppercase tracking-tight">Security Protocol Update Required</h4>
                                                            </div>
                                                        </div>
                                                        <Link href="/apply" className="bg-red-500 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-nepal-navy transition-all flex items-center gap-3 shadow-lg shadow-red-500/10">
                                                            Fix Record
                                                            <RefreshCw size={12} />
                                                        </Link>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-8 bg-white/40 p-5 rounded-xl border border-white/50">
                                                        {app.adminFeedback && (
                                                            <div className="space-y-3">
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Officer Note</p>
                                                                <p className="text-[13px] font-bold text-nepal-navy italic opacity-85 leading-relaxed">
                                                                    "{app.adminFeedback}"
                                                                </p>
                                                            </div>
                                                        )}
                                                        {app.rejectedDocuments && app.rejectedDocuments.length > 0 && (
                                                            <div className="space-y-3">
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Required Items</p>
                                                                <div className="flex flex-wrap gap-2.5">
                                                                    {app.rejectedDocuments.map((doc: string, i: number) => (
                                                                        <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-rose-500 shadow-sm">
                                                                            <XCircle size={12} />
                                                                            <span className="text-[9px] font-black uppercase tracking-widest">{doc}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center"
                        >
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-lg font-black text-nepal-navy mb-2 uppercase tracking-tight">No Records Found</h3>
                            <p className="text-slate-400 text-[12px] font-medium mb-10">System scanned 0 active records linked to this account.</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/apply" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-nepal-navy text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-nepal-gold hover:text-nepal-navy transition-all shadow-lg">
                                    Initiate Profile
                                    <ArrowUpRight size={16} />
                                </Link>
                                <button
                                    onClick={() => setIsLinking(true)}
                                    className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:border-nepal-gold hover:text-nepal-gold transition-all"
                                >
                                    Link Reference
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            <AnimatePresence>
                {isLinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-nepal-navy/20 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl relative overflow-hidden"
                        >
                            <button
                                onClick={() => setIsLinking(false)}
                                className="absolute top-8 right-8 text-slate-300 hover:text-nepal-navy transition-colors"
                            >
                                <XCircle size={28} />
                            </button>

                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-nepal-gold shadow-inner">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-nepal-navy uppercase tracking-tight">Connect Protocol</h3>
                                <p className="text-slate-400 text-[11px] font-medium uppercase tracking-[0.2em]">Secure existing record linkage</p>
                            </div>

                            <div className="space-y-5 mb-10">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Number</p>
                                    <input
                                        type="text"
                                        placeholder="NV-XXXXXX"
                                        value={linkRef}
                                        onChange={(e) => setLinkRef(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 text-xs font-black text-nepal-navy uppercase tracking-[0.2em] outline-none focus:border-nepal-gold focus:bg-white transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Passport Protocol ID</p>
                                    <input
                                        type="text"
                                        placeholder="PROTOCOL ID"
                                        value={linkPassport}
                                        onChange={(e) => setLinkPassport(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 text-xs font-black text-nepal-navy uppercase tracking-[0.2em] outline-none focus:border-nepal-gold focus:bg-white transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            {linkError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-500 text-[10px] font-black uppercase tracking-widest"
                                >
                                    <AlertCircle size={16} className="shrink-0" />
                                    {linkError}
                                </motion.div>
                            )}

                            {linkSuccess ? (
                                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-[11px] font-black uppercase tracking-widest text-center">
                                    Link Authorized & Secured
                                </div>
                            ) : (
                                <button
                                    onClick={handleLink}
                                    disabled={!linkRef || !linkPassport || loading}
                                    className="w-full bg-nepal-gold text-nepal-navy py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-yellow-400 transition-all shadow-xl shadow-nepal-gold/10 disabled:opacity-50"
                                >
                                    Verify Connection
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </UserAuthGuard>
    );
};

export default MyApplicationsPage;
