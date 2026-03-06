"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Search, User, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Info', href: '/info', icon: Info },
        { name: 'Apply', href: '/apply', icon: FileText },
        { name: 'Track', href: '/track', icon: Search },
        { name: 'Me', href: '/profile', icon: User },
    ];

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="lg:hidden fixed bottom-4 inset-x-4 sm:inset-x-6 z-[100] bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[1.75rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden"
        >
            <div className="flex items-center justify-around h-[72px] px-2 sm:px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center gap-1 group"
                        >
                            <div className={`relative p-[10px] rounded-2xl transition-all duration-500 ${isActive ? 'bg-nepal-navy text-white shadow-lg shadow-nepal-navy/20 scale-105' : 'text-slate-400 group-hover:text-nepal-navy'}`}>
                                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-indicator"
                                        className="absolute -top-1 -right-1 w-2 h-2 bg-nepal-gold rounded-full border-2 border-white"
                                    />
                                )}
                            </div>
                            <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-nepal-navy' : 'text-slate-400'}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default MobileBottomNav;
