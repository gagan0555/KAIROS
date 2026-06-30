import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FileText, 
  CheckCircle, 
  AlertOctagon, 
  Minimize2, 
  Save, 
  Sparkles, 
  Clock, 
  Flame, 
  X
} from "lucide-react";
import { Task } from "../types";

interface FocusChamberProps {
  task: Task;
  onExit: () => void;
  onCompleteTask: (id: number) => void;
  onRefreshAll: () => void;
}

export default function FocusChamber({
  task,
  onExit,
  onCompleteTask,
  onRefreshAll,
}: FocusChamberProps) {
  // Timer states
  const totalDurationSeconds = (task.duration_minutes || 25) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalDurationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(true); // Auto-start for deep immersion
  
  // Scratchpad states
  const [scratchpadText, setScratchpadText] = useState(task.scratchpad || "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("saved");
  
  // Interruption modal states
  const [showInterruptModal, setShowInterruptModal] = useState(false);
  const [interruptReason, setInterruptReason] = useState("");
  const [customInterruptText, setCustomInterruptText] = useState("");
  const [isSubmittingInterrupt, setIsSubmittingInterrupt] = useState(false);

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Tick down timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      intervalId = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsTimerRunning(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTimerRunning, secondsRemaining]);

  // Handle auto-saving scratchpad on typing
  const handleScratchpadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setScratchpadText(newVal);
    setSaveStatus("saving");

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Debounce auto-save to cloud (800ms)
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tasks/${task.id}/scratchpad`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scratchpad: newVal }),
        });
        if (res.ok) {
          setSaveStatus("saved");
          task.scratchpad = newVal; // Sync local object state
        } else {
          setSaveStatus("idle");
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSaveStatus("idle");
      }
    }, 800);
  };

  // Explicit Save manual triggers
  const forceManualSave = async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/tasks/${task.id}/scratchpad`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scratchpad: scratchpadText }),
      });
      if (res.ok) {
        setSaveStatus("saved");
        task.scratchpad = scratchpadText;
      } else {
        setSaveStatus("idle");
      }
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("idle");
    }
  };

  // Handle Interrupt submit
  const handleInterruptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customInterruptText.trim() || interruptReason || "General distraction/procrastination loop";
    setIsSubmittingInterrupt(true);

    const secondsSpent = totalDurationSeconds - secondsRemaining;
    const minutesSpent = Math.max(1, Math.round(secondsSpent / 60));

    try {
      const res = await fetch(`/api/tasks/${task.id}/interrupt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration_spent_minutes: minutesSpent,
          reason: finalReason,
        }),
      });

      if (res.ok) {
        alert(`Attention disruption logged successfully. Attention Budget metric updated. 7-Agent Council has been prompted to insert protective recovery intervals.`);
        onRefreshAll();
        onExit();
      }
    } catch (err) {
      console.error("Failed to submit session interrupt:", err);
    } finally {
      setIsSubmittingInterrupt(false);
      setShowInterruptModal(false);
    }
  };

  // Formatting helpers
  const formatTimeRemaining = () => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressFraction = secondsRemaining / totalDurationSeconds;
  const strokeDashoffsetValue = 282.7 - (282.7 * progressFraction);

  const PRESET_DISTRACTIONS = [
    "Cognitive overload & mental fatigue",
    "Social media/procrastination impulse",
    "External interruption (phone/family/friend)",
    "Stuck on hard bug/conceptual block",
    "Academic fatigue/exam panic",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#05070c] text-[#f8fafc] font-sans flex flex-col overflow-hidden select-none animate-in fade-in duration-200">
      {/* Visual background ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4f46e5]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#f59e0b]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Zenith Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></div>
          <div>
            <h1 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">
              Focus Chamber Activated
            </h1>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Focus_Guardian shielding mode: all external noise is isolated.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus === "saving" && (
            <span className="text-[10px] font-mono text-amber-400/80 animate-pulse bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
              Saving Scratchpad...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Draft Saved
            </span>
          )}
          <button
            onClick={onExit}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all duration-150 flex items-center gap-1 text-xs font-mono border border-white/5 bg-white/5 cursor-pointer"
            title="Minimize Chamber"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Minimize</span>
          </button>
        </div>
      </header>

      {/* Main split dashboard */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 relative z-10">
        {/* Left pane: Immersive Timer */}
        <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 bg-black/20 shrink-0 lg:w-[45%]">
          <div className="max-w-md w-full text-center space-y-8 flex flex-col items-center">
            
            {/* Task Info Context */}
            <div className="space-y-2 text-center">
              <span className="inline-block px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] font-bold uppercase rounded-md tracking-wider">
                {task.recruitment_stage || "Deep-Work Block"}
              </span>
              <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight leading-tight">
                {task.title}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Allocated Segment @ <strong className="text-slate-300 font-semibold">{task.company_name}</strong>
              </p>
            </div>

            {/* Immersive circular timer display */}
            <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
              {/* Outer circle layout */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="url(#timerGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="282.7"
                  strokeDashoffset={strokeDashoffsetValue}
                  className="transition-all duration-1000 ease-linear"
                  style={{
                    strokeDasharray: "282.7%",
                    strokeDashoffset: `${strokeDashoffsetValue}%`
                  }}
                />
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Countdown text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                <span className="text-4xl md:text-5xl font-mono font-bold tracking-widest text-white">
                  {formatTimeRemaining()}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  {isTimerRunning ? "Flow State Active" : "Immersion Paused"}
                </span>
                {task.importance_percentage && (
                  <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold mt-2">
                    Priority: {task.importance_percentage}%
                  </span>
                )}
              </div>
            </div>

            {/* Micro Timer Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSecondsRemaining(totalDurationSeconds)}
                className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                title="Restart Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-8 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-wider transition-all duration-200 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer ${
                  isTimerRunning
                    ? "bg-[#090d16] border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                    : "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-500/20"
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4 text-amber-500" />
                    <span>Pause Flow</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-white fill-current" />
                    <span>Resume Flow</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onCompleteTask(task.id)}
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-xl transition-colors cursor-pointer"
                title="Complete Task Now"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Zen Affirmation Footer */}
            <p className="text-[11px] font-mono text-slate-500 italic max-w-xs leading-relaxed">
              "Focus is a muscle. Guard this interval. The rest of the world can wait."
            </p>

          </div>
        </section>

        {/* Right pane: Dedicated Workspace Scratchpad */}
        <section className="flex-1 flex flex-col p-6 md:p-8 min-h-0 bg-black/40">
          <div className="flex-1 flex flex-col min-h-0 max-w-3xl w-full mx-auto space-y-4">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
                  Focus workspace Scratchpad
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={forceManualSave}
                  className="px-2.5 py-1 text-[10px] font-mono bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3 h-3" />
                  <span>Manual Save</span>
                </button>
              </div>
            </div>

            {/* Textarea Workspace */}
            <div className="flex-1 min-h-0 relative">
              <textarea
                value={scratchpadText}
                onChange={handleScratchpadChange}
                placeholder="Write your research notes, code drafts, test cases, or active reminders here. This scratchpad auto-saves securely to the cloud and is locked to this specific study block."
                className="w-full h-full p-4 bg-black/20 border border-white/5 focus:border-white/10 rounded-2xl text-slate-200 text-sm focus:outline-none focus:ring-0 font-mono resize-none leading-relaxed placeholder:text-slate-600 focus:bg-black/30 transition-all"
              />
              {scratchpadText.length === 0 && (
                <div className="absolute top-24 left-4 right-4 pointer-events-none flex flex-col items-center justify-center text-center space-y-2 opacity-30">
                  <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                  <p className="text-xs text-slate-400 font-mono max-w-sm">
                    Enter flow state and start typing. Notes, snippets, questions are synchronized with this OA stage.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Helper Tips */}
            <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-xl flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <p className="text-[11px] text-indigo-300 leading-normal">
                <strong>Focus_Guardian advice:</strong> Split complex problems into 3 smaller units in this scratchpad before starting code. Take active micro-breaks when the timer expires.
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* Footer Emergency Controls */}
      <footer className="h-16 border-t border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md shrink-0 relative z-10">
        <button
          onClick={() => setShowInterruptModal(true)}
          className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Interrupt Session</span>
        </button>

        <button
          onClick={() => onCompleteTask(task.id)}
          className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 text-xs font-bold font-mono uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCircle className="w-4 h-4 text-slate-950" />
          <span>Complete Block</span>
        </button>
      </footer>

      {/* Session Interruption Modal overlay */}
      {showInterruptModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-rose-500/20 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-400">
                <AlertOctagon className="w-5 h-5" />
                <h3 className="font-display font-bold text-base text-white">
                  Attention Interruption Portal
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowInterruptModal(false);
                  setInterruptReason("");
                  setCustomInterruptText("");
                }}
                className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              To keep the <strong>7-Agent Cognitive Council</strong> aligned with your actual attention budget, please document this distraction. The <strong>Focus_Guardian</strong> and <strong>Burnout_Governor</strong> will dynamically adjust your scheduling pace.
            </p>

            <form onSubmit={handleInterruptSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Select Interruption Category
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {PRESET_DISTRACTIONS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setInterruptReason(preset);
                        setCustomInterruptText("");
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                        interruptReason === preset
                          ? "bg-rose-500/10 border-rose-500/40 text-rose-300 font-semibold"
                          : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Or specify custom distraction / custom notes
                </label>
                <input
                  type="text"
                  placeholder="e.g., Slack notifications pinged, urgent lab task..."
                  value={customInterruptText}
                  onChange={(e) => {
                    setCustomInterruptText(e.target.value);
                    setInterruptReason("");
                  }}
                  className="w-full text-xs p-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/40 text-slate-200 placeholder:text-slate-600"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInterruptModal(false);
                    setInterruptReason("");
                    setCustomInterruptText("");
                  }}
                  className="px-4 py-2 border border-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingInterrupt || (!interruptReason && !customInterruptText.trim())}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-colors flex items-center gap-1 shadow-lg shadow-rose-600/10"
                >
                  {isSubmittingInterrupt ? "Logging..." : "Confirm Interruption"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
