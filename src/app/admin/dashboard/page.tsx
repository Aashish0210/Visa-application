"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, FileText, MessageSquare, Settings,
    LogOut, Search, ChevronRight, CheckCircle, Clock,
    XCircle, Eye, EyeOff, Download, RefreshCw, ShieldCheck,
    Mail, Calendar, Hash, Phone, User, Camera, Lock, AlertTriangle,
    Star, Database, Inbox, AlertCircle, Shield,
} from 'lucide-react';

const SESSION_KEY = 'pf_admin_session';

/* ─── Types ─── */
interface Application {
    id: string; refId: string; fullName: string; email: string;
    passportNumber: string; nationality: string; visaLabel: string;
    status: string; duration: string; address: string; submittedAt: string;
    documents?: Record<string, string>;
    rejectedDocuments?: string[];
    adminFeedback?: string;
    isNewUpdate?: boolean;
    recentlyUpdatedDocs?: string[];
}
interface Contact {
    id: string; name: string; email: string; department: string;
    message: string; status: string; priority: string; submittedAt: string;
}

/* ─── Status Badge ─── */
const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, string> = {
        Approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
        Pending: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
        'Under Review': 'bg-blue-500/15 text-blue-300 border-blue-500/25',
        'In Progress': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
        Rejected: 'bg-red-500/15 text-red-300 border-red-500/25',
        Unread: 'bg-nepal-gold/15 text-nepal-gold border-nepal-gold/25',
        Read: 'bg-white/5 text-white/50 border-white/15',
        Replied: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
        High: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
        Urgent: 'bg-red-500/15 text-red-300 border-red-500/25',
    };
    return (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide border ${map[status] ?? 'bg-white/5 text-white/40 border-white/10'}`}>
            {status}
        </span>
    );
};

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/* ─── Empty State ─── */
const EmptyState = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => (
    <div className="flex flex-col items-center justify-center py-24 text-center px-8">
        <div className="w-20 h-20 bg-white/[0.04] border border-white/[0.08] rounded-3xl flex items-center justify-center mb-6">
            <Icon size={36} className="text-white/20" />
        </div>
        <p className="text-white/50 font-black text-xl tracking-tight mb-3">{title}</p>
        <p className="text-white/25 font-medium text-base max-w-sm leading-relaxed">{subtitle}</p>
    </div>
);

/* ─── Schema Card ─── */
const SchemaCard = ({ title, fields }: { title: string; fields: { name: string; type: string; required?: boolean; example: string }[] }) => (
    <div className="bg-[#0D1626] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05] flex items-center gap-3">
            <Database size={16} className="text-nepal-gold" />
            <h4 className="font-black text-white text-base tracking-tight">{title}</h4>
            <span className="ml-auto text-xs font-black uppercase tracking-widest text-white/25">Schema</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
            {fields.map((f, i) => (
                <div key={i} className="px-6 py-3.5 flex items-center gap-5">
                    <div className="w-48 shrink-0 flex items-center gap-2">
                        <span className="text-sm font-black text-nepal-gold font-mono">{f.name}</span>
                        {f.required && <span className="text-[10px] text-red-400 font-black uppercase bg-red-500/10 px-1.5 py-0.5 rounded">req</span>}
                    </div>
                    <span className="text-sm text-blue-400 font-mono w-24 shrink-0">{f.type}</span>
                    <span className="text-sm text-white/30 font-mono truncate">{f.example}</span>
                </div>
            ))}
        </div>
    </div>
);

/* ─── Nav ─── */
const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'applications', icon: FileText, label: 'Applications' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'queries', icon: MessageSquare, label: 'Queries' },
    { id: 'database', icon: Database, label: 'Database Guide' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [session, setSession] = useState<any>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loadingApps, setLoadingApps] = useState(true);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [replyText, setReplyText] = useState('');

    /* ─── Settings state ─── */
    const [profilePhoto, setProfilePhoto] = useState<string>('');
    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    const [profileBio, setProfileBio] = useState('');
    const [profileSaved, setProfileSaved] = useState(false);

    const [curPwd, setCurPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [showCurPwd, setShowCurPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);
    const [pwdError, setPwdError] = useState('');
    const [pwdSuccess, setPwdSuccess] = useState(false);

    const photoInputRef = useRef<HTMLInputElement>(null);

    const hasLoadedProfile = useRef(false);

    /* Load profile from localStorage exactly once, after first session load */
    useEffect(() => {
        if (!session || hasLoadedProfile.current) return;
        hasLoadedProfile.current = true;
        const saved = localStorage.getItem('pf_admin_profile');
        if (saved) {
            const p = JSON.parse(saved);
            setProfilePhoto(p.photo ?? '');
            setProfileName(p.name ?? session.user ?? '');
            setProfileEmail(p.email ?? session.email ?? '');
            setProfilePhone(p.phone ?? '');
            setProfileBio(p.bio ?? '');
        } else {
            setProfileName(session.user ?? '');
            setProfileEmail(session.email ?? '');
        }
    }, [session]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => setProfilePhoto(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleProfileSave = () => {
        const profile = { photo: profilePhoto, name: profileName, email: profileEmail, phone: profilePhone, bio: profileBio };
        localStorage.setItem('pf_admin_profile', JSON.stringify(profile));

        // Update persistent credentials
        const creds = JSON.parse(localStorage.getItem('pf_admin_credentials') || '{}');
        localStorage.setItem('pf_admin_credentials', JSON.stringify({ ...creds, email: profileEmail }));

        const updated = { ...session, user: profileName, email: profileEmail };
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
        setSession(updated);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
    };

    const pwdStrengthScore = (pwd: string) => {
        let s = 0;
        if (pwd.length >= 8) s++;
        if (pwd.length >= 12) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[0-9]/.test(pwd)) s++;
        if (/[^A-Za-z0-9]/.test(pwd)) s++;
        return s;
    };

    const handlePwdChange = () => {
        setPwdError(''); setPwdSuccess(false);

        // Check persistent credentials first, then fallback to session, then default
        const creds = JSON.parse(localStorage.getItem('pf_admin_credentials') || '{}');
        const storedPwd = creds.password || session.password || 'Nepal@Secure2026';

        if (curPwd !== storedPwd) { setPwdError('Current password is incorrect.'); return; }
        if (newPwd.length < 8) { setPwdError('New password must be at least 8 characters.'); return; }
        if (newPwd !== confirmPwd) { setPwdError('Passwords do not match.'); return; }

        // Update persistent credentials
        localStorage.setItem('pf_admin_credentials', JSON.stringify({ ...creds, password: newPwd }));

        const updated = { ...session, password: newPwd };
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
        setSession(updated);
        setCurPwd(''); setNewPwd(''); setConfirmPwd('');
        setPwdSuccess(true);
        setTimeout(() => setPwdSuccess(false), 4000);
    };

    const strength = pwdStrengthScore(newPwd);
    const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][strength];
    const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-400'][strength];

    useEffect(() => {
        const raw = typeof window !== 'undefined' ? localStorage.getItem(SESSION_KEY) : null;
        if (!raw) { router.replace('/admin/login'); return; }
        setSession(JSON.parse(raw));
    }, [router]);

    const fetchApplications = useCallback(async () => {
        setLoadingApps(true);
        try {
            const res = await fetch('/api/applications');
            const data = await res.json();
            setApplications(data.data ?? []);
        } catch { setApplications([]); }
        finally { setLoadingApps(false); }
    }, []);

    const fetchContacts = useCallback(async () => {
        setLoadingContacts(true);
        try {
            const res = await fetch('/api/contacts');
            const data = await res.json();
            setContacts(data.data ?? []);
        } catch { setContacts([]); }
        finally { setLoadingContacts(false); }
    }, []);

    const updateApplicationStatus = async (refId: string, newStatus: string) => {
        try {
            const res = await fetch('/api/applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refId, status: newStatus, rejectedDocuments: selectedItem?.rejectedDocuments }),
            });
            const data = await res.json();
            if (data.success) {
                // Update local state
                setApplications(prev => prev.map(app =>
                    app.refId === refId ? { ...app, status: newStatus } : app
                ));
                // Update selected item if it's the one being modified
                if (selectedItem?.refId === refId) {
                    setSelectedItem((prev: any) => ({ ...prev, status: newStatus }));
                }
            } else {
                alert(data.error || 'Failed to update status');
            }
        } catch (err) {
            console.error('[updateStatus]', err);
            alert('An error occurred while updating status.');
        }
    };

    const updateQuery = async (id: string, updates: any) => {
        try {
            const res = await fetch('/api/contacts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates }),
            });
            const data = await res.json();
            if (data.success) {
                setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates, status: updates.reply ? 'Replied' : c.status } : c));
                if (selectedItem?.id === id) {
                    setSelectedItem((prev: any) => ({ ...prev, ...updates, status: updates.reply ? 'Replied' : prev.status }));
                }
                if (updates.reply) {
                    setReplyText('');
                    alert('Reply sent successfully.');
                }
            } else {
                alert(data.error || 'Failed to update query');
            }
        } catch (err) {
            console.error('[updateQuery]', err);
            alert('An error occurred.');
        }
    };

    useEffect(() => {
        if (session) { fetchApplications(); fetchContacts(); }
    }, [session, fetchApplications, fetchContacts]);

    const handleLogout = () => { localStorage.removeItem(SESSION_KEY); router.replace('/admin/login'); };

    const unreadCount = contacts.filter(c => c.status === 'Unread').length;
    const pendingCount = applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;
    const updatedCount = applications.filter(a => a.isNewUpdate).length;

    const filteredApps = applications.filter(a => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || a.fullName?.toLowerCase().includes(q) || a.refId?.toLowerCase().includes(q);
        const matchFilter = filterStatus === 'All' || a.status === filterStatus;
        return matchSearch && matchFilter;
    });

    if (!session) return (
        <div className="min-h-screen bg-[#020B18] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-nepal-gold/30 border-t-nepal-gold rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#080F1C] font-outfit flex text-white">

            {/* ════ SIDEBAR ════ */}
            <aside className="w-72 shrink-0 bg-[#050C18] border-r border-white/[0.05] flex flex-col fixed h-full z-50">
                {/* Brand */}
                <div className="px-6 py-7 border-b border-white/[0.05]">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 bg-nepal-gold rounded-xl flex items-center justify-center shadow-lg shadow-nepal-gold/20 shrink-0">
                            <ShieldCheck size={22} className="text-nepal-navy" strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="text-white font-black text-lg tracking-tight leading-none">
                                Pathfinder<span className="text-nepal-gold"> Nepal</span>
                            </div>
                            <div className="text-xs font-bold uppercase tracking-widest text-white/30 mt-1">Admin Console</div>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-4 py-5 space-y-1.5">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all relative group ${activeTab === item.id
                                ? 'bg-nepal-gold/10 text-nepal-gold border border-nepal-gold/20'
                                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
                                }`}
                        >
                            <item.icon
                                size={20}
                                className={activeTab === item.id ? 'text-nepal-gold' : 'text-white/35 group-hover:text-white/60 transition-colors'}
                            />
                            {item.label}
                            {item.id === 'queries' && unreadCount > 0 && (
                                <span className="ml-auto min-w-[22px] h-[22px] px-1.5 bg-nepal-gold text-nepal-navy rounded-full text-xs font-black flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                            {item.id === 'applications' && (pendingCount > 0 || updatedCount > 0) && (
                                <div className="ml-auto flex items-center gap-1">
                                    {updatedCount > 0 && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
                                    <span className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-black flex items-center justify-center ${updatedCount > 0 ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'}`}>
                                        {pendingCount}
                                    </span>
                                </div>
                            )}
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-nepal-gold rounded-r-full" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* User card */}
                <div className="px-4 pb-5 border-t border-white/[0.05] pt-4">
                    <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                        <div className="w-11 h-11 bg-nepal-gold rounded-xl flex items-center justify-center text-nepal-navy font-black text-base shrink-0">
                            {session.user?.split(' ').map((w: string) => w[0]).join('').slice(0, 2) ?? 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-black text-[15px] tracking-tight truncate">{session.user}</p>
                            <p className="text-white/35 text-xs font-bold uppercase tracking-wider truncate mt-0.5">Super Admin</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Log out"
                            className="text-white/25 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ════ MAIN CONTENT ════ */}
            <div className="flex-1 ml-72 flex flex-col min-h-screen">

                {/* Top bar */}
                <header className="sticky top-0 z-40 bg-[#080F1C]/90 backdrop-blur-xl border-b border-white/[0.05] px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-black text-white tracking-tight capitalize">
                            {navItems.find(n => n.id === activeTab)?.label ?? 'Dashboard'}
                        </h1>
                        <ChevronRight size={16} className="text-white/25" />
                        <span className="text-sm font-bold text-white/35">Overview</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative group/field min-w-[320px] transition-all duration-500">
                            <div className="absolute -inset-[1.5px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-xl opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                            <div className="relative flex items-center bg-white/[0.05] border border-white/[0.07] rounded-xl group-focus-within/field:bg-white/[0.08] group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden">
                                <Search size={16} className="ml-5 text-white/30 group-focus-within/field:text-nepal-gold transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search command registry..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent px-5 py-4 text-white text-sm font-bold placeholder:text-white/20 outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => { fetchApplications(); fetchContacts(); }}
                            className="p-3 bg-white/[0.05] border border-white/[0.07] rounded-xl hover:bg-white/[0.09] transition-colors group"
                            title="Refresh data"
                        >
                            <RefreshCw size={17} className="text-white/45 group-hover:text-white/75 transition-colors" />
                        </button>
                        <div className="flex items-center gap-2 text-sm font-bold text-white/30 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >

                            {/* ══════ DASHBOARD ══════ */}
                            {activeTab === 'dashboard' && (
                                <div className="space-y-8">
                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                                        {[
                                            { label: 'Total Applications', value: applications.length, icon: FileText, color: 'text-blue-300', bg: 'bg-blue-500/10 border-blue-500/15' },
                                            { label: 'Ready for Review', value: pendingCount, icon: Clock, color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/15' },
                                            { label: 'New Updates', value: updatedCount, icon: RefreshCw, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/15' },
                                            { label: 'Unread Messages', value: unreadCount, icon: Inbox, color: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/15' },
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 18 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                className="bg-[#0D1626] border border-white/[0.07] rounded-2xl p-7 hover:border-white/[0.12] transition-all"
                                            >
                                                <div className={`w-13 h-13 w-12 h-12 ${stat.bg} border rounded-xl flex items-center justify-center mb-6`}>
                                                    <stat.icon size={24} className={stat.color} />
                                                </div>
                                                <p className="text-white/60 text-sm font-black uppercase tracking-widest mb-2">{stat.label}</p>
                                                {loadingApps || loadingContacts ? (
                                                    <div className="h-10 w-20 bg-white/[0.06] rounded-xl animate-pulse" />
                                                ) : (
                                                    <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Recent grids */}
                                    <div className="grid xl:grid-cols-3 gap-6">
                                        {/* Latest applications */}
                                        <div className="xl:col-span-2 bg-[#0D1626] border border-white/[0.07] rounded-2xl overflow-hidden">
                                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
                                                <h3 className="font-black text-white text-lg tracking-tight">Latest Applications</h3>
                                                <button
                                                    onClick={() => setActiveTab('applications')}
                                                    className="text-sm font-black text-nepal-gold hover:text-yellow-400 transition-colors flex items-center gap-1.5"
                                                >
                                                    View all <ChevronRight size={14} />
                                                </button>
                                            </div>
                                            {loadingApps ? (
                                                <div className="p-6 space-y-4">
                                                    {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-white/[0.03] rounded-xl animate-pulse" />)}
                                                </div>
                                            ) : applications.length === 0 ? (
                                                <EmptyState icon={FileText} title="No applications yet" subtitle="When clients submit visa applications from the Apply page, they will appear here." />
                                            ) : (
                                                <div className="divide-y divide-white/[0.04]">
                                                    {applications.slice(0, 5).map((app, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => setSelectedItem(app)}
                                                            className="flex items-center gap-4 px-6 py-5 hover:bg-white/[0.04] transition-colors cursor-pointer group/row"
                                                        >
                                                            <div className="w-11 h-11 bg-nepal-navy/60 border border-white/10 rounded-xl flex items-center justify-center text-sm font-black text-nepal-gold shrink-0">
                                                                {app.fullName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2) ?? '??'}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-white font-bold text-base truncate">{app.fullName}</p>
                                                                <p className="text-white/50 text-sm font-bold font-mono mt-0.5">{app.refId} · {app.visaLabel}</p>
                                                            </div>
                                                            <StatusBadge status={app.status} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Inbox */}
                                        <div className="bg-[#0D1626] border border-white/[0.07] rounded-2xl overflow-hidden">
                                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
                                                <h3 className="font-black text-white text-lg tracking-tight">Inbox</h3>
                                                {unreadCount > 0 && (
                                                    <span className="min-w-[26px] h-[26px] px-2 bg-nepal-gold text-nepal-navy rounded-full text-xs font-black flex items-center justify-center">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            {loadingContacts ? (
                                                <div className="p-6 space-y-3">
                                                    {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />)}
                                                </div>
                                            ) : contacts.length === 0 ? (
                                                <EmptyState icon={Inbox} title="No messages yet" subtitle="Client queries from the Contact page will appear here." />
                                            ) : (
                                                <div className="divide-y divide-white/[0.04]">
                                                    {contacts.slice(0, 4).map((c, i) => (
                                                        <div
                                                            key={i}
                                                            className="px-6 py-5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                                            onClick={() => { setActiveTab('queries'); setSelectedItem(c); }}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${c.status === 'Unread' ? 'bg-nepal-gold' : 'bg-white/15'}`} />
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-white font-bold text-[15px] truncate">{c.name}</p>
                                                                    <p className="text-white/45 text-sm font-medium truncate mt-0.5">{c.department}</p>
                                                                    <p className="text-white/25 text-sm font-bold mt-1">{fmtDate(c.submittedAt)}</p>
                                                                </div>
                                                                <StatusBadge status={c.status} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ══════ APPLICATIONS ══════ */}
                            {activeTab === 'applications' && (
                                <div className="space-y-6">
                                    {/* Filter bar */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setFilterStatus(f)}
                                                className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wide transition-all ${filterStatus === f
                                                    ? 'bg-nepal-gold text-nepal-navy'
                                                    : 'bg-white/[0.05] border border-white/[0.07] text-white/50 hover:text-white/80'
                                                    }`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                        <div className="ml-auto">
                                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] border border-white/[0.07] rounded-xl text-sm font-black text-white/50 hover:text-white/80 transition-colors uppercase tracking-wide">
                                                <Download size={15} /> Export CSV
                                            </button>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="bg-[#0D1626] border border-white/[0.07] rounded-2xl overflow-hidden">
                                        {loadingApps ? (
                                            <div className="p-8 space-y-4">
                                                {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-white/[0.03] rounded-xl animate-pulse" />)}
                                            </div>
                                        ) : filteredApps.length === 0 ? (
                                            <EmptyState
                                                icon={FileText}
                                                title={applications.length === 0 ? 'No applications stored yet' : 'No results match your filter'}
                                                subtitle={applications.length === 0 ? 'Visa applications submitted by clients on the Apply page are saved here in real time.' : 'Try changing the filter or search query.'}
                                            />
                                        ) : (
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-white/[0.06]">
                                                        {['Ref ID', 'Applicant', 'Nationality', 'Visa Type', 'Status', 'Date', ''].map(h => (
                                                            <th key={h} className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.2em] text-white/50">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/[0.04]">
                                                    {filteredApps.map((app, i) => (
                                                        <tr
                                                            key={i}
                                                            onClick={() => setSelectedItem(app)}
                                                            className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                                                        >
                                                            <td className="px-6 py-5">
                                                                <span className="text-sm font-black text-nepal-gold font-mono">{app.refId}</span>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-nepal-navy/60 border border-white/10 rounded-xl flex items-center justify-center text-sm font-black text-nepal-gold shrink-0">
                                                                        {app.fullName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-white font-bold text-[15px]">{app.fullName}</p>
                                                                        <p className="text-white/35 text-sm font-medium mt-0.5">{app.email}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5"><span className="text-white/60 text-sm font-bold">{app.nationality}</span></td>
                                                            <td className="px-6 py-5"><span className="text-white/60 text-sm font-bold">{app.visaLabel}</span></td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-3">
                                                                    <StatusBadge status={app.status} />
                                                                    {app.isNewUpdate && (
                                                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[9px] font-black text-blue-400 animate-pulse">
                                                                            <RefreshCw size={8} /> RE-UPLOAD
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5"><span className="text-white/40 text-sm font-bold">{fmtDate(app.submittedAt)}</span></td>
                                                            <td className="px-6 py-5">
                                                                <button
                                                                    onClick={() => setSelectedItem(app)}
                                                                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-white/[0.06] hover:bg-nepal-gold/20 hover:text-nepal-gold text-white/40 transition-all"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ══════ CLIENTS ══════ */}
                            {activeTab === 'clients' && (
                                <div>
                                    {loadingApps ? (
                                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                                            {[...Array(6)].map((_, i) => <div key={i} className="h-52 bg-[#0D1626] border border-white/[0.07] rounded-2xl animate-pulse" />)}
                                        </div>
                                    ) : applications.length === 0 ? (
                                        <div className="bg-[#0D1626] border border-white/[0.07] rounded-2xl">
                                            <EmptyState icon={Users} title="No clients registered yet" subtitle="Every applicant who submits a visa application becomes a client record here." />
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                                            {applications.map((app, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 18 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05, duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                    onClick={() => setSelectedItem(app)}
                                                    className="bg-[#0D1626] border border-white/[0.07] rounded-2xl p-6 hover:border-nepal-gold/25 transition-all cursor-pointer group/card hover:bg-white/[0.02]"
                                                >
                                                    <div className="flex items-start justify-between mb-6">
                                                        <div className="flex items-center gap-3.5">
                                                            <div className="w-13 h-13 w-12 h-12 bg-nepal-navy/60 border border-nepal-gold/20 rounded-2xl flex items-center justify-center text-nepal-gold font-black text-base">
                                                                {app.fullName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-black text-[16px] tracking-tight">{app.fullName}</p>
                                                                <p className="text-white/40 text-sm font-bold mt-0.5">{app.nationality}</p>
                                                            </div>
                                                        </div>
                                                        <StatusBadge status={app.status} />
                                                    </div>
                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center gap-2.5 text-white/40">
                                                            <Hash size={14} />
                                                            <span className="font-black font-mono text-sm text-nepal-gold">{app.refId}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2.5 text-white/40">
                                                            <FileText size={14} />
                                                            <span className="font-bold text-sm text-white/60">{app.visaLabel}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2.5 text-white/40">
                                                            <Mail size={14} />
                                                            <span className="font-bold text-sm text-white/60 truncate">{app.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2.5 text-white/40">
                                                            <Calendar size={14} />
                                                            <span className="font-bold text-sm text-white/60">{fmtDate(app.submittedAt)}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ══════ QUERIES ══════ */}
                            {activeTab === 'queries' && (
                                <div className="grid xl:grid-cols-5 gap-6">
                                    {/* List pane */}
                                    <div className="xl:col-span-2 space-y-3">
                                        {loadingContacts ? (
                                            <>{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-[#0D1626] border border-white/[0.07] rounded-2xl animate-pulse" />)}</>
                                        ) : contacts.length === 0 ? (
                                            <div className="bg-[#0D1626] border border-white/[0.07] rounded-2xl">
                                                <EmptyState icon={MessageSquare} title="No queries received yet" subtitle="When clients submit a message on the Contact page it will appear here." />
                                            </div>
                                        ) : contacts.map((c, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05, duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                onClick={() => setSelectedItem(c)}
                                                className={`bg-[#0D1626] border rounded-2xl p-5 cursor-pointer transition-all hover:border-nepal-gold/35 ${selectedItem?.id === c.id ? 'border-nepal-gold/45 bg-nepal-gold/[0.05]' : 'border-white/[0.07]'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${c.status === 'Unread' ? 'bg-nepal-gold animate-pulse' : 'bg-white/15'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <p className="text-white font-black text-[15px] truncate">{c.name}</p>
                                                            <StatusBadge status={c.status} />
                                                        </div>
                                                        <p className="text-white/45 text-sm font-bold truncate">{c.department}</p>
                                                        <p className="text-white/25 text-sm font-medium line-clamp-2 mt-2">{c.message}</p>
                                                        <p className="text-white/20 text-sm font-bold mt-2">{fmtDate(c.submittedAt)}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Detail pane */}
                                    <div className="xl:col-span-3">
                                        {selectedItem && selectedItem.message ? (
                                            <div className="bg-[#0D1626] border border-white/[0.07] rounded-2xl flex flex-col overflow-hidden" style={{ minHeight: '520px' }}>
                                                <div className="px-7 py-6 border-b border-white/[0.05]">
                                                    <h3 className="text-white font-black text-xl tracking-tight">{selectedItem.department}</h3>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-sm font-black text-nepal-gold">{selectedItem.name}</span>
                                                        <span className="text-white/25">·</span>
                                                        <span className="text-sm font-bold text-white/40">{selectedItem.email}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 px-7 py-6 space-y-6">
                                                    <div className="bg-white/[0.03] rounded-2xl p-6">
                                                        <p className="text-xs font-black uppercase tracking-widest text-white/25 mb-4">Message from Client</p>
                                                        <p className="text-white/65 text-base font-medium leading-relaxed">{selectedItem.message}</p>
                                                        <p className="text-white/20 text-sm font-bold mt-5">Received {fmtDate(selectedItem.submittedAt)}</p>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <p className="text-xs font-black uppercase tracking-widest text-white/25">Official Reply</p>
                                                        <textarea
                                                            rows={5}
                                                            value={replyText}
                                                            onChange={e => setReplyText(e.target.value)}
                                                            placeholder="Type your official response here..."
                                                            className="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-5 py-4 text-white text-base font-medium placeholder:text-white/20 outline-none focus:border-nepal-gold/45 resize-none transition-all"
                                                        />
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => updateQuery(selectedItem.id, { reply: replyText })}
                                                                disabled={!replyText.trim()}
                                                                className="flex items-center gap-2 px-6 py-3 bg-nepal-gold text-nepal-navy rounded-xl text-sm font-black uppercase tracking-wide hover:bg-yellow-400 transition-colors disabled:opacity-40"
                                                            >
                                                                <Mail size={16} /> Send Reply
                                                            </button>
                                                            <button
                                                                onClick={() => updateQuery(selectedItem.id, { priority: selectedItem.priority === 'High' ? 'Normal' : 'High' })}
                                                                className={`flex items-center gap-2 px-5 py-3 border rounded-xl text-sm font-black uppercase tracking-wide transition-colors ${selectedItem.priority === 'High'
                                                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                                                                    : 'bg-white/[0.05] border-white/[0.07] text-white/45 hover:text-white/75'
                                                                    }`}
                                                            >
                                                                <Star size={16} fill={selectedItem.priority === 'High' ? 'currentColor' : 'none'} />
                                                                {selectedItem.priority === 'High' ? 'High Priority' : 'Mark Priority'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-[#0D1626] border border-white/[0.07] rounded-2xl" style={{ minHeight: '420px' }}>
                                                <EmptyState icon={MessageSquare} title="Select a query" subtitle="Click a message on the left to view its content and compose a reply." />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ══════ DATABASE GUIDE ══════ */}
                            {activeTab === 'database' && (
                                <div className="space-y-8 max-w-4xl">
                                    <div className="bg-[#0D1626] border border-nepal-gold/20 rounded-2xl p-7">
                                        <div className="flex items-center gap-3 mb-5">
                                            <AlertCircle size={20} className="text-nepal-gold" />
                                            <h3 className="font-black text-nepal-gold text-lg tracking-tight">How the Database Works</h3>
                                        </div>
                                        <div className="space-y-3 text-base text-white/55 font-medium leading-relaxed">
                                            <p>Data is stored as <span className="text-white font-bold">JSON files</span> in the <code className="bg-white/10 px-2 py-0.5 rounded text-nepal-gold font-mono text-sm">data/</code> folder at the project root. Two files are used:</p>
                                            <ul className="space-y-2 ml-5 list-disc">
                                                <li><code className="text-nepal-gold font-mono text-sm bg-white/10 px-2 py-0.5 rounded">data/applications.json</code> — all visa applications from the Apply page</li>
                                                <li><code className="text-nepal-gold font-mono text-sm bg-white/10 px-2 py-0.5 rounded">data/contacts.json</code> — all messages from the Contact page</li>
                                            </ul>
                                            <p>Each record is automatically assigned a unique ID and timestamp when submitted. The admin panel reads these files in real time via Next.js API routes.</p>
                                        </div>
                                    </div>

                                    <SchemaCard
                                        title="applications.json — Visa Application Record"
                                        fields={[
                                            { name: 'id', type: 'string', required: true, example: '"VZA-1709572800000"' },
                                            { name: 'refId', type: 'string', required: true, example: '"NV-A8K3M2"' },
                                            { name: 'fullName', type: 'string', required: true, example: '"James Harrington"' },
                                            { name: 'email', type: 'string', required: true, example: '"j.harrington@mail.com"' },
                                            { name: 'passportNumber', type: 'string', required: true, example: '"GBR1234567"' },
                                            { name: 'nationality', type: 'string', required: true, example: '"United Kingdom"' },
                                            { name: 'visaType', type: 'string', required: true, example: '"working"' },
                                            { name: 'visaLabel', type: 'string', required: true, example: '"Working Visa"' },
                                            { name: 'duration', type: 'string', required: false, example: '"1_year"' },
                                            { name: 'address', type: 'string', required: false, example: '"Hotel Yak & Yeti, Kathmandu"' },
                                            { name: 'status', type: 'string', required: true, example: '"Pending" | "Approved" | "Rejected"' },
                                            { name: 'submittedAt', type: 'ISO string', required: true, example: '"2026-03-04T12:30:00.000Z"' },
                                        ]}
                                    />

                                    <SchemaCard
                                        title="contacts.json — Client Query / Contact Record"
                                        fields={[
                                            { name: 'id', type: 'string', required: true, example: '"QRY-1709572900000"' },
                                            { name: 'name', type: 'string', required: true, example: '"Mei Lin Zhang"' },
                                            { name: 'email', type: 'string', required: true, example: '"mei.zhang@corp.cn"' },
                                            { name: 'department', type: 'string', required: false, example: '"Consular Visa Inquiry"' },
                                            { name: 'message', type: 'string', required: true, example: '"I would like to know the documents..."' },
                                            { name: 'status', type: 'string', required: true, example: '"Unread" | "Read" | "Replied"' },
                                            { name: 'priority', type: 'string', required: false, example: '"Normal" | "High" | "Urgent"' },
                                            { name: 'submittedAt', type: 'ISO string', required: true, example: '"2026-03-04T13:00:00.000Z"' },
                                        ]}
                                    />

                                    <div className="bg-[#0D1626] border border-white/[0.07] rounded-2xl p-7">
                                        <p className="text-sm font-black uppercase tracking-widest text-white/25 mb-5">API Endpoints</p>
                                        <div className="space-y-4">
                                            {[
                                                { method: 'POST', path: '/api/applications', desc: 'Submit a new visa application (from Apply page)' },
                                                { method: 'GET', path: '/api/applications', desc: 'Retrieve all stored applications (admin only)' },
                                                { method: 'POST', path: '/api/contacts', desc: 'Submit a contact form message (from Contact page)' },
                                                { method: 'GET', path: '/api/contacts', desc: 'Retrieve all stored contact messages (admin only)' },
                                                { method: 'GET', path: '/api/track', desc: 'Look up application status by refId + passport number' },
                                            ].map((ep, i) => (
                                                <div key={i} className="flex items-center gap-5 py-3.5 border-b border-white/[0.05] last:border-0">
                                                    <span className={`w-16 text-center text-xs font-black uppercase tracking-wide py-1.5 rounded-lg shrink-0 ${ep.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                        {ep.method}
                                                    </span>
                                                    <code className="text-nepal-gold font-mono text-sm w-52 shrink-0">{ep.path}</code>
                                                    <span className="text-white/40 text-sm font-medium">{ep.desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ══════ SETTINGS ══════ */}
                            {activeTab === 'settings' && (
                                <div className="max-w-3xl space-y-7">

                                    {/* ── Profile Photo + Info ── */}
                                    <div className="bg-[#0D1626] border border-white/[0.07] rounded-2xl overflow-hidden">
                                        <div className="px-7 py-5 border-b border-white/[0.05] flex items-center gap-3">
                                            <User size={18} className="text-nepal-gold" />
                                            <h3 className="font-black text-white text-lg tracking-tight">Profile</h3>
                                        </div>
                                        <div className="px-7 py-7">
                                            {/* Avatar row */}
                                            <div className="flex items-center gap-7 mb-8 pb-8 border-b border-white/[0.05]">
                                                <div className="relative shrink-0">
                                                    <div className="w-24 h-24 rounded-2xl bg-nepal-navy border-2 border-nepal-gold/30 overflow-hidden flex items-center justify-center">
                                                        {profilePhoto ? (
                                                            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-2xl font-black text-nepal-gold">
                                                                {profileName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2) || 'AD'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => photoInputRef.current?.click()}
                                                        className="absolute -bottom-2 -right-2 w-9 h-9 bg-nepal-gold rounded-xl flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-lg shadow-nepal-gold/30"
                                                    >
                                                        <Camera size={16} className="text-nepal-navy" />
                                                    </button>
                                                    <input
                                                        ref={photoInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handlePhotoChange}
                                                        className="hidden"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-white font-black text-xl tracking-tight">{profileName || 'Admin'}</p>
                                                    <p className="text-white/40 text-sm font-bold mt-1">{profileEmail}</p>
                                                    <p className="text-nepal-gold text-xs font-black uppercase tracking-widest mt-2 bg-nepal-gold/10 border border-nepal-gold/20 px-3 py-1 rounded-full inline-block">
                                                        {session.role ?? 'Super Admin'}
                                                    </p>
                                                </div>
                                                <div className="ml-auto">
                                                    {profileSaved && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -6 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex items-center gap-2 text-emerald-400 text-sm font-black bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl"
                                                        >
                                                            <CheckCircle size={16} /> Saved!
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Fields */}
                                            <div className="grid grid-cols-2 gap-8">
                                                {[
                                                    { label: 'Full Name', value: profileName, setter: setProfileName, icon: User, placeholder: 'ADMINISTRATOR NAME' },
                                                    { label: 'Email Address', value: profileEmail, setter: setProfileEmail, icon: Mail, placeholder: 'ADMIN@PROTOCOL.COM', type: 'email' },
                                                    { label: 'Phone Number', value: profilePhone, setter: setProfilePhone, icon: Phone, placeholder: '+977 XXX XXXXXX' },
                                                ].map((field, i) => (
                                                    <div key={i} className="space-y-4">
                                                        <div className="flex items-center gap-3 ml-2">
                                                            <field.icon className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                            <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">{field.label}</label>
                                                        </div>
                                                        <div className="relative group/field transition-all duration-500">
                                                            <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-xl opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                            <div className="relative flex items-center bg-white/[0.04] border border-white/[0.12] rounded-xl group-focus-within/field:bg-white/[0.08] group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden">
                                                                <input
                                                                    type={field.type || 'text'}
                                                                    value={field.value}
                                                                    onChange={e => field.setter(e.target.value)}
                                                                    placeholder={field.placeholder}
                                                                    className="w-full bg-transparent px-6 py-4 text-white text-base font-bold placeholder:text-white/10 outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 ml-2">
                                                        <Shield className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                        <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Archival Role</label>
                                                    </div>
                                                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-6 py-4 text-white/20 text-base font-bold">
                                                        {session.role ?? 'Super Admin'}
                                                    </div>
                                                </div>
                                                <div className="col-span-2 space-y-4">
                                                    <div className="flex items-center gap-3 ml-2">
                                                        <FileText className="text-nepal-gold" size={14} strokeWidth={2.5} />
                                                        <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Bio / Security Access Note</label>
                                                    </div>
                                                    <div className="relative group/field transition-all duration-500">
                                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-nepal-gold/50 to-transparent rounded-xl opacity-0 group-focus-within/field:opacity-100 transition-opacity blur-[2px]" />
                                                        <div className="relative bg-white/[0.04] border border-white/[0.12] rounded-xl group-focus-within/field:bg-white/[0.08] group-focus-within/field:border-nepal-gold/50 transition-all duration-500 overflow-hidden">
                                                            <textarea
                                                                rows={3}
                                                                value={profileBio}
                                                                onChange={e => setProfileBio(e.target.value)}
                                                                placeholder="ADMINISTRATIVE BIOGRAPHY..."
                                                                className="w-full bg-transparent px-6 py-4 text-white text-base font-medium placeholder:text-white/10 outline-none resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleProfileSave}
                                                className="group relative mt-10 h-14 px-10 rounded-xl overflow-hidden transition-all duration-500 active:scale-95"
                                            >
                                                <div className="absolute inset-0 bg-nepal-gold" />
                                                <div className="absolute inset-0 bg-[linear-gradient(110deg,#D4A017,45%,#fcd34d,55%,#D4A017)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                                <span className="relative z-10 flex items-center gap-3 text-nepal-navy font-black text-xs uppercase tracking-widest">
                                                    <CheckCircle size={16} /> Update Identity Records
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* ── Password Change ── */}
                                    <div className="bg-[#0D1626] border border-white/[0.07] rounded-2xl overflow-hidden">
                                        <div className="px-7 py-5 border-b border-white/[0.05] flex items-center gap-3">
                                            <Lock size={18} className="text-nepal-gold" />
                                            <h3 className="font-black text-white text-lg tracking-tight">Change Password</h3>
                                        </div>
                                        <div className="px-7 py-7 space-y-5">

                                            {/* Success */}
                                            <AnimatePresence>
                                                {pwdSuccess && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-bold"
                                                    >
                                                        <CheckCircle size={18} /> Password updated successfully.
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Error */}
                                            <AnimatePresence>
                                                {pwdError && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold"
                                                    >
                                                        <AlertTriangle size={18} /> {pwdError}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Current password */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-black uppercase tracking-widest text-white/35">Current Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showCurPwd ? 'text' : 'password'}
                                                        value={curPwd}
                                                        onChange={e => { setCurPwd(e.target.value); setPwdError(''); }}
                                                        placeholder="Enter current password"
                                                        className="w-full bg-white/[0.04] border border-white/[0.12] rounded-xl px-5 py-3.5 pr-14 text-white text-base font-bold outline-none focus:border-nepal-gold transition-all placeholder:text-white/40"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurPwd(v => !v)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                                    >
                                                        {showCurPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* New password */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-black uppercase tracking-widest text-white/35">New Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showNewPwd ? 'text' : 'password'}
                                                        value={newPwd}
                                                        onChange={e => { setNewPwd(e.target.value); setPwdError(''); }}
                                                        placeholder="At least 8 characters"
                                                        className="w-full bg-white/[0.04] border border-white/[0.12] rounded-xl px-5 py-3.5 pr-14 text-white text-base font-bold outline-none focus:border-nepal-gold transition-all placeholder:text-white/40"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPwd(v => !v)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                                    >
                                                        {showNewPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                                {/* Strength bar */}
                                                {newPwd.length > 0 && (
                                                    <div className="space-y-1.5">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                <div
                                                                    key={i}
                                                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-white/10'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className={`text-xs font-black uppercase tracking-widest ${strength <= 2 ? 'text-red-400' :
                                                            strength === 3 ? 'text-amber-400' : 'text-emerald-400'
                                                            }`}>{strengthLabel}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Confirm password */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-black uppercase tracking-widest text-white/35">Confirm New Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPwd ? 'text' : 'password'}
                                                        value={confirmPwd}
                                                        onChange={e => { setConfirmPwd(e.target.value); setPwdError(''); }}
                                                        placeholder="Repeat new password"
                                                        className={`w-full bg-white/[0.04] border rounded-xl px-5 py-3.5 pr-14 text-white text-base font-bold outline-none transition-all placeholder:text-white/40 ${confirmPwd && newPwd !== confirmPwd
                                                            ? 'border-red-500/40 focus:border-red-500/60'
                                                            : confirmPwd && newPwd === confirmPwd
                                                                ? 'border-emerald-500/40 focus:border-emerald-500/60'
                                                                : 'border-white/[0.12] focus:border-nepal-gold'
                                                            }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPwd(v => !v)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                                    >
                                                        {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                    {confirmPwd && newPwd === confirmPwd && (
                                                        <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                                            <CheckCircle size={18} className="text-emerald-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={handlePwdChange}
                                                className="px-8 py-3.5 bg-nepal-gold text-nepal-navy rounded-xl text-sm font-black uppercase tracking-wide hover:bg-yellow-400 transition-colors flex items-center gap-2"
                                            >
                                                <Lock size={16} /> Update Password
                                            </button>
                                        </div>
                                    </div>

                                    {/* ── Danger Zone ── */}
                                    <div className="bg-red-950/30 border border-red-500/15 rounded-2xl overflow-hidden">
                                        <div className="px-7 py-5 border-b border-red-500/10 flex items-center gap-3">
                                            <AlertTriangle size={18} className="text-red-400" />
                                            <h3 className="font-black text-red-400 text-lg tracking-tight">Danger Zone</h3>
                                        </div>
                                        <div className="px-7 py-6 flex items-center justify-between gap-6">
                                            <div>
                                                <p className="text-white font-black text-base mb-1">Terminate Session</p>
                                                <p className="text-white/35 text-sm font-medium">Log out and revoke the current admin token immediately.</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="px-5 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-black uppercase tracking-wide hover:bg-red-500/20 transition-colors flex items-center gap-2 shrink-0"
                                            >
                                                <LogOut size={16} /> Log Out
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* ════ APPLICATION DETAIL MODAL ════ */}
            <AnimatePresence>
                {selectedItem && selectedItem.passportNumber && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="bg-[#0D1626] border border-white/[0.1] rounded-[2.5rem] p-10 w-full max-w-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/[0.08] transition-all z-20 group"
                            >
                                <XCircle size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nepal-gold/40 to-transparent rounded-t-[2rem]" />
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-nepal-navy/60 border border-nepal-gold/20 rounded-2xl flex items-center justify-center text-nepal-gold font-black text-lg shrink-0">
                                    {selectedItem.fullName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">{selectedItem.fullName}</h2>
                                    <p className="text-white/40 text-base font-bold mt-0.5">{selectedItem.nationality} · {selectedItem.visaLabel}</p>
                                    <p className="text-nepal-gold font-black text-sm font-mono mt-1">{selectedItem.refId}</p>
                                </div>
                                <div className="ml-auto flex flex-col items-end gap-2">
                                    <StatusBadge status={selectedItem.status} />
                                    {selectedItem.isNewUpdate && (
                                        <button
                                            onClick={async () => {
                                                const res = await fetch('/api/applications', {
                                                    method: 'PATCH',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ refId: selectedItem.refId, isNewUpdate: false })
                                                });
                                                if (res.ok) {
                                                    setSelectedItem((prev: any) => ({ ...prev, isNewUpdate: false, recentlyUpdatedDocs: [] }));
                                                    setApplications(prev => prev.map(a => a.refId === selectedItem.refId ? { ...a, isNewUpdate: false, recentlyUpdatedDocs: [] } : a));
                                                }
                                            }}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                                        >
                                            ACKNOWLEDGE UPDATE
                                        </button>
                                    )}
                                </div>
                            </div>
                            {selectedItem.isNewUpdate && (
                                <div className="mb-7 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0 animate-pulse">
                                        <RefreshCw size={18} />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-sm tracking-tight">Re-Uploaded Documents Awaiting Review</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedItem.recentlyUpdatedDocs && selectedItem.recentlyUpdatedDocs.length > 0 ? (
                                                selectedItem.recentlyUpdatedDocs.map((doc: string, idx: number) => (
                                                    <span key={idx} className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-blue-500/30">
                                                        {doc}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-blue-300/60 text-xs font-bold uppercase tracking-widest">Applicant has addressed the requested fixes</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4 mb-7">
                                {[
                                    { label: 'Email Address', value: selectedItem.email },
                                    { label: 'Passport No.', value: selectedItem.passportNumber },
                                    { label: 'Registry Date', value: fmtDate(selectedItem.submittedAt) },
                                    { label: 'Visa Duration', value: selectedItem.duration?.replace('_', ' ') ?? '—' },
                                ].map((row, i) => (
                                    <div key={i} className="bg-white/[0.04] border border-white/[0.1] rounded-xl p-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1.5">{row.label}</p>
                                        <p className="text-white font-black text-[13px] truncate">{row.value}</p>
                                    </div>
                                ))}
                            </div>

                            {selectedItem.paymentStatus === 'Paid' && (
                                <div className="mb-10 p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] relative overflow-hidden group/payinfo">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-emerald-400 group-hover/payinfo:scale-110 transition-transform duration-1000">
                                        <CheckCircle size={100} />
                                    </div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Payment Verification Protocol</h4>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Transaction ID</p>
                                            <p className="text-white font-black text-xs font-mono">{selectedItem.receipt?.transactionId}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Authorization Date</p>
                                            <p className="text-white font-black text-xs">{fmtDate(selectedItem.paidAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Method</p>
                                            <p className="text-white font-black text-xs">{selectedItem.receipt?.method}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Amount</p>
                                            <p className="text-emerald-400 font-black text-xs">${selectedItem.receipt?.amount} {selectedItem.receipt?.currency}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Automated Notification Payload</p>
                                        <p className="text-white/60 text-xs font-medium leading-relaxed italic">
                                            "{selectedItem.issuanceTimeline}"
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mb-12 space-y-5">
                                <div className="flex items-center justify-between px-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Visa Record</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-nepal-gold/40">Verified Registry</p>
                                </div>
                                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-3 custom-scrollbar">
                                    {selectedItem.documents && Object.keys(selectedItem.documents).length > 0 ? (
                                        Object.entries(selectedItem.documents).map(([name, data], i) => {
                                            const isRecentUpdate = selectedItem.recentlyUpdatedDocs?.includes(name);
                                            const isRejected = selectedItem.rejectedDocuments?.includes(name);

                                            return (
                                                <div key={i} className={`flex items-center justify-between p-5 border rounded-2xl group/doc transition-all 
                                                    ${isRejected ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10' :
                                                        isRecentUpdate ? 'bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10' :
                                                            'bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-all 
                                                            ${isRejected ? 'bg-red-500 text-white shadow-red-500/20' :
                                                                isRecentUpdate ? 'bg-blue-500 text-white shadow-blue-500/20' :
                                                                    'bg-emerald-500 text-white shadow-emerald-500/20'}`}>
                                                            {isRejected ? <XCircle size={18} /> :
                                                                isRecentUpdate ? <RefreshCw size={18} className="animate-spin-slow" /> :
                                                                    <ShieldCheck size={18} />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="text-white font-black text-sm block leading-none">{name}</span>
                                                                {isRejected ? (
                                                                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest border border-red-400">Action Required</span>
                                                                ) : isRecentUpdate ? (
                                                                    <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest animate-pulse border border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]">RE-UPLOADED</span>
                                                                ) : (
                                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Verified</span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                                <div className={`w-1 h-1 rounded-full ${isRejected ? 'bg-red-400' : isRecentUpdate ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                                                                <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">
                                                                    {isRejected ? 'Flagged as Invalid Format' : isRecentUpdate ? 'New Version Awaiting Audit' : 'Previously Validated Asset'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={async () => {
                                                                const win = window.open();
                                                                if (win) win.document.write(`<iframe src="${data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);

                                                                // Auto-verify: mark as seen when opened
                                                                if (isRecentUpdate) {
                                                                    const newList = (selectedItem.recentlyUpdatedDocs || []).filter((n: string) => n !== name);
                                                                    const res = await fetch('/api/applications', {
                                                                        method: 'PATCH',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ refId: selectedItem.refId, recentlyUpdatedDocs: newList })
                                                                    });
                                                                    if (res.ok) {
                                                                        setSelectedItem((prev: any) => ({ ...prev, recentlyUpdatedDocs: newList }));
                                                                        setApplications(prev => prev.map(a => a.refId === selectedItem.refId ? { ...a, recentlyUpdatedDocs: newList } : a));
                                                                    }
                                                                }
                                                            }}
                                                            className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${isRecentUpdate ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}
                                                        >
                                                            Open Vault
                                                        </button>

                                                        <button
                                                            onClick={async () => {
                                                                const currentRejected = (selectedItem as Application).rejectedDocuments || [];
                                                                const isAlreadyRejected = currentRejected.includes(name);
                                                                const newList = isAlreadyRejected
                                                                    ? currentRejected.filter((n: string) => n !== name)
                                                                    : [...currentRejected, name];

                                                                const res = await fetch('/api/applications', {
                                                                    method: 'PATCH',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ refId: selectedItem.refId, rejectedDocuments: newList })
                                                                });
                                                                if (res.ok) {
                                                                    setSelectedItem((prev: any) => ({ ...prev, rejectedDocuments: newList }));
                                                                    setApplications(prev => prev.map(a => a.refId === selectedItem.refId ? { ...a, rejectedDocuments: newList } : a));
                                                                }
                                                            }}
                                                            className={`p-2.5 rounded-xl border transition-all ${isRejected
                                                                ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20'
                                                                : 'bg-white/[0.05] border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/50'}`}
                                                            title={isRejected ? "Restore to Verified" : "Flag as Mismatch"}
                                                        >
                                                            {isRejected ? <ShieldCheck size={16} /> : <XCircle size={16} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="p-6 bg-white/[0.02] border border-white/[0.05] border-dashed rounded-xl text-center">
                                            <p className="text-xs font-bold text-white/20 uppercase tracking-widest italic">No digital assets attached to record</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Admin Protocol: Status & Feedback */}
                            <div className="mb-12 p-8 bg-white/[0.03] border border-white/[0.08] rounded-[2.5rem] space-y-8">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Admin Feedback Protocol</h4>
                                    <button
                                        onClick={() => {
                                            const rejected = (selectedItem as Application).rejectedDocuments || [];
                                            if (rejected.length === 0) {
                                                setSelectedItem((prev: any) => ({ ...prev, adminFeedback: "All digital assets currently manifest adherence to protocol standards. Dossier is cleared for advanced verification." }));
                                                return;
                                            }
                                            const suggestion = `CRITICAL RECTIFICATION REQUIRED: The following elements are compromised: ${rejected.join(', ')}. Submit ultra-hi-res digital duplicates via the portal vault immediately.`;
                                            setSelectedItem((prev: any) => ({ ...prev, adminFeedback: suggestion }));
                                        }}
                                        className="flex items-center gap-2.5 px-4 py-2 bg-nepal-gold/10 border border-nepal-gold/20 rounded-xl text-[10px] font-black uppercase text-nepal-gold hover:bg-nepal-gold/20 transition-all group"
                                    >
                                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                                        Protocol AI
                                    </button>
                                </div>

                                <textarea
                                    className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-base text-white/90 placeholder:text-white/20 outline-none focus:border-nepal-gold/40 transition-all min-h-[140px] font-medium leading-relaxed custom-scrollbar shadow-inner"
                                    placeholder="Execute specific protocol feedback instructions here..."
                                    value={selectedItem.adminFeedback || ''}
                                    onChange={(e) => setSelectedItem((prev: any) => ({ ...prev, adminFeedback: e.target.value }))}
                                />

                                <div className="flex gap-4">
                                    <button
                                        onClick={async (e) => {
                                            const btn = e.currentTarget;
                                            const originalText = "COMMIT PROTOCOL UPDATES";
                                            btn.disabled = true;
                                            btn.innerHTML = `<span class="flex items-center gap-3"><div class="w-4 h-4 border-2 border-nepal-gold border-t-transparent rounded-full animate-spin"></div> AUTHENTICATING...</span>`;

                                            const res = await fetch('/api/applications', {
                                                method: 'PATCH',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ refId: selectedItem.refId, adminFeedback: selectedItem.adminFeedback })
                                            });
                                            if (res.ok) {
                                                setApplications(prev => prev.map(a => a.refId === selectedItem.refId ? { ...a, adminFeedback: selectedItem.adminFeedback } : a));
                                                btn.innerHTML = `<span class="text-emerald-400 flex items-center gap-2">✓ PROTOCOL COMMITTED</span>`;
                                                btn.classList.add('border-emerald-500/50', 'bg-emerald-500/10');
                                                setTimeout(() => {
                                                    btn.disabled = false;
                                                    btn.innerText = originalText;
                                                    btn.classList.remove('border-emerald-500/50', 'bg-emerald-500/10');
                                                }, 2500);
                                            } else {
                                                btn.innerText = "SYSTEM ERROR";
                                                btn.classList.add('border-red-500/50', 'bg-red-500/10');
                                                setTimeout(() => {
                                                    btn.disabled = false;
                                                    btn.innerText = originalText;
                                                    btn.classList.remove('border-red-500/50', 'bg-red-500/10');
                                                }, 2500);
                                            }
                                        }}
                                        className="flex-1 py-5 bg-black/40 border border-white/[0.08] rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-white hover:border-nepal-gold/50 hover:bg-nepal-gold/5 transition-all active:scale-[0.98] shadow-2xl shadow-black/40 disabled:opacity-50 flex items-center justify-center relative overflow-hidden group/commit"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover/commit:translate-x-full transition-transform duration-1000" />
                                        COMMIT PROTOCOL UPDATES
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap lg:flex-nowrap gap-5 pb-6">
                                <button
                                    onClick={() => updateApplicationStatus(selectedItem.refId, 'Awaiting Payment')}
                                    className="flex-1 py-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 text-[11px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center justify-center gap-4 group"
                                >
                                    <Clock size={28} className="group-hover:scale-110 transition-transform" /> Verify Docs
                                </button>
                                <button
                                    onClick={() => updateApplicationStatus(selectedItem.refId, 'In Progress')}
                                    className="flex-1 py-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-4 group"
                                >
                                    <Clock size={28} className="group-hover:scale-110 transition-transform" /> In Progress
                                </button>
                                <button
                                    onClick={() => updateApplicationStatus(selectedItem.refId, 'Approved')}
                                    className="flex-[1.5] py-6 bg-emerald-500 text-nepal-navy rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all flex items-center justify-center gap-4 shadow-[0_25px_50px_rgba(16,185,129,0.3)] group"
                                >
                                    <CheckCircle size={28} className="group-hover:scale-110 transition-transform" /> Approve Protocol
                                </button>
                                <button
                                    onClick={() => updateApplicationStatus(selectedItem.refId, 'Rejected')}
                                    className="flex-1 py-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-4 group"
                                >
                                    <XCircle size={28} className="group-hover:scale-110 transition-transform" /> Deny Entry
                                </button>
                            </div>

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="w-full py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98] mt-4 mb-2 flex items-center justify-center gap-4 group"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-nepal-gold animate-pulse" />
                                Done & Close Protocol Session
                                <div className="w-1.5 h-1.5 rounded-full bg-nepal-gold animate-pulse" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
