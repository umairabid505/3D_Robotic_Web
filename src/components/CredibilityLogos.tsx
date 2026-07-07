import { motion } from 'motion/react';
import { brandLogos } from '../mockData';
import { ShieldCheck, Cpu, Radio, Sparkles } from 'lucide-react';

export default function CredibilityLogos() {
  return (
    <div id="credibility-section" className="py-20 border-y border-white/5 bg-slate-950/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide mb-3"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Studio Grade Authenticity</span>
          </motion.div>
          <h3 className="text-sm font-semibold tracking-widest text-slate-400 uppercase">
            Acoustically Calibrated with Industry leaders
          </h3>
        </div>

        {/* Scrolling Banner */}
        <div className="relative w-full overflow-hidden select-none">
          {/* Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-8 overflow-x-auto py-4 scrollbar-none scroll-smooth [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
            <motion.div 
              className="flex gap-12 shrink-0 pr-12 min-w-full justify-around items-center"
              animate={{ x: [0, -100] }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            >
              {brandLogos.map((brand, idx) => (
                <div 
                  key={`${brand.name}-first-${idx}`} 
                  className="flex items-center gap-3.5 grayscale hover:grayscale-0 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all">
                    <span className="text-lg">{brand.symbol}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-300 tracking-tight group-hover:text-white transition-colors">
                      {brand.name}
                    </p>
                    <p className="text-[10px] text-indigo-400 font-mono">
                      {brand.sector}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Repeated for Infinite Look */}
            <motion.div 
              className="flex gap-12 shrink-0 pr-12 min-w-full justify-around items-center"
              aria-hidden="true"
              animate={{ x: [0, -100] }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            >
              {brandLogos.map((brand, idx) => (
                <div 
                  key={`${brand.name}-second-${idx}`} 
                  className="flex items-center gap-3.5 grayscale hover:grayscale-0 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all">
                    <span className="text-lg">{brand.symbol}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-300 tracking-tight group-hover:text-white transition-colors">
                      {brand.name}
                    </p>
                    <p className="text-[10px] text-indigo-400 font-mono">
                      {brand.sector}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Feature Highlights beneath logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-10 border-t border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Binaural Real-time Mix</p>
              <p className="text-[11px] text-slate-400">Lag-free frequency generation</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Zero compressed audio</p>
              <p className="text-[11px] text-slate-400">PCM raw wave mechanics</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.15)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">True-phase separation</p>
              <p className="text-[11px] text-slate-400">Precise left-right split</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Ear-Safety Threshold</p>
              <p className="text-[11px] text-slate-400">Capped sound pressure level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
