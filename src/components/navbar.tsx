"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Globe, Activity, LogOut, User, LayoutDashboard, Settings, UserCircle, Bell } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [hasNotifications, setHasNotifications] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';

    // We want the navbar to be "scrolled-style" (solid/glass) if scrolled OR not on home
    const isSolid = scrolled || !isHome;
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        const checkAuth = async () => {
            const localSession = localStorage.getItem('pf_user_session');
            if (session?.user) {
                const sessionUser = {
                    name: session.user.name,
                    email: session.user.email,
                    avatar: session.user.image,
                };
                setUser(sessionUser);
                checkNotifications(sessionUser.email || '');
            } else if (localSession) {
                const userData = JSON.parse(localSession);
                setUser(userData);
                checkNotifications(userData.email);
            } else {
                setUser(null);
                setHasNotifications(false);
            }
        };

        const checkNotifications = async (email: string) => {
            try {
                const res = await fetch('/api/applications');
                const data = await res.json();
                if (data.success) {
                    const userApps = data.data.filter((app: any) => app.email === email);
                    const attentionNeeded = userApps.some((app: any) =>
                        app.adminFeedback || (app.rejectedDocuments && app.rejectedDocuments.length > 0)
                    );
                    setHasNotifications(attentionNeeded);
                }
            } catch (err) {
                console.error('Failed focus check', err);
            }
        };

        checkAuth();
        // Check periodically or on focus/event
        window.addEventListener('storage', checkAuth);
        window.addEventListener('focus', checkAuth);
        window.addEventListener('auth-change', checkAuth);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('focus', checkAuth);
            window.removeEventListener('auth-change', checkAuth);
        };
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('pf_user_session');
        setUser(null);
        await signOut({ callbackUrl: '/' });
    };

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Visa Information', href: '/info' },
        { name: 'Requirements', href: '/requirements' },
        { name: 'Track Application', href: '/track' },
        { name: 'Contact Us', href: '/contact' },
    ];

    return (
        <header
            className={`fixed w-full z-[100] top-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSolid
                ? 'py-4 bg-white/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-b border-white/20'
                : 'py-6 bg-transparent border-b border-transparent'
                }`}
        >
            {/* Scroll Progress Bar */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-[2.5px] bg-nepal-gold origin-left z-[110]"
                style={{ scaleX }}
            />

            <div className="container mx-auto px-6 flex justify-between items-center relative">

                {/* ── LIVE Brand Identity ── */}
                <Link href="/" className="flex flex-col items-center leading-none shrink-0 group py-1 relative mr-8 lg:mr-16">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-nepal-gold opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full" />
                    <div className="flex items-center gap-1.5">
                        <span className="text-2xl md:text-3xl font-black text-nepal-gold tracking-tighter uppercase transition-transform group-hover:scale-[1.02]">
                            Pathfinder
                        </span>
                        <span className={`text-2xl md:text-3xl font-black tracking-tighter uppercase transition-colors duration-500 group-hover:scale-[1.02] delay-75 ${isSolid ? 'text-nepal-navy' : 'text-white'}`}>
                            Nepal
                        </span>
                    </div>
                    <div className="mt-1 w-full flex justify-center">
                        <span className={`text-[9px] md:text-[10px] font-black tracking-[0.45em] uppercase whitespace-nowrap group-hover:text-nepal-gold transition-colors duration-500 ${isSolid ? 'text-nepal-navy/40' : 'text-white/60'}`}>
                            Visa Solutions
                        </span>
                    </div>
                </Link>

                {/* ── Desktop Nav Architecture ── */}
                <div className="hidden lg:flex items-center gap-12">
                    <nav className="flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`relative font-bold text-[13px] uppercase tracking-widest hover:text-nepal-gold transition-all duration-300 group whitespace-nowrap ${isSolid ? 'text-nepal-navy' : 'text-white/90'}`}
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 h-[3px] w-0 bg-nepal-gold rounded-full group-hover:w-full transition-all duration-500 ease-out" />
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-5 border-l border-slate-200/60 pl-8">


                        <button className={`flex items-center gap-1 transition-all group ${isSolid ? 'text-slate-400 hover:text-nepal-navy' : 'text-white/60 hover:text-white'}`}>
                            <Globe size={16} className="group-hover:rotate-[15deg] transition-transform" />
                            <span className="text-[11px] font-black uppercase tracking-widest">EN</span>
                            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                        </button>

                        {user ? (
                            <div className="relative">
                                {/* Notifications integrated into profile */}
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex items-center gap-3 p-1.5 pr-4 rounded-full border transition-all duration-300
                                            ${isSolid ? 'bg-slate-50 border-slate-100 hover:border-nepal-gold/30' : 'bg-white/5 border-white/10 hover:border-white/25'}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-9 h-9 rounded-full bg-nepal-gold flex items-center justify-center text-nepal-navy font-black text-sm shadow-lg shadow-nepal-gold/20 overflow-hidden border-2 border-white/50">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                user.name?.charAt(0) || <User size={16} />
                                            )}
                                        </div>
                                        {hasNotifications && (
                                            <div className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-pulse z-10">
                                                <Bell size={10} className="text-white fill-current" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isSolid ? 'text-nepal-navy' : 'text-white'}`}>
                                            {user.name?.split(' ')[0]}
                                        </span>
                                    </div>
                                    <ChevronDown size={12} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''} ${isSolid ? 'text-slate-400' : 'text-white/40'}`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <>
                                            <div className="fixed inset-0 bg-transparent z-[100]" onClick={() => setIsProfileOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-64 bg-white rounded-[1.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] border border-slate-100 p-2 overflow-hidden z-[101]"
                                            >
                                                <div className="p-4 bg-slate-50/50 rounded-2xl mb-2">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Account</p>
                                                    <p className="text-sm font-black text-nepal-navy truncate">{user.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 truncate">{user.email}</p>
                                                </div>

                                                <div className="space-y-1">
                                                    <Link href="/my-applications" className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors group">
                                                        <div className="flex items-center gap-3">
                                                            <LayoutDashboard size={16} className="group-hover:text-nepal-gold transition-colors" />
                                                            <span className="text-xs font-bold">My Applications</span>
                                                        </div>
                                                        {hasNotifications && (
                                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                        )}
                                                    </Link>
                                                    <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors group">
                                                        <Settings size={16} className="group-hover:text-nepal-gold transition-colors" />
                                                        <span className="text-xs font-bold">Account Settings</span>
                                                    </Link>
                                                    <div className="h-px bg-slate-100 my-1 mx-2" />
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-rose-500 transition-colors group"
                                                    >
                                                        <LogOut size={16} />
                                                        <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href="/apply"
                                className="relative overflow-hidden bg-nepal-navy text-white px-7 py-3 rounded-xl font-black text-[12px] uppercase tracking-widest
                                           hover:bg-nepal-gold hover:text-nepal-navy transition-all duration-500 shadow-xl hover:shadow-nepal-gold/20 active:scale-95 group"
                            >
                                <span className="relative z-10">Get Started</span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-101%] group-hover:translate-x-[101%] transition-transform duration-700" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── Mobile Orchestration ── */}
                <button
                    className="lg:hidden w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-nepal-navy hover:bg-nepal-snow transition-all border border-slate-200 shadow-sm overflow-hidden group"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <div className="relative w-6 h-6">
                        <motion.span
                            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -6 }}
                            className="absolute inset-x-0 top-1/2 h-[2px] bg-current rounded-full"
                        />
                        <motion.span
                            animate={{ opacity: isOpen ? 0 : 1 }}
                            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-current rounded-full"
                        />
                        <motion.span
                            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 6 }}
                            className="absolute inset-x-0 top-1/2 h-[2px] bg-current rounded-full"
                        />
                    </div>
                </button>
            </div>

            {/* ── Mobile Glass Menu ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-slate-100 overflow-hidden shadow-2xl"
                    >
                        <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
                            <div className="flex flex-col gap-4">
                                {navLinks.map((link, idx) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="text-2xl font-black text-nepal-navy hover:text-nepal-gold transition-colors flex items-center justify-between group"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="uppercase tracking-tighter">{link.name}</span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="h-px bg-slate-100 w-full" />

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Activity size={18} className="text-emerald-500" />
                                        <span className="text-xs font-black uppercase tracking-widest">Portal Status: Online</span>
                                    </div>
                                    <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                        <Globe size={14} /> English
                                    </div>
                                </div>
                                {user ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Link
                                                href="/my-applications"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-nepal-gold/30 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-nepal-navy text-white flex items-center justify-center">
                                                    <LayoutDashboard size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking</span>
                                                    <span className="text-sm font-black text-nepal-navy">My Applications</span>
                                                </div>
                                            </Link>
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-nepal-gold/30 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-nepal-gold text-nepal-navy flex items-center justify-center">
                                                    <Settings size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</span>
                                                    <span className="text-sm font-black text-nepal-navy">Account Settings</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-red-50 text-red-600 py-4 rounded-xl font-black text-center uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                        >
                                            <LogOut size={18} /> Exit Portal
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/apply"
                                        className="bg-nepal-navy text-white py-4 rounded-xl font-black text-center uppercase tracking-widest shadow-xl shadow-nepal-gold/20 active:scale-95 transition-transform"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Apply Now
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
