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
    const [visible, setVisible] = useState(true);
    const lastScrollY = React.useRef(0);
    const [user, setUser] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [hasNotifications, setHasNotifications] = useState(false);

    const profileRef = React.useRef<HTMLDivElement>(null);
    const mobileMenuRef = React.useRef<HTMLDivElement>(null);
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
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 20);

            setVisible(true);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

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

        // Click Outside Handler
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (profileRef.current && !profileRef.current.contains(target)) {
                setIsProfileOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
                // If it's a mobile menu, we might want to check if they clicked the hamburger button too
                // But generally, any click outside should close it if it's open
                // setIsOpen(false); // Only close if it's the mobile menu being clicked outside
            }
        };

        // We also want a global close for "blank space"
        // If the user clicks on the main document (not on any interactive element that should keep it open)
        document.addEventListener('mousedown', handleClickOutside);

        // Check periodically or on focus/event
        window.addEventListener('storage', checkAuth);
        window.addEventListener('focus', checkAuth);
        window.addEventListener('auth-change', checkAuth);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
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
        { name: 'Visa Info', href: '/info' },
        { name: 'Requirements', href: '/requirements' },
        { name: 'Track Status', href: '/track' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <motion.header
            initial={{ y: 0 }}
            animate={{ y: visible ? 0 : -120 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed w-full z-[100] top-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSolid
                ? 'py-3 lg:py-4 bg-white/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-b border-white/20'
                : 'py-5 lg:py-6 bg-transparent border-b border-transparent'
                }`}
        >
            {/* Scroll Progress Bar */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-[2.5px] bg-nepal-gold origin-left z-[110]"
                style={{ scaleX }}
            />

            <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center relative h-full">

                {/* ── LIVE Brand Identity ── */}
                <Link href="/" className="flex flex-col items-center leading-none shrink-0 group py-1 relative">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xl md:text-3xl font-black text-nepal-gold tracking-tighter uppercase">
                            Pathfinder
                        </span>
                        <span className={`text-xl md:text-3xl font-black tracking-tighter uppercase transition-colors duration-500 ${isSolid ? 'text-nepal-navy' : 'text-white'}`}>
                            Nepal
                        </span>
                    </div>
                    <div className="mt-1 lg:mt-2">
                        <span className={`text-[12px] lg:text-[18px] font-black tracking-[0.2em] lg:tracking-[0.45em] uppercase transition-colors duration-500 ${isSolid ? 'text-nepal-navy/40' : 'text-white/60'}`}>
                            Visa Solution
                        </span>
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center gap-9">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative font-black text-[13px] uppercase tracking-[0.25em] transition-all duration-300 group whitespace-nowrap ${isSolid ? 'text-nepal-navy/70 hover:text-nepal-gold' : 'text-white/80 hover:text-white'}`}
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-nepal-gold group-hover:w-full transition-all duration-500" />
                        </Link>
                    ))}
                </nav>

                <div className="hidden lg:flex items-center gap-4">
                    {user ? (
                        <div className="relative" ref={profileRef}>
                            <motion.button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border transition-all duration-500
                                        ${isSolid
                                        ? 'bg-slate-50 border-slate-200 shadow-sm hover:border-nepal-gold/50'
                                        : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                            >
                                <div className="w-8 h-8 rounded-full bg-nepal-gold flex items-center justify-center text-nepal-navy font-black text-[10px] shadow-lg border border-white/20">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-[0.1em] ${isSolid ? 'text-nepal-navy' : 'text-white'}`}>
                                    {user.name?.split(' ')[0]}
                                </span>
                                <ChevronDown size={12} className={`transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''} ${isSolid ? 'text-slate-400' : 'text-white/40'}`} />
                            </motion.button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[101]"
                                    >
                                        <div className="p-5 bg-slate-50/50 border-b border-slate-100">
                                            <p className="text-[9px] font-black text-nepal-gold uppercase tracking-[0.2em] mb-1">Authenticated User</p>
                                            <p className="text-sm font-black text-nepal-navy truncate mb-0.5">{user.name}</p>
                                            <p className="text-[11px] font-medium text-slate-400 truncate tracking-tight">{user.email}</p>
                                        </div>

                                        <div className="p-2">
                                            <Link href="/my-applications" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <LayoutDashboard size={14} className="text-slate-400 group-hover:text-nepal-gold transition-colors" />
                                                    <span className="text-[11px] font-black text-nepal-navy/70 uppercase tracking-widest group-hover:text-nepal-navy">My Applications</span>
                                                </div>
                                                {hasNotifications && (
                                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-lg shadow-red-500/30" />
                                                )}
                                            </Link>
                                            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                                <Settings size={14} className="text-slate-400 group-hover:text-nepal-gold transition-colors" />
                                                <span className="text-[11px] font-black text-nepal-navy/70 uppercase tracking-widest group-hover:text-nepal-navy">Profile Settings</span>
                                            </Link>
                                            <div className="h-px bg-slate-100 my-1 mx-2" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 transition-colors group"
                                            >
                                                <LogOut size={14} />
                                                <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link
                            href="/apply"
                            className="hidden lg:inline-block bg-nepal-navy text-white px-8 py-3.5 rounded-full font-black text-[12px] uppercase tracking-[0.25em] shadow-xl shadow-nepal-navy/10 hover:bg-nepal-gold hover:text-nepal-navy transition-all duration-500"
                        >
                            Start Journey
                        </Link>
                    )}
                </div>

                {/* ── Mobile Orchestration (Hidden as requested) ── */}
                <div className="hidden items-center gap-3" ref={mobileMenuRef}>
                    <button
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border shadow-sm overflow-hidden group ${isSolid ? 'bg-slate-50 text-nepal-navy border-slate-200' : 'bg-white/10 text-white border-white/10'}`}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="relative w-5 h-5">
                            <motion.span
                                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -5 }}
                                className="absolute inset-x-0 top-1/2 h-[1.5px] bg-current rounded-full"
                            />
                            <motion.span
                                animate={{ opacity: isOpen ? 0 : 1 }}
                                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-current rounded-full"
                            />
                            <motion.span
                                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 5 }}
                                className="absolute inset-x-0 top-1/2 h-[1.5px] bg-current rounded-full"
                            />
                        </div>
                    </button>
                </div>
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
                                <div className="flex items-center gap-2">
                                    <Activity size={18} className="text-emerald-500" />
                                    <span className="text-xs font-black uppercase tracking-widest">System: Active</span>
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
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</span>
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
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">User</span>
                                                    <span className="text-sm font-black text-nepal-navy">Profile Settings</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-red-50 text-red-600 py-4 rounded-xl font-black text-center uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                        >
                                            <LogOut size={18} /> Logout
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
        </motion.header >
    );
};

export default Navbar;
