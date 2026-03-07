"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Briefcase, Clock, CheckCircle,
    XCircle, ChevronRight, Search, Filter,
    ArrowUpRight, Download, FileText, Calendar,
    AlertCircle, Loader2, RefreshCw, User, MapPin
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
            setLinkError('Connection failed');
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
            case 'awaiting payment':
                return 'bg-amber-50 text-amber-600 border-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.1)] animate-pulse';
            default:
                return 'bg-slate-50 text-slate-400 border-slate-100';
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
            case 'awaiting payment':
                return <RefreshCw size={size} className="animate-spin-slow" />;
            default:
                return <Clock size={size} />;
        }
    };

    return (
        <UserAuthGuard>
            <div className="min-h-screen bg-[#FDFEFE] font-outfit pt-24 pb-36 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nepal-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-nepal-navy/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-6 lg:px-12 max-w-[1536px] relative z-10">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-[2.5px] bg-nepal-gold" />
                                <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.6em] text-nepal-gold">Profile Archive</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-nepal-navy tracking-tighter uppercase leading-[0.9]">
                                My <span className="text-nepal-gold italic">Applications</span>
                            </h1>
                            <p className="mt-4 md:mt-6 text-slate-400 font-bold text-[9px] lg:text-[11px] uppercase tracking-[0.3em] flex items-center gap-3">
                                <span className="w-6 h-6 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                    <LayoutDashboard size={12} className="text-nepal-gold" strokeWidth={3} />
                                </span>
                                Centralized Application Registry
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 bg-white/40 backdrop-blur-xl p-2 lg:p-2.5 rounded-[2rem] border border-white/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)] w-full md:w-auto"
                        >
                            <div className="flex items-center justify-around sm:justify-start gap-4 sm:gap-8 px-4 sm:px-8 py-3 sm:py-4">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1">Total Apps</p>
                                    <p className="text-2xl sm:text-3xl font-black text-nepal-navy leading-none tabular-nums">{applications.length}</p>
                                </div>
                                <div className="w-[1px] h-6 bg-slate-100" />
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1">Verified</p>
                                    <p className="text-2xl sm:text-3xl font-black text-emerald-500 leading-none tabular-nums">{applications.filter(a => a.status === 'Approved').length}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsLinking(true)}
                                className="bg-nepal-navy text-white px-6 sm:px-8 py-4 rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-nepal-gold hover:text-nepal-navy transition-all flex items-center justify-center gap-3 shadow-xl shadow-nepal-navy/10 group w-full sm:w-auto"
                            >
                                <RefreshCw size={14} className="sm:size-4 group-hover:rotate-180 transition-transform duration-700" />
                                Sync Record
                            </button>
                        </motion.div>
                    </div>

                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-8">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-slate-50 border-t-nepal-gold rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Briefcase size={28} className="text-nepal-navy animate-pulse" />
                                </div>
                            </div>
                            <p className="font-black text-xs uppercase tracking-[0.6em] text-nepal-navy animate-pulse">Syncing Applications...</p>
                        </div>
                    ) : applications.length > 0 ? (
                        <div className="space-y-10">
                            {applications.map((app, idx) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    className="group relative"
                                >
                                    {/* Main Card */}
                                    <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-100 p-6 sm:p-8 lg:p-12 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.02)] hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.05)] transition-all duration-700 relative overflow-hidden w-full max-w-full">
                                        {/* Status Glow Indicator */}
                                        <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[100px] opacity-10 transition-opacity duration-1000 group-hover:opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/4 ${app.status.toLowerCase() === 'approved' ? 'bg-emerald-400' : 'bg-nepal-gold'}`} />

                                        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8 sm:gap-12 w-full">
                                            {/* Left Info: ID & User */}
                                            <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 w-full xl:w-auto">
                                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-50 border border-slate-100 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-nepal-navy group-hover:bg-nepal-navy group-hover:text-white group-hover:scale-105 transition-all duration-700 shrink-0">
                                                    <Briefcase size={32} className="sm:size-[40px]" strokeWidth={1.5} />
                                                </div>
                                                <div className="space-y-3 w-full min-w-0">
                                                    <div className="flex flex-wrap items-center gap-4">
                                                        <span className="text-[10px] font-black text-nepal-gold bg-nepal-gold/5 px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-nepal-gold/10">{app.visaLabel}</span>
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                                                            <Calendar size={12} />
                                                            {new Date(app.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-3xl lg:text-5xl font-black text-nepal-navy tracking-tighter uppercase leading-none truncate">{app.refId}</h3>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm font-bold text-slate-400 tracking-wide uppercase">
                                                        <div className="flex items-center gap-3">
                                                            <User size={16} className="text-nepal-gold" strokeWidth={2.5} />
                                                            <span className="text-nepal-navy">{app.fullName}</span>
                                                        </div>
                                                        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                        <div className="flex items-center gap-3">
                                                            <MapPin size={16} className="text-nepal-gold" strokeWidth={2.5} />
                                                            <span>{app.nationality}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Interaction: Status & Actions */}
                                            <div className="flex flex-col items-start xl:items-center xl:flex-row gap-6 lg:justify-end w-full xl:w-auto">
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto">
                                                    <div className={`flex items-center justify-center sm:justify-start gap-3 sm:gap-4 px-6 sm:px-8 py-3.5 rounded-[1.25rem] sm:rounded-[1.5rem] border text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] ${getStatusStyles(app.status)} shadow-sm whitespace-nowrap`}>
                                                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-current"></span>
                                                        </span>
                                                        {app.status}
                                                    </div>
                                                    {app.documents && Object.keys(app.documents).length > 0 && (
                                                        <div className="flex items-center justify-center sm:justify-start gap-3 px-6 py-3.5 bg-slate-50 text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] border border-slate-100 rounded-[1.25rem] sm:rounded-[1.5rem] whitespace-nowrap">
                                                            <FileText size={16} className="sm:size-[18px] shrink-0" strokeWidth={2} />
                                                            {Object.keys(app.documents).length} Uploaded Files
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-row items-center gap-3 sm:gap-4 w-full xl:w-auto">
                                                    <button className="shrink-0 w-[52px] h-[52px] sm:w-16 sm:h-16 bg-white border border-slate-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-300 hover:text-nepal-navy hover:border-nepal-navy hover:shadow-xl transition-all duration-700">
                                                        <Download size={20} className="sm:size-[24px]" />
                                                    </button>
                                                    {(app.status.toLowerCase() === 'awaiting payment' || (app.status.toLowerCase() === 'approved' && app.paymentStatus !== 'Paid')) ? (
                                                        <Link href={`/payment?ref=${app.refId}`} className="flex-1 xl:flex-none flex items-center justify-center gap-2 sm:gap-6 bg-emerald-500 text-nepal-navy px-4 sm:pl-8 sm:pr-6 h-[52px] sm:h-16 rounded-[1.25rem] sm:rounded-[1.5rem] font-black text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:bg-emerald-400 hover:shadow-2xl transition-all duration-700 active:scale-[0.98] group/pay shadow-lg shadow-emerald-500/20 text-center min-w-0">
                                                            <span className="truncate">Pay Visa</span>
                                                            <ArrowUpRight size={16} className="sm:size-[20px] shrink-0 group-hover/pay:translate-x-1 group-hover/pay:-translate-y-1 transition-transform duration-500" />
                                                        </Link>
                                                    ) : ((app.rejectedDocuments && app.rejectedDocuments.length > 0) || app.adminFeedback) ? (
                                                        <Link href={`/apply?step=3&ref=${app.refId}`} className="flex-1 xl:flex-none flex items-center justify-center gap-2 sm:gap-6 bg-red-500 text-white px-4 sm:pl-8 sm:pr-6 h-[52px] sm:h-16 rounded-[1.25rem] sm:rounded-[1.5rem] font-black text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:bg-nepal-navy hover:shadow-2xl transition-all duration-700 active:scale-[0.98] group/open shadow-lg shadow-red-500/20 text-center min-w-0">
                                                            <span className="truncate">Fix Issues</span>
                                                            <RefreshCw size={16} className="sm:size-[20px] shrink-0 group-hover/open:rotate-180 transition-transform duration-1000" />
                                                        </Link>
                                                    ) : (
                                                        <Link href={`/track?ref=${app.refId}`} className="flex-1 xl:flex-none flex items-center justify-center gap-2 sm:gap-6 bg-nepal-navy text-white px-4 sm:pl-8 sm:pr-6 h-[52px] sm:h-16 rounded-[1.25rem] sm:rounded-[1.5rem] font-black text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:bg-nepal-gold hover:text-nepal-navy transition-all duration-700 active:scale-[0.98] group/open shadow-xl shadow-nepal-navy/10 text-center min-w-0">
                                                            <span className="truncate">View App</span>
                                                            <ChevronRight size={16} className="sm:size-[20px] shrink-0 group-hover/open:translate-x-2 transition-transform duration-500" />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Required Alert Section - Balanced Height */}
                                        {((app.rejectedDocuments && app.rejectedDocuments.length > 0) || app.adminFeedback) && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                transition={{ delay: 0.5, duration: 1.2 }}
                                                className="mt-12 pt-12 border-t-2 border-slate-50"
                                            >
                                                <div className="relative group/alert">
                                                    <div className="absolute -inset-2 bg-red-500/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover/alert:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                                                    <div className="relative bg-rose-50/15 backdrop-blur-xl rounded-[2rem] border border-rose-100/30 p-6 sm:p-10 lg:p-12 w-full max-w-full overflow-hidden">
                                                        {/* Section Header */}
                                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-10">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-16 h-16 bg-red-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg ring-8 ring-red-500/10">
                                                                    <AlertCircle size={32} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500/60 mb-1.5">Action Mandatory</p>
                                                                    <h4 className="text-2xl lg:text-3xl font-black text-nepal-navy uppercase tracking-tighter">Action Required</h4>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col-reverse xl:flex-row gap-8 sm:gap-12 items-stretch">
                                                            {/* Detailed Message */}
                                                            {app.adminFeedback && (
                                                                <div className="flex-1 xl:w-2/3 space-y-5">
                                                                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-l-4 border-red-500 pl-4">Admin Feedback</h5>
                                                                    <div className="bg-white/95 p-6 sm:p-10 rounded-[2rem] border border-white shadow-xl shadow-red-900/5 relative group/msg overflow-hidden min-h-[180px] flex flex-col justify-center">
                                                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500 transition-all duration-500 group-hover/msg:w-2" />
                                                                        <div className="absolute top-6 left-6 text-6xl text-rose-500/10 font-serif leading-none italic pointer-events-none">"</div>
                                                                        <p className="text-lg sm:text-2xl font-bold text-nepal-navy leading-relaxed relative z-10 pl-4 italic">
                                                                            {app.adminFeedback}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Documentation */}
                                                            {app.rejectedDocuments && app.rejectedDocuments.length > 0 && (
                                                                <div className={`space-y-5 ${app.adminFeedback ? 'w-full xl:w-1/3 shrink-0' : 'w-full'}`}>
                                                                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-l-4 border-red-500 pl-4">Missing Documents</h5>
                                                                    <div className="flex flex-col gap-4">
                                                                        {app.rejectedDocuments.map((doc: string, i: number) => (
                                                                            <motion.div
                                                                                key={doc + i}
                                                                                whileHover={{ x: 10 }}
                                                                                className="flex items-center justify-between gap-4 sm:gap-6 px-6 sm:px-8 py-4 sm:py-5 bg-white/70 border border-rose-100 rounded-[1.25rem] sm:rounded-[1.5rem] text-rose-500 shadow-sm group/doc hover:bg-white hover:shadow-xl transition-all duration-500"
                                                                            >
                                                                                <div className="flex items-center gap-4 sm:gap-6 text-left">
                                                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-500/10 rounded-xl flex items-center justify-center shrink-0">
                                                                                        <XCircle size={18} className="sm:size-[20px]" strokeWidth={3} />
                                                                                    </div>
                                                                                    <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em]">{doc}</span>
                                                                                </div>
                                                                                <ArrowUpRight size={16} className="sm:size-[18px] opacity-0 group-hover/doc:opacity-100 transition-opacity shrink-0" />
                                                                            </motion.div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[5rem] border border-dashed border-slate-200 p-28 text-center shadow-[0_100px_200px_-50px_rgba(0,0,0,0.02)]"
                        >
                            <div className="w-32 h-32 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-center mx-auto mb-12 text-slate-200 shadow-[inset_0_2px_15px_rgba(0,0,0,0.03)]">
                                <FileText size={64} strokeWidth={1} />
                            </div>
                            <h3 className="text-4xl lg:text-5xl font-black text-nepal-navy mb-6 uppercase tracking-tighter">No Linked Applications</h3>
                            <p className="text-slate-400 text-xl font-medium mb-16 max-w-2xl mx-auto leading-relaxed italic">Your current profile is not associated with any active applications in our system.</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                                <Link href="/apply" className="w-full sm:w-auto inline-flex items-center justify-center gap-6 bg-nepal-navy text-white px-12 h-20 rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] hover:bg-nepal-gold hover:text-nepal-navy transition-all shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3)] active:scale-95">
                                    Initiate Process
                                    <ArrowUpRight size={24} />
                                </Link>
                                <button
                                    onClick={() => setIsLinking(true)}
                                    className="w-full sm:w-auto px-12 h-20 rounded-[2rem] border-2 border-slate-100 text-slate-300 font-black text-sm uppercase tracking-[0.4em] hover:border-nepal-gold hover:text-nepal-gold transition-all duration-500"
                                >
                                    Link Existing ID
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isLinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsLinking(false)}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-nepal-navy/20 backdrop-blur-sm cursor-pointer"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl relative overflow-hidden cursor-default"
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
                                <h3 className="text-2xl font-black text-nepal-navy uppercase tracking-tight">Add Old Visa</h3>
                                <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Add a visa you started already</p>
                            </div>

                            <div className="space-y-5 mb-10">
                                <div className="space-y-2">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Visa ID</p>
                                    <input
                                        type="text"
                                        placeholder="NV-XXXXXX"
                                        value={linkRef}
                                        onChange={(e) => setLinkRef(e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-xl px-6 py-4 text-sm font-black text-nepal-navy uppercase tracking-[0.2em] outline-none focus:border-nepal-gold focus:shadow-xl focus:shadow-nepal-gold/15 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Passport ID</p>
                                    <input
                                        type="text"
                                        placeholder="PROTOCOL ID"
                                        value={linkPassport}
                                        onChange={(e) => setLinkPassport(e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-xl px-6 py-4 text-sm font-black text-nepal-navy uppercase tracking-[0.2em] outline-none focus:border-nepal-gold focus:shadow-xl focus:shadow-nepal-gold/15 transition-all"
                                    />
                                </div>
                            </div>

                            {linkError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-500 text-sm font-black uppercase tracking-widest"
                                >
                                    <AlertCircle size={16} className="shrink-0" />
                                    {linkError}
                                </motion.div>
                            )}

                            {linkSuccess ? (
                                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-sm font-black uppercase tracking-widest text-center">
                                    Added
                                </div>
                            ) : (
                                <button
                                    onClick={handleLink}
                                    disabled={!linkRef || !linkPassport || loading}
                                    className="w-full bg-nepal-gold text-nepal-navy py-5 rounded-xl font-black text-base uppercase tracking-[0.2em] hover:bg-yellow-400 transition-all shadow-xl shadow-nepal-gold/10 disabled:opacity-50"
                                >
                                    Add Visa
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
