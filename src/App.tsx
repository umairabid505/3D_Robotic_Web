import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Soundscape } from './types';
import { initialSoundscapes } from './mockData';

// Component Imports
import SoundscapeMixer from './components/SoundscapeMixer';
import CredibilityLogos from './components/CredibilityLogos';
import ValueProposition from './components/ValueProposition';
import Testimonials from './components/Testimonials';
import RecentStories from './components/RecentStories';
import BetaSignup from './components/BetaSignup';
import ZenWorkspace from './components/ZenWorkspace';

import { Sparkles, Sliders, Volume2, ArrowRight, Eye, RefreshCw, Layers, Compass, HelpCircle } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import robotImage from './images/robot.png';

export default function App() {
  const [soundscapes, setSoundscapes] = useState<Soundscape[]>(initialSoundscapes);
  const [masterVolume, setMasterVolume] = useState<number>(70);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [activeFavoriteSound, setActiveFavoriteSound] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [robotInView, setRobotInView] = useState<boolean>(true);
  const robotRef = useRef<HTMLDivElement>(null);

  // Detect mobile screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint is 1024px in Tailwind
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // IntersectionObserver to unmount Spline when scrolled off-screen
  useEffect(() => {
    if (!robotRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setRobotInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(robotRef.current);
    return () => observer.disconnect();
  }, []);

  // Esc Key support to exit Zen / Blank Page Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode]);

  // Handle active preset applied from a testimonial click
  const handleApplyTestimonialPreset = (soundIds: string[], volumes: number[]) => {
    setIsPlaying(true);
    const updated = soundscapes.map(sound => {
      const idx = soundIds.indexOf(sound.id);
      if (idx !== -1) {
        return { ...sound, isPlaying: true, volume: volumes[idx] };
      }
      return { ...sound, isPlaying: false };
    });
    setSoundscapes(updated);

    // Track active favorite setup to show "Loaded" feedback badge
    if (soundIds.includes('binaural') && soundIds.includes('wind')) {
      setActiveFavoriteSound('Binaural Focus Alpha + Alpine Wind');
    } else if (soundIds.includes('rain') && soundIds.includes('keyboard')) {
      setActiveFavoriteSound('Deep Forest Rain + Mechanical ASMR');
    } else if (soundIds.includes('pinknoise')) {
      setActiveFavoriteSound('Cosmic Pink Noise at 40Hz');
    }

    // Scroll smoothly to mixer to see the change
    const mixerConsole = document.getElementById('mixer-anchor');
    if (mixerConsole) {
      mixerConsole.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset loaded badge when soundscape is altered manually in mixer
  const handleSoundscapeChange = (updated: Soundscape[]) => {
    setSoundscapes(updated);
    setActiveFavoriteSound(null);
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white transition-colors duration-300 font-sans selection:bg-indigo-500/25 selection:text-indigo-200">
      <AnimatePresence mode="wait">
        {isZenMode ? (
          <motion.div
            key="zen-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <ZenWorkspace
              soundscapes={soundscapes}
              masterVolume={masterVolume}
              onMasterVolumeChange={setMasterVolume}
              isPlaying={isPlaying}
              onPlayPauseToggle={setIsPlaying}
              onExitZen={() => setIsZenMode(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col"
          >
            {/* Top Navigation Banner */}
            <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Branding */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    V
                  </div>
                  <div>
                    <span className="text-base font-extrabold text-white tracking-tight block leading-tight">
                      Volum
                    </span>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
                      Acoustic Workspace
                    </span>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-6">
                  <button 
                    onClick={() => handleScrollToSection('mixer-anchor')}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Console
                  </button>
                  <button 
                    onClick={() => handleScrollToSection('credibility-section')}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Partners
                  </button>
                  <button 
                    onClick={() => handleScrollToSection('value-prop-section')}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Auditory Science
                  </button>
                  <button 
                    onClick={() => handleScrollToSection('testimonials-section')}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Reviews
                  </button>
                </nav>

                {/* Right hand Action buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsZenMode(true)}
                    className="group px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-xs tracking-tight transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-105 transition-transform" />
                    <span>Enter Blank Page</span>
                  </button>

                  <button 
                    onClick={() => handleScrollToSection('signup-section')}
                    className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-semibold text-xs tracking-tight transition-colors cursor-pointer"
                  >
                    Request Node Access
                  </button>
                </div>
              </div>
            </header>

            {/* 3D Robot Hero Section */}
            <section className="relative w-full min-h-[60vh] z-10 mt-12 mb-8 flex items-center">
              {/* Background Adjustment */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-3xl mx-4" />
              
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full relative z-10">
                {/* Left Side Copy */}
                <div className="space-y-6 text-left order-2 lg:order-1">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Next-Gen Interactive Companion</span>
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight"
                  >
                    Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Digital Buddy</span> <br className="hidden md:inline" />
                    awaits.
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-base md:text-lg text-slate-400 leading-relaxed font-normal"
                  >
                    Interact with a fully responsive 3D robot companion right in your workspace. Hover, click, and play around to see it react while you listen to your favorite focus soundscapes.
                  </motion.p>
                </div>

                {/* Right Side Robot */}
                <div ref={robotRef} className="h-[400px] sm:h-[500px] w-full relative order-1 lg:order-2">
                  {/* Glowing backdrop for the robot */}
                  <div className="absolute inset-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-[80px] rounded-full pointer-events-none" />
                  {isMobile || !robotInView ? (
                    <img 
                      src={robotImage} 
                      alt="Robot Companion" 
                      className="w-full h-full object-contain relative z-10 animate-pulse duration-[4000ms]" 
                    />
                  ) : (
                    <Spline scene="https://prod.spline.design/bldIU7HCNbZAvK3N/scene.splinecode" className="w-full h-full relative z-10" />
                  )}
                </div>
              </div>
            </section>

            {/* Hero & Intro Section */}
            <section className="relative pb-20 pt-8 overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                {/* Left hand intro copy */}
                <div className="lg:col-span-5 space-y-6 text-left">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Focus Acoustics 1.0 Available</span>
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 leading-[1.08] tracking-tight"
                  >
                    Your mind, <br className="hidden md:inline" />
                    fully shielded.
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm md:text-base text-slate-400 leading-relaxed font-normal"
                  >
                    Volum uses real-time binaural frequency splitting and ambient sound faders to mask disruptive environmental audio, locking in flow-state for deep work.
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center gap-4 pt-2"
                  >
                    <button
                      onClick={() => handleScrollToSection('mixer-anchor')}
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Launch Interactive Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsZenMode(true)}
                      className="px-6 py-3.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Zen Mode (Blank Canvas)
                    </button>
                  </motion.div>
                  
                  {/* Small metadata stats */}
                  <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xl font-bold text-white font-mono">10Hz</p>
                      <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider font-bold">Alpha Carrier</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white font-mono">100%</p>
                      <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider font-bold">Client-Side DSP</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white font-mono">0ms</p>
                      <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider font-bold">Latency Delay</p>
                    </div>
                  </div>
                </div>

                {/* Right hand Interactive Mixer preview */}
                <div id="mixer-anchor" className="lg:col-span-7">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    className="relative"
                  >
                    {/* Atmospheric decorative glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-15 blur-[60px] rounded-3xl pointer-events-none" />
                    <SoundscapeMixer
                      soundscapes={soundscapes}
                      onSoundscapeChange={handleSoundscapeChange}
                      masterVolume={masterVolume}
                      onMasterVolumeChange={setMasterVolume}
                      isPlaying={isPlaying}
                      onPlayPauseToggle={setIsPlaying}
                    />
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Credibility Partners Segment */}
            <CredibilityLogos />

            {/* Auditory Science Bento/Value Proposition */}
            <ValueProposition />

            {/* Recent Stories — video story row */}
            <RecentStories />

            {/* Testimonials with dynamic configuration injection */}
            <Testimonials 
              onApplyPreset={handleApplyTestimonialPreset} 
              activeFavoriteSound={activeFavoriteSound}
            />

            {/* Beta Signup Form */}
            <BetaSignup />

            {/* Standard elegant footer */}
            <footer className="bg-slate-950 border-t border-white/5 py-12 text-center text-slate-500 font-mono text-xs">
              <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center font-bold text-[10px]">
                    V
                  </div>
                  <span className="font-semibold text-slate-300 font-sans text-sm tracking-tight">Volum</span>
                  <span className="text-[10px] text-slate-600">v1.0.4-beta</span>
                </div>
                
                <div>
                  © {new Date().getFullYear()} Volum Acoustic Technologies. All rights reserved.
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleScrollToSection('mixer-anchor')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Mixer Console
                  </button>
                  <span>•</span>
                  <button 
                    onClick={() => setIsZenMode(true)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Zen Workspace
                  </button>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
