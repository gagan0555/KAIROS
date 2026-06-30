import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ArrowLeft, X, Shield, Zap, Terminal, Sliders, Play } from "lucide-react";

interface OnboardingTutorialProps {
  onClose: () => void;
}

const steps = [
  {
    title: "Secure Autopilot Profile",
    description: "Your dynamic schedules and academic tasks are securely bound to your Google Autopilot session. Your display name, email, and archetype avatar are active in the header.",
    selector: "google-profile-step",
    icon: <Play className="w-5 h-5 text-emerald-400" />,
    highlightText: "Provides cryptographically simulated session persistence and custom avatars.",
  },
  {
    title: "Universal Navigation Grid",
    description: "Spacious central hub replacing clutter. Clicking a card instantly expands and transitions to that specific core subsystem below.",
    selector: "navigation-grid-step",
    icon: <Sliders className="w-5 h-5 text-indigo-400" />,
    highlightText: "Six micro-interactive feature engines featuring glowing neon state borders.",
  },
  {
    title: "Multimodal Dropzone Ingestion",
    description: "Paste unstructured reminders, syllabus snippets, or exam notices. Our integrated Gemini LLM automatically isolates durations, deadlines, and priorities.",
    selector: "dropzone-step",
    icon: <Terminal className="w-5 h-5 text-violet-400" />,
    highlightText: "Ingest any text or notice directly here to auto-populate pipelines.",
  },
  {
    title: "Chrono-Shield Protections",
    description: "Declare immutable lectures, doctor appointments, or recurring timetables. The scheduler is mathematically barred from placing preps here.",
    selector: "chrono-shield-step",
    icon: <Shield className="w-5 h-5 text-rose-400" />,
    highlightText: "Deflect tasks from protected medical and course intervals.",
  },
  {
    title: "Focus Chamber Engine",
    description: "Time to execute? Launch the immersive focus timer and workspace to trigger full-screen dashboards, pacing modes, and real-time scratchpads.",
    selector: "focus-chamber-step",
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    highlightText: "Focus deeply and log completed items with zero distractions.",
  }
];

export default function OnboardingTutorial({ onClose }: OnboardingTutorialProps) {
  const [step, setStep] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const currentSelector = steps[step].selector;
    if (currentSelector) {
      const el = document.getElementById(currentSelector);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        
        const updateCoords = () => {
          const rect = el.getBoundingClientRect();
          setCoords({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
          });
        };

        // Delay slightly for scroll transition
        const timer = setTimeout(() => {
          updateCoords();
          el.classList.add("ring-4", "ring-indigo-500", "ring-offset-2", "transition-all", "duration-500");
        }, 400);

        window.addEventListener("resize", updateCoords);

        return () => {
          clearTimeout(timer);
          window.removeEventListener("resize", updateCoords);
          el.classList.remove("ring-4", "ring-indigo-500", "ring-offset-2");
        };
      }
    }
    setCoords(null);
  }, [step]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.removeItem("omnipse_show_tutorial");
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    localStorage.removeItem("omnipse_show_tutorial");
    onClose();
  };

  // Determine floating box placement: if targeted element coordinates exist, place near it
  const tooltipStyle: React.CSSProperties = coords ? {
    position: 'absolute',
    top: `${coords.top + coords.height + 16}px`,
    left: `${Math.max(16, Math.min(window.innerWidth - 450, coords.left + (coords.width / 2) - 220))}px`,
    width: '440px',
    zIndex: 9999,
  } : {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '440px',
    zIndex: 9999,
  };

  return (
    <div className="absolute inset-0 z-[9998] bg-slate-950/80 backdrop-blur-[2px] transition-all duration-500 overflow-y-auto">
      {/* SVG Spotlight mask overlay */}
      {coords && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '200vh' }}>
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={coords.left - 8}
                y={coords.top - 8}
                width={coords.width + 16}
                height={coords.height + 16}
                rx="12"
                ry="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(15, 23, 42, 0.75)" mask="url(#spotlight-mask)" />
        </svg>
      )}

      {/* Floating Dynamic Tooltip Card */}
      <div
        style={tooltipStyle}
        className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl p-6 space-y-5 relative transition-all duration-300"
      >
        {/* Header with Close and Progress Indicator */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono tracking-wider text-indigo-400 uppercase font-bold">
              System Tour: Step {step + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-800"
            title="Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Body */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {steps[step].icon}
            <h3 className="text-lg font-display font-bold text-white tracking-tight">
              {steps[step].title}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {steps[step].description}
          </p>

          {/* Micro Highlight Sub-Banner */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 flex gap-2.5 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0 animate-ping"></div>
            <div>
              <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider font-mono">
                Spotlight Feedback
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {steps[step].highlightText}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            Skip Tour
          </button>

          {/* Nav Controls */}
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-lg shadow-indigo-600/25"
            >
              {step === steps.length - 1 ? "Start Co-Piloting" : "Next Step"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
