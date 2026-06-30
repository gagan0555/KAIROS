import React from "react";
import { Calendar, AlertCircle, CheckCircle, Clock, Award, ShieldAlert, BookOpen, Flame, Compass, Lock, Sparkles } from "lucide-react";
import { Task, Habit, HardConstraint } from "../types";
import RemedialSyllabusDropdown from "./RemedialSyllabusDropdown";

interface DashboardViewProps {
  tasks: Task[];
  habits: Habit[];
  compliance: number;
  constraints: HardConstraint[];
  onUpdateStatus: (id: number, status: "completed" | "missed") => void;
  onNavigateToTab: (tab: string) => void;
  onDemoLaunched: () => void;
  onLockIn: (task: Task) => void;
  onUpdateTaskImportance: (id: number, importance: number) => void;
}

export default function DashboardView({
  tasks,
  habits,
  compliance,
  constraints,
  onUpdateStatus,
  onNavigateToTab,
  onDemoLaunched,
  onLockIn,
  onUpdateTaskImportance,
}: DashboardViewProps) {
  // Current simulated date/time
  const now = new Date("2026-06-30T08:34:58-07:00");
  const nowMs = now.getTime();
  const limit48hMs = nowMs + 48 * 60 * 60 * 1000;

  // Filter tasks in the next 48 hours
  const upcoming48hTasks = tasks.filter((t) => {
    if (!t.deadline) return true; // keep unscheduled/general tasks for safety or list them as daily tasks
    const taskTime = new Date(t.deadline).getTime();
    return taskTime >= nowMs && taskTime <= limit48hMs && t.status === "pending";
  });

  // Critical deadlines
  const criticalDeadlines = tasks
    .filter((t) => t.status === "pending" && t.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 3);

  // Active upskilling objectives (automatically injected)
  const activeUpskilling = tasks.filter((t) => t.post_mortem_submitted === 1 && t.up_skilling_objective);

  // Calculate some simple metrics
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6 font-sans">
      {/* Hackathon Demo Activation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#090d16] border border-amber-500/40 rounded-2xl p-5 gap-4 shadow-[0_0_20px_rgba(245,158,11,0.12)]">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 animate-pulse">
            <Flame className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Hackathon Evaluation Console
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Instantly seed a real student lifestyle scenario, stalled Uber OA, compliance index to 52%, and stream the 7-agent debate.
            </p>
          </div>
        </div>
        <button
          id="btn-launch-demo"
          onClick={async () => {
            try {
              const res = await fetch("/api/seed-hackathon-demo", { method: "POST" });
              if (res.ok) {
                onDemoLaunched();
              }
            } catch (err) {
              console.error("Failed to trigger demo mode seeding:", err);
            }
          }}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Award className="w-4 h-4 text-slate-950" />
          Launch Hackathon Demo Mode
        </button>
      </div>

      {/* Burnout Governor System Alert for Recovery Mode */}
      {compliance < 60 && (
        <div className="bg-rose-950/20 border-2 border-rose-500/50 rounded-2xl p-6 shadow-[0_0_20px_rgba(239,68,68,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 shrink-0">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-full">
                  Systemic Burnout Alert
                </span>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Recovery Mode Active
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-rose-100">
                Pacing Intercept: Non-Essential Study Blocked
              </h3>
              <p className="text-xs text-rose-200/80 leading-relaxed max-w-3xl">
                The Burnout Governor has registered a critical 48-Hour Task Compliance Index of <strong className="text-rose-400 font-mono text-sm">{compliance}%</strong>. To safeguard your cognitive bandwidth, the 7-Agent Council has deactivated all flexible habits and deferred non-urgent academic requirements.
              </p>
              
              {/* Emergency Urgency Override Demonstration */}
              <div className="mt-4 p-4 bg-slate-900/60 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wider font-semibold block">
                    ⚡ Emergency Urgency Override
                  </span>
                  <p className="text-xs text-slate-300 mt-1">
                    An active, upcoming placement milestone (<strong className="text-white font-semibold">Uber Software Engineering Internship OA</strong>) falls inside the 24-hour window. The Council has successfully locked down high-intensity preparation blocks, bypassing normal relaxation buffers.
                  </p>
                </div>
                <button 
                  onClick={() => onNavigateToTab("pipeline")}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  View Locked Blocks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Header Banner */}
      <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-md border ${
        compliance < 60 
          ? "bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/40 border-rose-950" 
          : "bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-slate-800"
      }`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-indigo-500/30">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Active Academic Autopilot Mode
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">
              Anti-Overwhelm Command Console
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Kairos reduces cognitive overload by hiding long-term queues and prioritizing only the next 48 hours of high-cognitive load milestones.
            </p>
          </div>

          <div className="flex gap-4 shrink-0 bg-black/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="text-center">
              <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Compliance
              </span>
              <span className="text-xl font-mono font-bold text-emerald-400">
                {compliance}%
              </span>
            </div>
            <div className="w-px bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Success Rate
              </span>
              <span className="text-xl font-mono font-bold text-indigo-400">
                {completionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Scannable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compliance Guard Gauge */}
        <div className="bg-white border border-[#e2e8f0] p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">
                Pacing Governor
              </span>
              <Award className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-[#0f172a] font-display">
              Task Compliance Metric
            </h3>
            <p className="text-xs text-[#64748b] mt-1">
              Your overall commitment follow-through score based on historical completion ratios.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="text-[#f1f5f9]"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="text-indigo-600 transition-all duration-500"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * compliance) / 100}
                />
              </svg>
              <span className="absolute text-xs font-mono font-bold text-slate-800">
                {compliance}%
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold block text-[#0f172a]">
                {compliance >= 85 ? "Optimal Status" : "Warning: Fatigue Imminent"}
              </span>
              <span className="text-[11px] text-[#64748b] block mt-0.5">
                {compliance >= 85
                  ? "Autonomous up-skilling pacing is active."
                  : "Chrono-Shield recommends adding relaxation constraints."}
              </span>
            </div>
          </div>
        </div>

        {/* Critical Impending Deadlines */}
        <div className="bg-white border border-[#e2e8f0] p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">
                Urgent Milestones
              </span>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-[#0f172a] font-display">
              Critical Deadlines
            </h3>
            <p className="text-xs text-[#64748b] mt-1">
              Nearest high-stakes placements or test deadlines requiring attention.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {criticalDeadlines.length === 0 ? (
              <span className="text-xs text-[#64748b] italic">No active deadlines.</span>
            ) : (
              criticalDeadlines.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between text-xs p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-800 truncate block">
                      {t.title}
                    </span>
                    <span className="text-[10px] text-[#64748b] block">
                      {t.company_name} • {t.recruitment_stage}
                    </span>
                  </div>
                  {t.deadline && (
                    <span className="shrink-0 font-mono text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold border border-rose-100">
                      {new Date(t.deadline).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Interactive Protection Status */}
        <div className="bg-white border border-[#e2e8f0] p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">
                Timetable Shield
              </span>
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-[#0f172a] font-display">
              Active Protected Hours
            </h3>
            <p className="text-xs text-[#64748b] mt-1">
              Guaranteed lock-out segments reserved for university lectures or rest.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-2xl font-mono font-bold text-slate-800">
                {constraints.length}
              </span>
              <span className="text-xs text-[#64748b] block mt-0.5">
                Registered blocks safe from clutter
              </span>
            </div>
            <button
              onClick={() => onNavigateToTab("settings")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors border border-indigo-100"
            >
              Configure Core
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: 48h Immediate Priorities vs Active Upskilling Objectives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next 48 Hours Priority Queue */}
        <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="text-base font-display font-semibold text-[#0f172a]">
                Focus Queue: Next 48 Hours
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded-full border border-slate-200">
              Only Showing Immediate Actions
            </span>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {upcoming48hTasks.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#e2e8f0] rounded-lg bg-[#f8fafc]">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-[#0f172a]">All Clear for the Next 48h!</h4>
                <p className="text-xs text-[#64748b] mt-1">
                  Enjoy the breathing room. No high-stakes assessments due immediately.
                </p>
                <button
                  onClick={() => onNavigateToTab("pipeline")}
                  className="mt-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Load Placement Notices
                </button>
              </div>
            ) : (
              upcoming48hTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3 border border-[#e2e8f0] hover:border-slate-300 rounded-xl bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-mono uppercase bg-[#1e293b] text-white px-1.5 py-0.5 rounded font-semibold">
                        {t.recruitment_stage || "Skill"}
                      </span>
                      {t.cognitive_load === "high" && (
                        <span className="text-[9px] font-mono uppercase bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-semibold">
                          High Load
                        </span>
                      )}
                      <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                        Weight: {t.importance_percentage || 50}%
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#0f172a]">
                      {t.title.includes("Link: ") ? (
                        <>
                          {t.title.split(" (Link: ")[0]}
                          <a 
                            href={t.title.split(" (Link: ")[1]?.replace(")", "")} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 ml-2 bg-indigo-50 px-2 py-0.5 rounded font-mono text-[10px] border border-indigo-100 hover:underline"
                          >
                            <Compass className="w-3 h-3 text-indigo-600" />
                            Launch Assessment Portal
                          </a>
                        </>
                      ) : (
                        t.title
                      )}
                      <span className="text-slate-400 font-normal"> @ {t.company_name}</span>
                    </h4>

                    {/* Interactive weight overrides */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                      <span>Adjust Priority Weight:</span>
                      <select
                        value={t.importance_percentage || 50}
                        onChange={(e) => onUpdateTaskImportance(t.id, Number(e.target.value))}
                        className="bg-transparent border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 text-[9px] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-slate-400"
                      >
                        {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
                          <option key={v} value={v}>
                            {v}%
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 shrink-0">
                    {t.deadline && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Due: {new Date(t.deadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onLockIn(t)}
                        className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-600 text-[10px] rounded-md font-bold hover:bg-indigo-100/50 hover:text-indigo-700 transition-all flex items-center gap-1 cursor-pointer"
                        title="Lock In Focus Chamber"
                      >
                        <Lock className="w-3 h-3 text-indigo-500" />
                        <span>Lock In</span>
                      </button>
                      <button
                        onClick={() => onUpdateStatus(t.id, "missed")}
                        className="px-2.5 py-1 border border-rose-200 text-rose-600 text-[10px] rounded-md font-semibold hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Missed
                      </button>
                      <button
                        onClick={() => onUpdateStatus(t.id, "completed")}
                        className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] rounded-md font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Injected Roadmaps / Upskilling Sidecard */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
            <h3 className="text-base font-display font-semibold text-[#0f172a]">
              Adaptive Upskilling Target
            </h3>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {activeUpskilling.length === 0 ? (
              <div className="text-center py-10">
                <Flame className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-800">No Post-Mortems Active</h4>
                <p className="text-xs text-[#64748b] mt-1">
                  Once you review passed/missed OAs, Gemini injects tailored upskilling plans here.
                </p>
                <button
                  onClick={() => onNavigateToTab("upskilling")}
                  className="mt-3 text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Perform Post-Mortem
                </button>
              </div>
            ) : (
              activeUpskilling.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900"
                >
                  <div className="text-xs font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-indigo-600" /> Dynamic Roadmap
                  </div>
                  <h5 className="text-[11px] font-bold mt-1 text-slate-800">
                    Reviewing: {t.title}
                  </h5>
                  <p className="text-[10px] font-mono text-[#3730a3] whitespace-pre-line leading-relaxed mt-2 p-2 bg-white/60 border border-indigo-200/40 rounded">
                    {t.up_skilling_objective}
                  </p>
                  <RemedialSyllabusDropdown syllabusJson={t.up_skilling_syllabus} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
