"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Globe, Clock, ArrowUpRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'Asia/Kathmandu',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            setTime(new Intl.DateTimeFormat('en-US', options).format(now));
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    const footerLinks = {
        quickLinks: [
            { name: 'Visa Types', href: '/info' },
            { name: 'Requirement Checklist', href: '/requirements' },
            { name: 'Track Status', href: '/track' },
            { name: 'Book Appointment', href: '/appointments' },
            { name: 'FAQs', href: '/faq' },
        ],
        resources: [
            { name: 'Policy Documentation', href: '#' },
            { name: 'Embassy Locations', href: '#' },
            { name: 'Download Forms', href: '#' },
            { name: 'News & Updates', href: '#' },
            { name: 'Travel Info', href: '#' },
        ]
    };

    return (
        <footer className="relative bg-[#020617] text-slate-400 pt-28 pb-12 overflow-hidden border-t border-white/5 font-outfit">

            {/* Subtle Premium Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nepal-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-nepal-gold/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

                    {/* Brand Architecture */}
                    <div className="space-y-8">
                        <Link href="/" className="flex flex-col items-start group">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 bg-nepal-gold rounded-xl flex items-center justify-center shadow-[0_0_25px_-5px_rgba(212,160,23,0.4)] group-hover:scale-110 transition-transform duration-500">
                                    <Shield className="text-nepal-navy w-6 h-6" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-white font-black text-xl tracking-tighter uppercase mb-0.5">Pathfinder</span>
                                    <span className="text-nepal-gold font-black text-lg tracking-tighter uppercase">Nepal</span>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed font-medium text-slate-500 max-w-xs">
                                The official digital infrastructure for the Department of Immigration, Nepal. Providing elite visa solutions for a global community.
                            </p>
                        </Link>

                        <div className="flex gap-3">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:bg-nepal-gold hover:text-nepal-navy hover:border-nepal-gold transition-all duration-300 shadow-xl"
                                >
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>

                        {/* LIVE Kathmandu Status */}
                        <div className="pt-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-nepal-gold/60">
                                <Clock size={12} />
                                Kathmandu Local Time
                            </div>
                            <div className="text-2xl font-black text-white tracking-widest font-mono tabular-nums opacity-90">
                                {time || '00:00:00 AM'}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <span className="w-4 h-[2px] bg-nepal-gold" />
                            Quick Links
                        </h4>
                        <ul className="space-y-4 text-sm font-bold">
                            {footerLinks.quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center gap-2 hover:text-white transition-all duration-300">
                                        <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-nepal-gold" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <span className="w-4 h-[2px] bg-nepal-gold" />
                            Resources
                        </h4>
                        <ul className="space-y-4 text-sm font-bold">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center gap-2 hover:text-white transition-all duration-300">
                                        <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-nepal-gold" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Elite Contact Info */}
                    <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <span className="w-4 h-[2px] bg-nepal-gold" />
                            Headquarters
                        </h4>
                        <ul className="space-y-6 text-sm">
                            <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-nepal-gold/20 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-nepal-gold/10 flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-nepal-gold" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Address</span>
                                    <span className="text-white font-bold leading-tight">Kalikasthan, Kathmandu, Nepal</span>
                                </div>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-nepal-gold/10 flex items-center justify-center shrink-0">
                                    <Phone size={18} className="text-nepal-gold" />
                                </div>
                                <span className="text-white font-bold">+977-1-4429660</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-nepal-gold/10 flex items-center justify-center shrink-0">
                                    <Mail size={18} className="text-nepal-gold" />
                                </div>
                                <span className="text-white font-bold">support@immigration.gov.np</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-4 text-slate-500">
                        <p>© {new Date().getFullYear()} Dept. of Immigration, Nepal</p>
                        <span className="w-1 h-1 rounded-full bg-slate-800" />
                        <span className="flex items-center gap-1.5 transition-colors hover:text-nepal-gold cursor-pointer">
                            <Activity size={12} className="text-emerald-500" />
                            System Status: Operational
                        </span>
                    </div>

                    <div className="flex items-center gap-8">
                        <Link href="#" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/60">
                            <Globe size={14} />
                            <span>EN / NEPAL</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
