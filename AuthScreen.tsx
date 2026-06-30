import React, { useState } from "react";
import { Zap, Shield, Sparkles, ArrowRight, Check } from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (user: { email: string; name: string; avatar: string }) => void;
}

const PREDEFINED_AVATARS = [
  { emoji: "🧠", name: "Cognitive Cadet", color: "from-indigo-500/20 to-indigo-500/10 text-indigo-400 border-indigo-500/30" },
  { emoji: "🛡️", name: "Chrono Defender", color: "from-emerald-500/20 to-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  { emoji: "⚡", name: "Focus Guru", color: "from-amber-500/20 to-amber-500/10 text-amber-400 border-amber-500/30" },
  { emoji: "🤖", name: "Agent Commander", color: "from-violet-500/20 to-violet-500/10 text-violet-400 border-violet-500/30" },
  { emoji: "🌟", name: "Elite Performer", color: "from-rose-500/20 to-rose-500/10 text-rose-400 border-rose-500/30" },
];

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [step, setStep] = useState<"landing" | "profile">("landing");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(PREDEFINED_AVATARS[0]);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    // Simulate authentic Google Auth redirection/popup delay
    setTimeout(() => {
      setLoading(false);
      setEmail("student@google.com");
      setStep("profile");
    }, 1200);
  };

  const handleInitializeProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const userSession = {
        email: email || "student@google.com",
        name: displayName,
        avatar: selectedAvatar.emoji,
        token: "simulated-jwt-google-auth-token-12345",
      };
      
      localStorage.setItem("omnipse_session", JSON.stringify(userSession));
      localStorage.setItem("omnipse_show_tutorial", "true"); // Flag to trigger guided tour
      onAuthSuccess(userSession);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Decorative premium ambient glow backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[100px] -z-10 animate-pulse duration-4000"></div>
      
      {/* Structural Glassmorphic Card Container */}
      <div className="max-w-md w-full space-y-8 bg-slate-900/60 border border-slate-800/80 p-8 sm:p-10 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10 transition-all duration-500">
        
        {step === "landing" ? (
          <div className="space-y-8">
            {/* Logo and Typography */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                <Zap className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-display font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  Kairos AI
                </h1>
                <p className="text-xs font-mono tracking-wider text-indigo-400 uppercase font-semibold">
                  Multi-Agent Cognitive Co-Pilot
                </p>
              </div>
              <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                The ultimate academic scheduling shield. Protect your cognitive bandwidth, de-conflict time constraints, and master high-stakes recruitment pipelines.
              </p>
            </div>

            {/* Authentication Core Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-12 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg active:scale-98 cursor-pointer relative overflow-hidden"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {/* Authentic SVG G-Icon */}
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.56-5.17 3.56-8.58z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.32 14.24A7.16 7.16 0 0 1 4.9 12c0-.79.13-1.57.38-2.31V6.54H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.46l4.11-3.22z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.46l4.11 3.22c.94-2.85 3.57-4.93 6.68-4.93z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Secure Google OAuth Sandbox Sync
              </div>
            </div>

            {/* Micro-Features Row */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/60 text-center text-[10px] text-slate-500 font-mono">
              <div className="flex flex-col items-center gap-2 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/30">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Chrono-Shield protection</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/30">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>7-Agent Cognitive Council</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInitializeProfile} className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider">
                Authorized: student@google.com
              </div>
              <h2 className="text-2xl font-display font-extrabold text-white">
                Initialize Profile
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Select your student autopilot archetype and choose a display name to bind schedule state.
              </p>
            </div>

            {/* Input display name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Autopilot Display Name
              </label>
              <input
                type="text"
                required
                maxLength={24}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full text-sm bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-sans placeholder-slate-600"
              />
            </div>

            {/* Predefined Avatar Grid */}
            <div className="space-y-2.5">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Select Autopilot Archetype
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PREDEFINED_AVATARS.map((avatar) => {
                  const isSelected = selectedAvatar.name === avatar.name;
                  return (
                    <button
                      key={avatar.name}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`h-16 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 relative cursor-pointer group bg-gradient-to-b ${avatar.color} ${
                        isSelected 
                          ? "ring-2 ring-indigo-500 border-indigo-400 scale-105" 
                          : "opacity-60 hover:opacity-100"
                      }`}
                      title={avatar.name}
                    >
                      <span className="text-2xl mb-0.5">{avatar.emoji}</span>
                      
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-slate-950 rounded-full flex items-center justify-center p-0.5 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="text-[10px] text-center text-slate-400 font-mono bg-slate-950/50 py-1.5 px-3 rounded-lg border border-slate-800/40">
                Selected: <strong className="text-white">{selectedAvatar.name}</strong> ({selectedAvatar.emoji})
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !displayName.trim()}
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-500/10 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Lock In Autopilot Profile
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
