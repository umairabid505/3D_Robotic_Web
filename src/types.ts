export interface Soundscape {
  id: string;
  name: string;
  iconName: string; // references lucide icon
  volume: number;   // 0 to 100
  isPlaying: boolean;
  category: 'natural' | 'synthetic' | 'urban';
  frequency: string; // e.g., "12Hz Alpha", "40Hz Gamma"
  color: string;     // Tailwind color class for active state
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl: string;
  favoriteSound: string;
  rating: number;
}

export interface BetaSignupForm {
  name: string;
  email: string;
  soundPreference: string;
  intensity: 'soft' | 'moderate' | 'focused';
  subscribe: boolean;
}

export interface BrandLogo {
  name: string;
  symbol: string;
  sector: string;
}
