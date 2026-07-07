import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Soundscape } from '../types';
import * as Icons from 'lucide-react';

interface ZenWorkspaceProps {
  soundscapes: Soundscape[];
  masterVolume: number;
  onMasterVolumeChange: (vol: number) => void;
  isPlaying: boolean;
  onPlayPauseToggle: (playing: boolean) => void;
  onExitZen: () => void;
}

export default function ZenWorkspace({
  soundscapes,
  masterVolume,
  onMasterVolumeChange,
  isPlaying,
  onPlayPauseToggle,
  onExitZen,
}: ZenWorkspaceProps) {
  const [time, setTime] = useState(new Date());
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathDuration, setBreathDuration] = useState(4); // seconds
  const [breathCounter, setBreathCounter] = useState(0);

  // Time Tracker
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Breathing Guide Loop (Inhale: 4s, Hold: 4s, Exhale: 4s)
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathCounter((prev) => {
        const next = prev + 1;
        if (next >= breathDuration) {
          setBreathPhase((current) => {
            if (current === 'Inhale') return 'Hold';
            if (current === 'Hold') return 'Exhale';
            return 'Inhale';
          });
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathDuration]);

  // Format local digital clock
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  // Get current active sounds
  const activeSounds = soundscapes.filter(s => s.isPlaying);

  return (
    <div id="zen-mode-workspace" className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Ambient background aura glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-950/20 rounded-full blur-[120px] transition-all duration-1000" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-purple-950/20 rounded-full blur-[120px] transition-all duration-1000" />
        
        {/* Floating dust/stars particles */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Header controls */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.15)]">
            <span className="text-indigo-400 text-sm font-bold">V</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 tracking-widest uppercase">Volum Zen Workspace</span>
        </div>

        <button
          onClick={onExitZen}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-lg"
        >
          <Icons.Minimize2 className="w-3.5 h-3.5 text-slate-400 group-hover:scale-90 transition-transform" />
          <span>Exit Workspace</span>
        </button>
      </header>

      {/* Centerpiece: Time & Breathing Orb */}
      <main className="relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-lg mx-auto">
        {/* Digital Clock */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-light tracking-tight font-mono text-white">
            {formattedTime}
          </h1>
          <p className="text-sm font-semibold text-indigo-400 mt-2 font-mono uppercase tracking-widest">
            {formattedDate}
          </p>
        </motion.div>

        {/* Dynamic Breathing Orb */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-10">
          {/* Breathing aura circles */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={breathPhase}
              animate={{
                scale: breathPhase === 'Inhale' ? 1.6 : breathPhase === 'Hold' ? 1.6 : 1.0,
                opacity: breathPhase === 'Inhale' ? [0.1, 0.45] : breathPhase === 'Hold' ? 0.45 : [0.45, 0.1],
              }}
              transition={{ duration: breathDuration, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-indigo-500/15 blur-md"
            />
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={`outer-${breathPhase}`}
              animate={{
                scale: breathPhase === 'Inhale' ? 1.3 : breathPhase === 'Hold' ? 1.3 : 1.0,
                opacity: breathPhase === 'Inhale' ? [0.1, 0.3] : breathPhase === 'Hold' ? 0.3 : [0.3, 0.1],
              }}
              transition={{ duration: breathDuration, ease: "easeInOut" }}
              className="absolute inset-8 rounded-full bg-purple-500/10 blur-xs"
            />
          </AnimatePresence>

          {/* Solid Core Ring */}
          <motion.div 
            animate={{
              scale: breathPhase === 'Inhale' ? 1.2 : breathPhase === 'Hold' ? 1.2 : 0.95,
            }}
            transition={{ duration: breathDuration, ease: "easeInOut" }}
            className="w-32 h-32 rounded-full border border-indigo-500/30 bg-slate-950 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.2)]"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
              Breath
            </span>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300 mt-1">
              {breathPhase}
            </span>
            <span className="text-[10px] font-mono text-slate-500 mt-0.5">
              {breathDuration - breathCounter}s
            </span>
          </motion.div>
        </div>

        {/* Mini Active Feed List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap justify-center gap-2 max-w-md"
        >
          {activeSounds.length === 0 ? (
            <span className="text-xs font-mono text-slate-500 italic">No ambient sounds active</span>
          ) : (
            activeSounds.map(s => (
              <span 
                key={s.id} 
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                {s.name}
              </span>
            ))
          )}
        </motion.div>
      </main>

      {/* Minimal Footer controls */}
      <footer className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/5 pt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPlayPauseToggle(!isPlaying)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-lg ${
              isPlaying 
                ? 'bg-slate-800 text-white hover:bg-slate-700 border border-white/10' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 shadow-[0_0_15px_rgba(99,102,241,0.35)]'
            }`}
          >
            {isPlaying ? <Icons.Pause className="w-5 h-5" /> : <Icons.Play className="w-5 h-5 fill-white" />}
          </button>
          
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Acoustic Gain</span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold">{masterVolume}%</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => onMasterVolumeChange(parseInt(e.target.value))}
                className="w-36 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Breathing Speed Control */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Tempo:</span>
          {([3, 4, 6] as const).map(sec => (
            <button
              key={sec}
              onClick={() => {
                setBreathDuration(sec);
                setBreathCounter(0);
                setBreathPhase('Inhale');
              }}
              className={`px-2.5 py-1 rounded border cursor-pointer transition-colors ${
                breathDuration === sec
                  ? 'border-indigo-500 bg-indigo-950/20 text-indigo-400 font-bold'
                  : 'border-white/5 bg-white/5 text-slate-500 hover:text-slate-300'
              }`}
            >
              {sec}s
            </button>
          ))}
          <span className="ml-1 text-[10px] text-slate-500">interval</span>
        </div>

        <div className="text-[10px] font-mono text-slate-500 text-right">
          Press "Esc" or click Exit to restore full panels.
        </div>
      </footer>
    </div>
  );
}
