import { Soundscape, Testimonial, BrandLogo } from './types';

export const initialSoundscapes: Soundscape[] = [
  {
    id: 'rain',
    name: 'Deep Forest Rain',
    iconName: 'CloudRain',
    volume: 65,
    isPlaying: false,
    category: 'natural',
    frequency: '7.83Hz Schumann Resonance',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'binaural',
    name: 'Binaural Focus Alpha',
    iconName: 'Waves',
    volume: 50,
    isPlaying: true,
    category: 'synthetic',
    frequency: '10Hz Deep Concentration',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'cafe',
    name: 'Parisian Cafe Ambient',
    iconName: 'Coffee',
    volume: 40,
    isPlaying: false,
    category: 'urban',
    frequency: 'Muffled Social Warmth',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'pinknoise',
    name: 'Cosmic Pink Noise',
    iconName: 'Radio',
    volume: 30,
    isPlaying: false,
    category: 'synthetic',
    frequency: 'Full-Spectrum Static',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'keyboard',
    name: 'Mechanical Typing ASMR',
    iconName: 'Keyboard',
    volume: 20,
    isPlaying: false,
    category: 'urban',
    frequency: 'Tactile Rhythm Loop',
    color: 'from-slate-400 to-zinc-600',
  },
  {
    id: 'wind',
    name: 'Sub-Zero Alpine Wind',
    iconName: 'Wind',
    volume: 35,
    isPlaying: false,
    category: 'natural',
    frequency: '4.5Hz Theta Waves',
    color: 'from-cyan-400 to-blue-500',
  }
];

export const brandLogos: BrandLogo[] = [
  { name: 'Teenage Eng.', symbol: '⚙️', sector: 'Hardware Design' },
  { name: 'Ableton', symbol: '≡', sector: 'Music Software' },
  { name: 'Dolby Atmos', symbol: '🎚️', sector: 'Spatial Audio' },
  { name: 'Sonos', symbol: '🔊', sector: 'Acoustic Engineering' },
  { name: 'Bose Pro', symbol: '🎧', sector: 'Active Cancellation' },
  { name: 'Sennheiser', symbol: '🎙️', sector: 'Precision Audio' }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Elena Rostova',
    role: 'Principal Staff Engineer',
    company: 'Stripe',
    quote: 'The Binaural Focus combined with Sub-Zero Wind completely masks the open-office chatter. My daily coding sessions went from fragmented to four hours of solid, continuous flow.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    favoriteSound: 'Binaural Focus Alpha + Alpine Wind',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Marcus Vance',
    role: 'Lead Interactive Designer',
    company: 'Vercel',
    quote: 'Volum sets the gold standard for minimal web aesthetics. The interactive volume curves, the haptic-feeling knobs, and that sublime "Zen Mode" toggle are absolute perfection.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    favoriteSound: 'Deep Forest Rain + Mechanical ASMR',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Dr. Aris Thorne',
    role: 'Acoustic Neuroscientist',
    company: 'MIT Media Lab',
    quote: 'What makes Volum unique is its dedication to specific brainwave frequencies. The Schumann rain preset is chemically aligned with active memory consolidation cycles.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    favoriteSound: 'Cosmic Pink Noise at 40Hz',
    rating: 5
  }
];
