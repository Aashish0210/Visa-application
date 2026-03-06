"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────
   Slide data — 4K cinematic Nepal images
───────────────────────────────────────────── */
const heroSlides = [
    {
        image: '/images/hero_himalayas_4k.jpg',
        headline: 'Nepal Long-Term',
        accent: 'Visa Application',
        sub: 'Travel to Nepal',
        panX: '-2%',
        panY: '-1%',
    },
    {
        image: '/images/hero_golden_triangle_4k.jpg',
        headline: 'Gateway to the',
        accent: 'Himalayas',
        sub: 'Travel to Nepal',
        panX: '2%',
        panY: '-1.5%',
    },
    {
        image: '/images/hero_boudhanath_4k.webp',
        headline: 'Rich Cultural',
        accent: 'Heritage',
        sub: 'Travel to Nepal',
        panX: '-1.5%',
        panY: '1%',
    },
    {
        image: '/images/hero_patan_4k.jpg',
        headline: 'Ancient Land,',
        accent: 'Modern Portal',
        sub: 'Travel to Nepal',
        panX: '1%',
        panY: '-2%',
    },
];

const SLIDE_DURATION = 7000; // ms per slide

/* ─────────────────────────────────────────────
   Image crossfade variants
───────────────────────────────────────────── */
const imgVariants = {
    enter: { opacity: 0 },
    center: {
        opacity: 1,
        transition: { duration: 2, ease: [0.23, 1, 0.32, 1] },
    },
    exit: {
        opacity: 0,
        transition: { duration: 1.8, ease: [0.23, 1, 0.32, 1] },
    },
};

/* ─────────────────────────────────────────────
   Headline text variants (blur-slide)
───────────────────────────────────────────── */
const headlineVariants = {
    enter: { opacity: 0, y: 30, filter: 'blur(10px)' },
    center: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 1, ease: [0.23, 1, 0.32, 1] },
    },
    exit: {
        opacity: 0,
        y: -20,
        filter: 'blur(8px)',
        transition: { duration: 0.6, ease: 'easeIn' },
    },
};

/* ─────────────────────────────────────────────
   Slow Ken-Burns "live video" keyframe
   Each slide gets its own pan direction so it
   looks like different camera footage.
───────────────────────────────────────────── */
const kenBurns = (panX: string, panY: string) => ({
    initial: { scale: 1.0, x: 0, y: 0 },
    animate: {
        scale: 1.12,
        x: panX,
        y: panY,
        transition: {
            duration: SLIDE_DURATION / 1000 + 1,
            ease: "linear",
        },
    },
});

/* ─────────────────────────────────────────────
   HERO COMPONENT
───────────────────────────────────────────── */
const Hero = () => {
    const [current, setCurrent] = useState(0);
    const [mounted, setMounted] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const goNext = useCallback(() => {
        setCurrent(c => (c + 1) % heroSlides.length);
    }, []);

    const goPrev = useCallback(() => {
        setCurrent(c => (c - 1 + heroSlides.length) % heroSlides.length);
    }, []);

    const goTo = useCallback((idx: number) => {
        setCurrent(idx);
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Always-running interval — no pause on hover, loops forever
    useEffect(() => {
        intervalRef.current = setInterval(goNext, SLIDE_DURATION);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [goNext]);

    // Jump to specific slide: restart the interval so timing stays consistent
    const goToWithReset = useCallback((idx: number) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setCurrent(idx);
        intervalRef.current = setInterval(goNext, SLIDE_DURATION);
    }, [goNext]);

    const slide = heroSlides[current];

    return (
        <section
            className="relative min-h-screen flex items-center overflow-hidden bg-slate-950"
        >

            {/* ════════════════════════════════════════
                BACKGROUND SLIDESHOW
                AnimatePresence mode="sync" lets new
                slide fade in while old one fades out
                simultaneously — true crossfade.
            ════════════════════════════════════════ */}
            <AnimatePresence mode="sync">
                <motion.div
                    key={`bg-${current}`}
                    variants={imgVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                    style={{ zIndex: 1 }}
                >
                    {/* Ken-Burns motion wrapper — slow cinematic pan+zoom */}
                    <motion.div
                        className="absolute inset-0 will-change-transform"
                        key={`kb-${current}`}
                        {...kenBurns(slide.panX, slide.panY)}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.headline}
                            fill
                            sizes="100vw"
                            className="object-cover"
                            priority={current === 0}
                            loading={current === 0 ? 'eager' : 'lazy'}
                            quality={100}
                        />
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* ════════════════════════════════════════
                OVERLAY STACK
            ════════════════════════════════════════ */}
            {/* Base darkening */}
            <div className="absolute inset-0 z-10 bg-slate-950/40" />
            {/* Left-heavy gradient for text legibility */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
            {/* Top vignette */}
            <div className="absolute top-0 inset-x-0 h-44 z-10 bg-gradient-to-b from-slate-950/60 to-transparent" />
            {/* Bottom fade into darkness — Merge with next section */}
            <div className="absolute bottom-0 inset-x-0 h-40 z-10 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* ════════════════════════════════════════
                MAIN CONTENT
            ════════════════════════════════════════ */}
            <div className="container mx-auto px-6 relative z-20 pt-20 lg:pt-28 pb-32 lg:pb-36">


                {/* CONTENT OVERLAY — text & primary CTAs */}
                <div className="relative z-[15] h-full pointer-events-none">
                    <div className="container mx-auto px-6 h-full flex flex-col justify-center">
                        <div className="max-w-4xl space-y-12 lg:space-y-12 pt-8 lg:pt-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    variants={headlineVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="space-y-4"
                                >

                                    <h1 className="text-3xl md:text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
                                        {heroSlides[current].headline}
                                        <span className="block text-nepal-gold mt-2 uppercase italic text-2xl md:text-5xl lg:text-7xl">{heroSlides[current].accent}</span>
                                    </h1>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex flex-col md:flex-row flex-wrap gap-5 pt-12 md:pt-6 pointer-events-auto">
                                <Link
                                    href="/apply"
                                    className="bg-nepal-gold text-nepal-navy px-8 lg:px-10 py-4 lg:py-5 rounded-xl font-black text-sm lg:text-base uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(212,160,23,0.4)] flex items-center justify-center md:justify-start gap-3 active:scale-95 group w-full md:w-auto"
                                >
                                    Apply Now
                                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                                </Link>
                                <Link
                                    href="/track"
                                    className="bg-white/5 backdrop-blur-2xl border border-white/10 text-white px-8 lg:px-10 py-4 lg:py-5 rounded-xl font-black text-sm lg:text-base uppercase tracking-widest hover:bg-white/20 transition-all duration-500 flex items-center justify-center md:justify-start gap-3 active:scale-95 w-full md:w-auto"
                                >
                                    Track Status
                                    <Clock size={18} />
                                </Link>
                            </div>

                            <div className="flex items-center gap-8 pt-12 lg:pt-12 border-t border-white/10 max-w-lg">
                                <div className="flex flex-col">
                                    <span className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">Processing Time</span>
                                    <span className="text-white text-xl font-black tracking-tight">72 Hours <span className="text-nepal-gold">*</span></span>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div className="flex flex-col">
                                    <span className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">Safe & Secure</span>
                                    <span className="text-white text-xl font-black tracking-tight">Official</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
                SLIDE INDICATORS  (animated fill bars)
            ════════════════════════════════════════ */}
            <div className="absolute bottom-10 inset-x-0 z-20 hidden md:flex items-center justify-center gap-2">
                {heroSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToWithReset(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className="relative h-[3px] rounded-full overflow-hidden bg-white/25 hover:bg-white/40 transition-all duration-500"
                        style={{ width: i === current ? 44 : 14 }}
                    >
                        {i === current && (
                            <motion.span
                                key={`bar-${current}`}
                                className="absolute inset-y-0 left-0 bg-white rounded-full"
                                initial={{ scaleX: 0, originX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
                                style={{ transformOrigin: 'left', width: '100%' }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* ════════════════════════════════════════
                ARROW CONTROLS
            ════════════════════════════════════════ */}
            {/* ── Center Arrows (Desktop & Mobile) ── */}
            <button
                onClick={goPrev}
                aria-label="Previous slide"
                className="flex absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full items-center justify-center text-white hover:bg-white/20 hover:scale-110 hover:border-nepal-gold/50 transition-all duration-500 shadow-2xl group"
            >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
                onClick={goNext}
                aria-label="Next slide"
                className="flex absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full items-center justify-center text-white hover:bg-white/20 hover:scale-110 hover:border-nepal-gold/50 transition-all duration-500 shadow-2xl group"
            >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* ── Mobile Bottom Indicators ── */}
            <div className="absolute bottom-28 inset-x-0 z-20 flex md:hidden items-center justify-center gap-2">
                {heroSlides.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-nepal-gold shadow-[0_0_15px_rgba(212,160,23,0.5)]' : 'w-2 bg-white/20'}`}
                    />
                ))}
            </div>

            {/* ════════════════════════════════════════
                FLOATING PIPELINE CARD
            ════════════════════════════════════════ */}
            <div className="absolute bottom-24 right-8 z-20 hidden lg:block">
                <div className="bg-slate-900/85 backdrop-blur-md border border-white/12 rounded-xl p-5 text-white w-64 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm uppercase tracking-widest text-white/50 font-bold">Active Visas</span>
                        <span className="flex items-center space-x-1.5 text-green-400 text-sm font-semibold">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                            <span>Live</span>
                        </span>
                    </div>
                    {[
                        { label: 'Working Visa', pct: 82, color: 'bg-blue-500' },
                        { label: 'Study Visa', pct: 65, color: 'bg-purple-500' },
                        { label: 'Residential Visa', pct: 48, color: 'bg-emerald-500' },
                    ].map((item, idx) => (
                        <div key={item.label} className="mb-3">
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-white/65">{item.label}</span>
                                <span className="font-bold">{item.pct}%</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${item.color} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.pct}%` }}
                                    transition={{ duration: 1.2, delay: 0.3 + idx * 0.15, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    ))}
                    <p className="text-white/30 text-sm mt-4 text-center">Applications in progress today</p>
                </div>
            </div>
        </section>
    );
};

export default Hero;
