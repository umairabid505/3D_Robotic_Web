import { useState, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'motion/react';
import { BetaSignupForm } from '../types';
import { CheckCircle, Mail, User, Music, Sliders, ChevronRight, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const EJS_SERVICE  = 'service_kmzwjcw';
const EJS_TEMPLATE = 'template_lbtyev8';
const EJS_PUBKEY   = 'VJTjMq9UyoVkSbtCN';

export default function BetaSignup() {
  const [formData, setFormData] = useState<BetaSignupForm>({
    name: '',
    email: '',
    soundPreference: 'Deep Forest Rain',
    intensity: 'moderate',
    subscribe: true
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketId, setTicketId]   = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError('Please provide your name.'); return; }
    if (!formData.email.trim() || !formData.email.includes('@')) { setError('Please provide a valid email address.'); return; }

    setError(null);
    setIsLoading(true);

    try {
      // 1. Save data to Supabase
      const { error: dbError } = await supabase
        .from('signups')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            sound_preference: formData.soundPreference,
            intensity: formData.intensity,
            subscribe: formData.subscribe,
          }
        ]);

      if (dbError) {
        throw dbError;
      }

      // 2. Send email notification via EmailJS
      await emailjs.send(
        EJS_SERVICE,
        EJS_TEMPLATE,
        { full_name: formData.name, email: formData.email },
        { publicKey: EJS_PUBKEY }
      );
      const accessKey = `VL-${Math.floor(100000 + Math.random() * 900000)}-${formData.intensity.substring(0, 3).toUpperCase()}`;
      setTicketId(accessKey);
      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error('[Error during signup]', err);
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : err && typeof err === 'object' && 'text' in err
          ? String((err as { text: unknown }).text)
          : err instanceof Error
          ? err.message
          : 'Unknown error';
      setError(`Failed to process request: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="signup-section" className="py-24 bg-slate-900/40 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Beta Intake Phase IV</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Reserve your acoustic node
          </h2>
          <p className="text-sm text-slate-400 mt-2.5">
            Join 4,200+ engineers and designers calibrating their minds for zero distraction.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="signup-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="bg-slate-950/75 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-10 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
            >
              <div className="space-y-6">
                {/* Error Banner */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </div>
                )}

                {/* Name & Email Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all"
                    />
                  </div>
                </div>

                {/* Ambient Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-indigo-400" />
                      Auditory Profile Preference
                    </label>
                    <select
                      value={formData.soundPreference}
                      onChange={(e) => setFormData({ ...formData, soundPreference: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all cursor-pointer"
                    >
                      <option className="bg-slate-950 text-white">Deep Forest Rain</option>
                      <option className="bg-slate-950 text-white">Binaural Focus Alpha</option>
                      <option className="bg-slate-950 text-white">Parisian Cafe Ambient</option>
                      <option className="bg-slate-950 text-white">Cosmic Pink Noise</option>
                      <option className="bg-slate-950 text-white">Mechanical Typing ASMR</option>
                      <option className="bg-slate-950 text-white">Sub-Zero Alpine Wind</option>
                    </select>
                  </div>

                  {/* Focus Intensity Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                      Concentration Depth
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['soft', 'moderate', 'focused'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setFormData({ ...formData, intensity: lvl })}
                          className={`py-2 px-1 rounded-xl text-xs font-semibold border capitalize cursor-pointer transition-all ${
                            formData.intensity === lvl
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                              : 'bg-white/5 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-white/10'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Newsletter Subscribe and TNC */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={formData.subscribe}
                    onChange={(e) => setFormData({ ...formData, subscribe: e.target.checked })}
                    className="w-4 h-4 text-indigo-500 border-white/15 rounded focus:ring-indigo-500 accent-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="newsletter" className="text-xs text-slate-400 select-none cursor-pointer">
                    Yes, email me occasional acoustic science insights and product updates.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending…</span></>
                  ) : (
                    <><span>Submit Node Request</span><ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            /* Output ticket generator */
            <motion.div
              key="admission-ticket"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-950 border border-indigo-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden text-left shadow-[0_0_35px_rgba(99,102,241,0.15)]"
            >
              {/* Retro decorative graphics */}
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none" />

              <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Beta Admission Confirmed</span>
                  </div>
                  <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-300 tracking-tight uppercase">
                    Acoustic Focus Node Pass
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Your environment key is generated and linked to your email below.
                  </p>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex flex-col justify-center text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Acoustic ID</span>
                  <span className="text-base font-bold font-mono text-indigo-300 mt-0.5">{ticketId}</span>
                </div>
              </div>

              {/* Ticket details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-white/5 font-mono">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Registrant</span>
                  <span className="text-xs font-bold text-slate-300 mt-1 block truncate">{formData.name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Gateway Node</span>
                  <span className="text-xs font-bold text-slate-300 mt-1 block">NODE-43-SEC</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Intonation</span>
                  <span className="text-xs font-bold text-slate-300 mt-1 block truncate">{formData.soundPreference}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Concentration</span>
                  <span className="text-xs font-bold text-indigo-400 mt-1 block uppercase">{formData.intensity}</span>
                </div>
              </div>

              {/* Barcode & Reset button */}
              <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-1.5 w-full md:w-auto">
                  <div className="flex h-10 gap-[2px] bg-white/5 p-1.5 rounded items-center [mask-image:linear-gradient(to_bottom,white,white_80%,transparent)]">
                    {/* Simulated barcode bars */}
                    {[2,1,4,1,3,2,1,5,1,2,1,4,3,1,2,5,1,3,1,4,1,2].map((w, i) => (
                      <div key={i} className="bg-slate-400 h-full rounded-xs" style={{ width: `${w * 1.5}px` }} />
                    ))}
                  </div>
                  <span className="text-[8px] text-indigo-400/80 font-mono text-center tracking-[0.25em]">
                    *ACCESS-AUTHORIZED*
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      soundPreference: 'Deep Forest Rain',
                      intensity: 'moderate',
                      subscribe: true
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all cursor-pointer"
                >
                  Register New Node
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
