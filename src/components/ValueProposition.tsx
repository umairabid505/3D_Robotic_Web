import { motion } from 'motion/react';
import { Brain, Sliders, Waves, ShieldCheck, Cpu, Headphones } from 'lucide-react';
import robotImage from '../images/robot2.png';

export default function ValueProposition() {
  const cards = [
    {
      icon: <Brain className="w-5 h-5 text-indigo-400" />,
      title: "Neural Entrainment Waves",
      description: "Precisely matched carrier frequencies that encourage the brain to enter alpha and theta waves, promoting deep, prolonged mental concentration.",
      bg: "bg-white/5 border-white/10 hover:border-indigo-500/30",
      delay: 0.1
    },
    {
      icon: <Sliders className="w-5 h-5 text-purple-400" />,
      title: "Tactile Sound Mixing",
      description: "Skip complex playlists. Mix raw analog noise with beautiful real-world environment recordings using fine-grained sliders to create your perfect shield.",
      bg: "bg-white/5 border-white/10 hover:border-purple-500/30",
      delay: 0.2
    },
    {
      icon: <Waves className="w-5 h-5 text-pink-400" />,
      title: "Schumann Resonance",
      description: "Our rain algorithm is structurally tied to the 7.83Hz frequency—the natural electromagnetic heartbeat of the Earth—for cognitive stability.",
      bg: "bg-white/5 border-white/10 hover:border-pink-500/30",
      delay: 0.3
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
      title: "Guaranteed Zero Tracking",
      description: "We collect absolutely zero usage data, analytics, or behavioral cookies. Your custom focus environment remains fully client-side and completely private.",
      bg: "bg-white/5 border-white/10 hover:border-indigo-500/30",
      delay: 0.4
    },
    {
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      title: "Real-time DSP Synthesis",
      description: "Audio is computed locally in the browser in real-time, avoiding heavy audio file streaming and reducing memory consumption by over 95%.",
      bg: "bg-white/5 border-white/10 hover:border-purple-500/30",
      delay: 0.5
    },
    {
      icon: <Headphones className="w-5 h-5 text-pink-400" />,
      title: "Perfect Stereo Isolation",
      description: "Designed specifically for headphones with binaural splitting, offering separate phase offsets to fully isolate left-right sound pressures.",
      bg: "bg-white/5 border-white/10 hover:border-pink-500/30",
      delay: 0.6
    }
  ];

  return (
    <div id="value-prop-section" className="pb-24 pt-12 bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-8"
          >
            <img src={robotImage} alt="Robot Mascot" className="w-30 h-auto object-contain drop-shadow-2xl" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase"
          >
            The Acoustic Standard
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mt-3 tracking-tight"
          >
            Engineered for high-density cognitive tasks
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-400 mt-4 leading-relaxed"
          >
            Volum replaces chaotic background tracks with scientifically optimized phase loops, restoring absolute focus to your workspace.
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`p-6 rounded-3xl border ${card.bg} backdrop-blur-md transition-all duration-300 flex flex-col justify-between group shadow-lg`}
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-white/10 transition-all duration-300">
                  {card.icon}
                </div>
                <h4 className="text-base font-extrabold text-white mt-5 tracking-tight">
                  {card.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {card.description}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Phase Calibrated</span>
                <span className="text-indigo-400 font-bold">100% Verified</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
