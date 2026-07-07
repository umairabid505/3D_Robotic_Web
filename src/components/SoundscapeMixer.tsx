import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Soundscape } from '../types';
import { initialSoundscapes } from '../mockData';
import * as Icons from 'lucide-react';

interface SoundscapeMixerProps {
  soundscapes: Soundscape[];
  onSoundscapeChange: (updated: Soundscape[]) => void;
  masterVolume: number;
  onMasterVolumeChange: (vol: number) => void;
  isPlaying: boolean;
  onPlayPauseToggle: (playing: boolean) => void;
}

// Icon mapper to ensure strict TypeScript checks and zero dynamic import bugs
const SoundIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'CloudRain': return <Icons.CloudRain className={className} />;
    case 'Waves': return <Icons.Waves className={className} />;
    case 'Coffee': return <Icons.Coffee className={className} />;
    case 'Radio': return <Icons.Radio className={className} />;
    case 'Keyboard': return <Icons.Keyboard className={className} />;
    case 'Wind': return <Icons.Wind className={className} />;
    default: return <Icons.Volume2 className={className} />;
  }
};

export default function SoundscapeMixer({
  soundscapes,
  onSoundscapeChange,
  masterVolume,
  onMasterVolumeChange,
  isPlaying,
  onPlayPauseToggle,
}: SoundscapeMixerProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'natural' | 'synthetic' | 'urban'>('all');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const visualizerBars = 32;
  const [barHeights, setBarHeights] = useState<number[]>(new Array(visualizerBars).fill(10));
  const animationRef = useRef<number | null>(null);

  // Dynamic sound spectrum visualizer simulation
  useEffect(() => {
    if (!isPlaying) {
      setBarHeights(new Array(visualizerBars).fill(5));
      return;
    }

    // Calculate overall activity based on enabled channels and their individual volumes
    const activeChannels = soundscapes.filter(s => s.isPlaying);
    const activityWeight = activeChannels.reduce((acc, curr) => acc + (curr.volume / 100), 0) / (soundscapes.length || 1);
    const masterScale = masterVolume / 100;

    let tick = 0;
    const animate = () => {
      tick += 0.05;
      const newHeights = barHeights.map((_, i) => {
        // Base bounce frequency and randomness
        const soundFrequencyEffect = activeChannels.length > 0 
          ? Math.sin(tick + i * 0.3) * 40 * activityWeight * masterScale
          : Math.sin(tick + i * 0.1) * 8 * masterScale;

        const noise = Math.random() * 25 * (activityWeight > 0 ? activityWeight : 0.2) * masterScale;
        const finalHeight = Math.max(8, Math.min(95, 30 + soundFrequencyEffect + noise));
        return finalHeight;
      });

      setBarHeights(newHeights);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, soundscapes, masterVolume]);

  // Audio simulation synth state
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<{ [key: string]: { osc: OscillatorNode; gain: GainNode } }>({});

  // Web Audio Synth for Binaural sound and Rain noise hum
  const handleToggleAudioEngine = (sound: Soundscape) => {
    // If browser supports and permits Web Audio
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (sound.isPlaying && isPlaying) {
        // Create oscillator/noise source if not exists
        if (!oscillatorsRef.current[sound.id]) {
          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          
          if (sound.id === 'binaural') {
            // Setup beautiful binaural beats (Left: 200Hz, Right: 210Hz)
            const oscL = ctx.createOscillator();
            const oscR = ctx.createOscillator();
            const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
            const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

            oscL.frequency.value = 200; // Carrier
            oscR.frequency.value = 210; // Binaural Alpha (10Hz difference)

            if (pannerL && pannerR) {
              pannerL.pan.value = -1;
              pannerR.pan.value = 1;
              oscL.connect(pannerL).connect(gainNode);
              oscR.connect(pannerR).connect(gainNode);
            } else {
              oscL.connect(gainNode);
              oscR.connect(gainNode);
            }

            oscL.start();
            oscR.start();
            oscillatorsRef.current[sound.id] = { osc: oscL, gain: gainNode } as any; // simplified storage
          } else {
            // Ambient low harmonic sweep
            const osc = ctx.createOscillator();
            osc.type = sound.id === 'pinknoise' ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(sound.id === 'rain' ? 85 : 120, ctx.currentTime);
            
            // Subtle LFO
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.value = 0.25; // 0.25Hz sweep
            lfoGain.gain.value = 15;
            
            lfo.connect(lfoGain).connect(osc.frequency);
            osc.connect(gainNode);
            
            lfo.start();
            osc.start();
            oscillatorsRef.current[sound.id] = { osc, gain: gainNode };
          }
          
          gainNode.connect(ctx.destination);
        }

        // Set target gain based on individual level and master level
        const volumeCoeff = (sound.volume / 100) * (masterVolume / 100);
        oscillatorsRef.current[sound.id].gain.gain.setTargetAtTime(volumeCoeff * 0.15, ctx.currentTime, 0.2);
      } else {
        // Fade out synth if it exists
        if (oscillatorsRef.current[sound.id]) {
          oscillatorsRef.current[sound.id].gain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
        }
      }
    } catch (e) {
      console.warn('Audio synthesis not supported or blocked in iframe sandbox context.', e);
    }
  };

  // Keep synth volumes synched to react state
  useEffect(() => {
    soundscapes.forEach(sound => {
      if (oscillatorsRef.current[sound.id]) {
        try {
          const volumeCoeff = (sound.volume / 100) * (masterVolume / 100) * (isPlaying && sound.isPlaying ? 1 : 0);
          oscillatorsRef.current[sound.id].gain.gain.setTargetAtTime(volumeCoeff * 0.15, audioContextRef.current?.currentTime || 0, 0.15);
        } catch (e) {}
      }
    });
  }, [soundscapes, masterVolume, isPlaying]);

  // Handle individual slider change
  const handleVolumeChange = (id: string, newVolume: number) => {
    setActivePreset(null);
    const updated = soundscapes.map(sound => {
      if (sound.id === id) {
        const changed = { ...sound, volume: newVolume };
        if (newVolume > 0 && !sound.isPlaying) {
          changed.isPlaying = true;
        } else if (newVolume === 0 && sound.isPlaying) {
          changed.isPlaying = false;
        }
        return changed;
      }
      return sound;
    });
    onSoundscapeChange(updated);
  };

  // Handle active channel toggle
  const handleToggleSound = (id: string) => {
    setActivePreset(null);
    const updated = soundscapes.map(sound => {
      if (sound.id === id) {
        const nextState = !sound.isPlaying;
        const nextVolume = nextState && sound.volume === 0 ? 50 : sound.volume;
        const changed = { ...sound, isPlaying: nextState, volume: nextVolume };
        setTimeout(() => handleToggleAudioEngine(changed), 20);
        return changed;
      }
      return sound;
    });
    onSoundscapeChange(updated);
  };

  // Master Preset configurations
  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    onPlayPauseToggle(true);
    let updated = [...soundscapes];
    
    switch (presetName) {
      case 'deep-focus':
        updated = soundscapes.map(s => {
          if (s.id === 'binaural') return { ...s, isPlaying: true, volume: 80 };
          if (s.id === 'keyboard') return { ...s, isPlaying: true, volume: 25 };
          return { ...s, isPlaying: false, volume: s.volume };
        });
        break;
      case 'rainy-writing':
        updated = soundscapes.map(s => {
          if (s.id === 'rain') return { ...s, isPlaying: true, volume: 75 };
          if (s.id === 'keyboard') return { ...s, isPlaying: true, volume: 45 };
          return { ...s, isPlaying: false, volume: s.volume };
        });
        break;
      case 'cafe-warmth':
        updated = soundscapes.map(s => {
          if (s.id === 'cafe') return { ...s, isPlaying: true, volume: 65 };
          if (s.id === 'rain') return { ...s, isPlaying: true, volume: 30 };
          return { ...s, isPlaying: false, volume: s.volume };
        });
        break;
      case 'cosmic-zen':
        updated = soundscapes.map(s => {
          if (s.id === 'pinknoise') return { ...s, isPlaying: true, volume: 55 };
          if (s.id === 'wind') return { ...s, isPlaying: true, volume: 40 };
          return { ...s, isPlaying: false, volume: s.volume };
        });
        break;
      case 'mute-all':
        updated = soundscapes.map(s => ({ ...s, isPlaying: false }));
        setActivePreset(null);
        break;
    }
    onSoundscapeChange(updated);
  };

  const filteredSoundscapes = soundscapes.filter(sound => {
    if (activeCategory === 'all') return true;
    return sound.category === activeCategory;
  });

  return (
    <div id="soundscape-mixer-console" className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.15)] p-6 md:p-8">
      {/* Visualizer Panel */}
      <div className="relative h-28 w-full bg-slate-950 rounded-2xl overflow-hidden p-4 flex flex-col justify-between mb-8 border border-white/5 shadow-2xl">
        {/* Decorative Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPlaying ? 'bg-indigo-400' : 'bg-pink-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-indigo-500' : 'bg-pink-500'}`} />
            </span>
            <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              {isPlaying ? 'Acoustic Feed Active' : 'System Suspended'}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Hz Frequency Analysis (Real-time)
          </div>
        </div>

        {/* The Audio Wave Bars */}
        <div className="relative z-10 h-10 flex items-end justify-between gap-[2px] md:gap-[3px]">
          {barHeights.map((height, idx) => (
            <div
              key={idx}
              className={`w-full rounded-xs transition-all duration-75 ${
                isPlaying 
                  ? 'bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]' 
                  : 'bg-slate-900'
              }`}
              style={{ 
                height: `${height}%`,
                opacity: isPlaying ? 0.5 + (height / 150) : 0.2
              }}
            />
          ))}
        </div>
      </div>

      {/* Mixer Header Control Unit */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-400 tracking-tight">
            Soundscape Console
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Craft your custom focus environment with raw phase mixing
          </p>
        </div>

        {/* Master Play Button & Master Volume Slider */}
        <div className="flex items-center gap-4 bg-slate-950/50 backdrop-blur-md p-2.5 rounded-2xl border border-white/5">
          <button
            onClick={() => onPlayPauseToggle(!isPlaying)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-lg cursor-pointer ${
              isPlaying 
                ? 'bg-slate-800 text-white hover:bg-slate-700 border border-white/10' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 shadow-[0_0_20px_rgba(99,102,241,0.35)]'
            }`}
          >
            {isPlaying ? <Icons.Pause className="w-5 h-5" /> : <Icons.Play className="w-5 h-5 fill-white" />}
          </button>
          
          <div className="flex flex-col pr-2">
            <div className="flex items-center justify-between gap-6 mb-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Master Volume</span>
              <span className="text-[10px] font-mono font-bold text-indigo-400">{masterVolume}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.VolumeX className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => onMasterVolumeChange(parseInt(e.target.value))}
                className="w-28 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <Icons.Volume2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Presets Row */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Presets */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-slate-400 mr-1.5">Presets:</span>
          <button 
            onClick={() => applyPreset('deep-focus')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
              activePreset === 'deep-focus'
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            🧠 Deep Focus
          </button>
          <button 
            onClick={() => applyPreset('rainy-writing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
              activePreset === 'rainy-writing'
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            🌧️ Rainy Writing
          </button>
          <button 
            onClick={() => applyPreset('cafe-warmth')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
              activePreset === 'cafe-warmth'
                ? 'bg-pink-500/20 border-pink-500/40 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            ☕ Cafe Warmth
          </button>
          <button 
            onClick={() => applyPreset('cosmic-zen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
              activePreset === 'cosmic-zen'
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            🌌 Cosmic Zen
          </button>
          <button 
            onClick={() => applyPreset('mute-all')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer ml-auto"
          >
            Reset Mixer
          </button>
        </div>

        {/* Category Toggles */}
        <div className="flex border-b border-white/5">
          {(['all', 'natural', 'synthetic', 'urban'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-bold border-b-2 capitalize transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'border-indigo-500 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Frequencies' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fader Channels List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredSoundscapes.map((sound) => {
            const isSoundActive = sound.isPlaying && isPlaying;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={sound.id}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSoundActive 
                    ? 'bg-white/5 backdrop-blur-md border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.05)]' 
                    : 'bg-slate-950/40 border-white/5'
                }`}
              >
                {/* Channel Label */}
                <div className="flex items-center gap-3.5 min-w-[200px]">
                  <button
                    onClick={() => handleToggleSound(sound.id)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isSoundActive
                        ? `bg-gradient-to-br ${sound.color} text-white shadow-lg shadow-indigo-500/10`
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    <SoundIcon name={sound.iconName} className="w-5 h-5" />
                  </button>
                  <div>
                    <h5 className="text-sm font-bold text-slate-200">
                      {sound.name}
                    </h5>
                    <p className="text-[10px] font-mono text-slate-400">
                      {sound.frequency}
                    </p>
                  </div>
                </div>

                {/* Slider and Fader Track */}
                <div className="flex-1 flex items-center gap-3 max-w-xl">
                  <span className="text-[10px] font-mono text-indigo-400 w-10 text-right font-semibold">
                    {isSoundActive ? 'ACTIVE' : 'MUTED'}
                  </span>
                  <div className="relative flex-1 group">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sound.isPlaying ? sound.volume : 0}
                      onChange={(e) => handleVolumeChange(sound.id, parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    {isSoundActive && (
                      <div 
                        className="absolute h-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 pointer-events-none top-1/2 -translate-y-1/2 left-0"
                        style={{ width: `${sound.volume}%` }}
                      />
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 w-8">
                    {sound.isPlaying ? sound.volume : 0}%
                  </span>
                </div>

                {/* Status Trigger */}
                <button
                  onClick={() => handleToggleSound(sound.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                    isSoundActive
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.15)]'
                      : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {isSoundActive ? 'SOLO' : 'BYPASS'}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
