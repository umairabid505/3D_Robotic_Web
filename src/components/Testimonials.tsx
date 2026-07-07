import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Testimonial } from '../types';
import { testimonialsData } from '../mockData';
import { Star, Headphones, CheckCircle, Quote } from 'lucide-react';

interface TestimonialsProps {
  onApplyPreset: (soundIds: string[], volumes: number[]) => void;
  activeFavoriteSound: string | null;
}

export default function Testimonials({ onApplyPreset, activeFavoriteSound }: TestimonialsProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleApplySetup = (testimonial: Testimonial) => {
    // Maps realistic descriptive preference string to actual mixer tracks
    let soundIds: string[] = [];
    let volumes: number[] = [];

    if (testimonial.id === 'test-1') {
      soundIds = ['binaural', 'wind'];
      volumes = [80, 50];
    } else if (testimonial.id === 'test-2') {
      soundIds = ['rain', 'keyboard'];
      volumes = [70, 35];
    } else if (testimonial.id === 'test-3') {
      soundIds = ['pinknoise'];
      volumes = [60];
    }

    onApplyPreset(soundIds, volumes);
  };

  return (
    <div id="testimonials-section" className="py-24 border-t border-white/5 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
            Proven Calibration
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
            Loved by builders of high-performance software
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Click any member's profile card to preview and try their personal, tuned soundscape setup.
          </p>
        </div>

        {/* Dynamic Carousel / Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, idx) => {
            const isSelected = activeIdx === idx;
            const isCurrentlyActiveConfig = activeFavoriteSound === testimonial.favoriteSound;

            return (
              <motion.div
                key={testimonial.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveIdx(idx)}
                className={`p-6 md:p-8 rounded-3xl border text-left cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-white/5 border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.15)] backdrop-blur-md' 
                    : 'bg-slate-950/40 border-white/5 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                {/* Visualizer active badge */}
                {isCurrentlyActiveConfig && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-indigo-500 text-white rounded-full text-[9px] font-mono uppercase font-bold tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>Loaded Live Setup</span>
                  </div>
                )}

                <div>
                  {/* Rating / Quote Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-white/5" />
                  </div>

                  {/* Quote text */}
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  {/* Avatar & User Details */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <img
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {testimonial.role}, <span className="font-semibold text-indigo-400">{testimonial.company}</span>
                      </p>
                    </div>
                  </div>

                  {/* Preset Injector Widget */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplySetup(testimonial);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      isCurrentlyActiveConfig
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    <Headphones className={`w-3.5 h-3.5 ${isCurrentlyActiveConfig ? 'text-indigo-400 animate-pulse' : 'text-slate-400'}`} />
                    <span>
                      {isCurrentlyActiveConfig ? 'Active Environment' : 'Load Active Soundscape'}
                    </span>
                  </button>
                  <p className="text-[10px] text-center font-mono text-slate-500 mt-2">
                    {testimonial.favoriteSound}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
