import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';

interface Story {
  id: string;
  name: string;
  thumb: string;
  videoId: string;
  color: string;
}

const stories: Story[] = [
  { id: 's1', name: 'Focus Flow', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=72&h=72&fit=crop&auto=format', videoId: 'jfKfPfyJRdk', color: '#6366f1' },
  { id: 's2', name: 'Deep Work', thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=72&h=72&fit=crop&auto=format', videoId: 'lTRiuFIWV54', color: '#a855f7' },
  { id: 's3', name: 'Rain Mode', thumb: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=72&h=72&fit=crop&auto=format', videoId: 'q76bMs-NwRk', color: '#3b82f6' },
  { id: 's4', name: 'Binaural', thumb: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=72&h=72&fit=crop&auto=format', videoId: 'F7iepkCmWuE', color: '#ec4899' },
  { id: 's5', name: 'Nature Zen', thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=72&h=72&fit=crop&auto=format', videoId: 'eKFTSSKCzWA', color: '#10b981' },
  { id: 's6', name: 'Cosmos', thumb: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=72&h=72&fit=crop&auto=format', videoId: 'ZToicYcHIOU', color: '#f59e0b' },
  { id: 's7', name: 'Café Hum', thumb: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=72&h=72&fit=crop&auto=format', videoId: 'BOdLmxy06H0', color: '#ef4444' },
];

export default function RecentStories() {
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  return (
    <section className="py-14 border-t border-white/5 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase mb-6 text-center">
          Recent Stories
        </p>

        {/* Scrollable story row */}
        <div
          className="flex items-end justify-center gap-6 overflow-x-auto pb-2 flex-wrap"
          style={{ scrollbarWidth: 'none' }}
        >
          {stories.map((story, i) => (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              onClick={() => setActiveStory(story)}
              className="flex-shrink-0 flex flex-col items-center gap-2.5 cursor-pointer group"
            >
              {/* Conic ring + avatar */}
              <div
                className="relative w-[72px] h-[72px] rounded-full p-[3px]"
                style={{ background: `conic-gradient(${story.color} 0deg 290deg, #1e293b 290deg 360deg)` }}
              >
                <div className="w-full h-full rounded-full p-[2px] bg-slate-950">
                  <img
                    src={story.thumb}
                    alt={story.name}
                    loading="lazy"
                    className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Play overlay */}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-medium group-hover:text-white transition-colors whitespace-nowrap">
                {story.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(2,6,23,0.88)', backdropFilter: 'blur(14px)' }}
            onClick={() => setActiveStory(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10"
              style={{ boxShadow: `0 0 80px ${activeStory.color}40` }}
            >
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${activeStory.color}, transparent)` }} />
              <div className="aspect-video bg-black">
                <iframe
                  key={activeStory.videoId}
                  src={`https://www.youtube.com/embed/${activeStory.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeStory.name}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="px-5 py-3 bg-slate-900/90 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{activeStory.name}</span>
                <button
                  onClick={() => setActiveStory(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
