import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Sliders,
  Calendar,
  Zap,
  RefreshCw,
  PlusCircle,
  Clock,
  LayoutDashboard,
  BookOpen,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Terminal,
  HelpCircle,
  Settings as SettingsIcon,
  Shield,
  Trello,
  Check,
  AlertTriangle
} from "lucide-react";
import { HardConstraint, Task, Habit, AgentLog } from "./types";
import BurnoutStatus from "./components/BurnoutStatus";
import Dropzone from "./components/Dropzone";
import Timeline from "./components/Timeline";
import ChronoShield from "./components/ChronoShield";
import Retrospective from "./components/Retrospective";
import NetworkLog from "./components/NetworkLog";
import AuthScreen from "./components/AuthScreen";
import OnboardingTutorial from "./components/OnboardingTutorial";
import FocusChamber from "./components/FocusChamber";
import DashboardView from "./components/DashboardView";
import PipelinesManager from "./components/PipelinesManager";

export default function App() {
  // Session authentication state
  const [session, setSession] = useState<{ email: string; name: string; avatar?: string } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [pipelineSubTab, setPipelineSubTab] = useState<"calendar" | "architect">("calendar");

  // Core application data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [compliance, setCompliance] = useState<number>(100);
  const [constraints, setConstraints] = useState<HardConstraint[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  // Progressive Disclosure / Accordion States
  const [isManualFormExpanded, setIsManualFormExpanded] = useState(false);
  const [isChronoDetailsExpanded, setIsChronoDetailsExpanded] = useState(false);
  const [isRetroInfoExpanded, setIsRetroInfoExpanded] = useState(true);
  const [isTelemetryExpanded, setIsTelemetryExpanded] = useState(true);
  const [showPriorityEnginePanel, setShowPriorityEnginePanel] = useState(false);

  // Manual Quick Task creation state
  const [manualTitle, setManualTitle] = useState("");
  const [manualCompany, setManualCompany] = useState("");
  const [manualStage, setManualStage] = useState<"Registration" | "OA" | "Interview" | "None">("None");
  const [manualDuration, setManualDuration] = useState(60);
  const [manualLoad, setManualLoad] = useState<"high" | "medium" | "low">("medium");
  const [manualDeadline, setManualDeadline] = useState("");

  // Check auth session on load
  useEffect(() => {
    const savedSession = localStorage.getItem("omnipse_session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSession(parsed);
        
        // Check if onboarding is requested for new user
        const needTutorial = localStorage.getItem("omnipse_show_tutorial");
        if (needTutorial === "true") {
          setShowTutorial(true);
        }
      } catch (e) {
        console.error("Failed to parse saved session", e);
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      const scheduleRes = await fetch("/api/schedule");
      const scheduleData = await scheduleRes.json();
      setTasks(scheduleData.tasks || []);
      setHabits(scheduleData.habits || []);
      setCompliance(scheduleData.compliance ?? 100);

      const constraintsRes = await fetch("/api/constraints");
      const constraintsData = await constraintsRes.json();
      setConstraints(constraintsData || []);

      const logsRes = await fetch("/api/logs");
      const logsData = await logsRes.json();
      setLogs(logsData || []);
    } catch (err) {
      console.error("Failed to fetch dashboard state:", err);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
      // Poll logs and updates every 5 seconds to keep the simulator alive
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleManualTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: manualTitle,
          company_name: manualCompany,
          recruitment_stage: manualStage,
          duration_minutes: Number(manualDuration),
          cognitive_load: manualLoad,
          deadline: manualDeadline || undefined,
        }),
      });

      if (res.ok) {
        setManualTitle("");
        setManualCompany("");
        setManualStage("None");
        setManualDuration(60);
        setManualLoad("medium");
        setManualDeadline("");
        setIsManualFormExpanded(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to create task manually:", err);
    }
  };

  const handleUpdateStatus = async (id: number, status: "completed" | "missed") => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleAddConstraint = async (constraint: Partial<HardConstraint>) => {
    try {
      const res = await fetch("/api/constraints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(constraint),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to add hard constraint:", err);
    }
  };

  const handleDeleteConstraint = async (id: number) => {
    try {
      const res = await fetch(`/api/constraints/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to delete constraint:", err);
    }
  };

  const handleUpdateConstraintImportance = async (id: number, importance_percentage: number) => {
    try {
      const res = await fetch(`/api/constraints/${id}/importance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ importance_percentage }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to update constraint importance:", err);
    }
  };

  const handleUpdateHabitImportance = async (id: number, importance_percentage: number) => {
    try {
      const res = await fetch(`/api/habits/${id}/importance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ importance_percentage }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to update habit importance:", err);
    }
  };

  const handleUpdateTaskImportance = async (id: number, importance_percentage: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}/importance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ importance_percentage }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to update task importance:", err);
    }
  };

  const handleForceRecalculate = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/recalculate", { method: "POST" });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error("Failed to recalculate:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("omnipse_session");
    localStorage.removeItem("omnipse_show_tutorial");
    setSession(null);
    setShowTutorial(false);
  };

  const handleAuthSuccess = (user: { email: string; name: string; avatar?: string }) => {
    setSession(user);
    const needTutorial = localStorage.getItem("omnipse_show_tutorial");
    if (needTutorial === "true") {
      setShowTutorial(true);
    }
  };

  // Find if there's any pending urgent task to highlight
  const urgentTask = tasks.find((t) => {
    if (!t.deadline || t.status !== "pending") return false;
    const hoursToDeadline = (new Date(t.deadline).getTime() - Date.now()) / (3600 * 1000);
    return (t.recruitment_stage === "OA" || t.recruitment_stage === "Interview") && hoursToDeadline <= 48;
  });

  // Render Authentication overlay if no active session
  if (!session) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  if (activeFocusTask) {
    return (
      <FocusChamber
        task={activeFocusTask}
        onExit={() => setActiveFocusTask(null)}
        onCompleteTask={(id) => {
          handleUpdateStatus(id, "completed");
          setActiveFocusTask(null);
        }}
        onRefreshAll={fetchData}
      />
    );
  }

  // Handle Navigation Grid actions smoothly
  const handleGridAction = (action: string) => {
    if (action === "chrono-shield") {
      setActiveTab("settings");
      const el = document.getElementById("chrono-shield-step");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (action === "dropzone") {
      setActiveTab("pipeline");
      setPipelineSubTab("calendar");
      setTimeout(() => {
        const el = document.getElementById("dropzone-step");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    } else if (action === "kanban") {
      setActiveTab("pipeline");
      setPipelineSubTab("architect");
    } else if (action === "focus") {
      const pendingTask = tasks.find(t => t.status === "pending");
      if (pendingTask) {
        setActiveFocusTask(pendingTask);
      } else {
        alert("No active pending tasks. Please ingest or create a task first to initiate Focus Chamber.");
      }
    } else if (action === "council-logs") {
      const el = document.getElementById("execution-log-step");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else if (action === "priority") {
      setShowPriorityEnginePanel(!showPriorityEnginePanel);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 relative overflow-x-hidden">
      {/* Onboarding guided overlay tour */}
      {showTutorial && (
        <OnboardingTutorial onClose={() => setShowTutorial(false)} />
      )}

      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* TOP HEADER BAR */}
      <header className="bg-slate-950/80 border-b border-slate-900/60 h-16 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black tracking-tight text-white text-lg">
              Kairos AI
            </span>
            <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider font-semibold">
              Cognitive Shield
            </span>
          </div>
        </div>

        {/* Real-time Status indicator */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800/80 rounded-full text-xs text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>System Status: <strong className="text-emerald-400">Optimized</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>2026-06-30 UTC</span>
          </div>
        </div>

        {/* Google Authentication state user profile widget */}
        <div id="google-profile-step" className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800/80 px-3.5 py-1.5 rounded-xl text-xs shadow-md">
            <span className="text-lg bg-slate-800 p-1 rounded-lg leading-none">
              {session.avatar || "🧠"}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-white font-bold truncate max-w-[120px]">{session.name}</span>
              <span className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]">{session.email}</span>
            </div>
            
            <button
              onClick={handleSignOut}
              className="ml-2 text-slate-400 hover:text-rose-400 p-1 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Sign Out Google Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <button
            onClick={() => setShowTutorial(true)}
            className="p-2 text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800 border border-slate-800/80 rounded-xl transition-all cursor-pointer"
            title="Launch Interactive Walkthrough"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN VIEW LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8 relative z-10">
        
        {/* PREMIUM UNIFIED NAVIGATION GRID */}
        <section id="navigation-grid-step" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-bold">
                Autopilot Subsystems
              </h2>
              <p className="text-sm text-slate-400">
                Click a core module below to instantly focus or trigger real-time de-confliction.
              </p>
            </div>
            
            <button
              onClick={handleForceRecalculate}
              disabled={isRefreshing}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Recalculate Autopilot
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 1. Chrono Shield */}
            <button
              onClick={() => handleGridAction("chrono-shield")}
              className={`flex flex-col items-start text-left p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer bg-slate-900/40 ${
                activeTab === "settings" 
                  ? "border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] bg-indigo-950/10" 
                  : "border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/60"
              }`}
            >
              <span className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-white block mb-0.5">Chrono-Shield</span>
              <span className="text-[10px] text-slate-400 leading-tight">Immutable buffer rules</span>
            </button>

            {/* 2. Dropzone */}
            <button
              onClick={() => handleGridAction("dropzone")}
              className={`flex flex-col items-start text-left p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer bg-slate-900/40 ${
                activeTab === "pipeline" && pipelineSubTab === "calendar"
                  ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-emerald-950/10"
                  : "border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900/60"
              }`}
            >
              <span className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-white block mb-0.5">Dropzone</span>
              <span className="text-[10px] text-slate-400 leading-tight">Multimodal ingestion</span>
            </button>

            {/* 3. Kanban Pipeline */}
            <button
              onClick={() => handleGridAction("kanban")}
              className={`flex flex-col items-start text-left p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer bg-slate-900/40 ${
                activeTab === "pipeline" && pipelineSubTab === "architect"
                  ? "border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.15)] bg-violet-950/10"
                  : "border-slate-800/80 hover:border-violet-500/50 hover:bg-slate-900/60"
              }`}
            >
              <span className="p-2.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <Trello className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-white block mb-0.5">Kanban Pipeline</span>
              <span className="text-[10px] text-slate-400 leading-tight">Track stages &amp; milestones</span>
            </button>

            {/* 4. Focus Chamber */}
            <button
              onClick={() => handleGridAction("focus")}
              className="flex flex-col items-start text-left p-4 rounded-2xl border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900/60 transition-all duration-300 relative group cursor-pointer bg-slate-900/40"
            >
              <span className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-white block mb-0.5">Focus Chamber</span>
              <span className="text-[10px] text-slate-400 leading-tight">Immersive timer core</span>
            </button>

            {/* 5. Agent Logs */}
            <button
              onClick={() => handleGridAction("council-logs")}
              className="flex flex-col items-start text-left p-4 rounded-2xl border border-slate-800/80 hover:border-rose-500/50 hover:bg-slate-900/60 transition-all duration-300 relative group cursor-pointer bg-slate-900/40"
            >
              <span className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <Terminal className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-white block mb-0.5">Agent Council Log</span>
              <span className="text-[10px] text-slate-400 leading-tight">Live telemetry live feed</span>
            </button>

            {/* 6. Priority Engine */}
            <button
              onClick={() => handleGridAction("priority")}
              className={`flex flex-col items-start text-left p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer bg-slate-900/40 ${
                showPriorityEnginePanel
                  ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-cyan-950/10"
                  : "border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/60"
              }`}
            >
              <span className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <Sliders className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-white block mb-0.5">Priority Engine</span>
              <span className="text-[10px] text-slate-400 leading-tight">De-conflict weights</span>
            </button>
          </div>
        </section>

        {/* PRIORITY WEIGHTS AND REAL-TIME DE-CONFLICTION INTERACTIVE HUB */}
        {showPriorityEnginePanel && (
          <div className="bg-slate-900/80 border border-cyan-500/30 p-6 rounded-3xl shadow-[0_0_25px_rgba(6,182,212,0.05)] backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                  Priority Vector Weighting Engine
                </h3>
              </div>
              <button
                onClick={() => setShowPriorityEnginePanel(false)}
                className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                [Minimize]
              </button>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Adjust the <strong>importance percentage</strong> vectors below to recalculate alignment. Our backend's <code>checkTemporalOverlap</code> de-confliction engine instantly evaluates overlaps. The lower-weighted task is bumped to the next open slot with a mandatory 10-minute buffer space.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Task weighting slider panel */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Active Milestone Overlap Overrides
                </h4>
                {tasks.filter(t => t.status === "pending").length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">No pending tasks found. Ingest files to seed tasks.</p>
                ) : (
                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                    {tasks.filter(t => t.status === "pending").map((task) => (
                      <div key={task.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/50 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-200 truncate max-w-[180px]">{task.title}</span>
                          <span className="text-cyan-400 font-mono font-bold">{task.importance_percentage || 60}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={task.importance_percentage || 60}
                          onChange={(e) => handleUpdateTaskImportance(task.id, Number(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Habit/Constraint weights */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Protected Habits &amp; Commitments Weightings
                </h4>
                {habits.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">No active habits found.</p>
                ) : (
                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                    {habits.map((h) => (
                      <div key={h.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/50 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-200 truncate max-w-[180px]">{h.title}</span>
                          <span className="text-indigo-400 font-mono font-bold">{h.importance_percentage || 40}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={h.importance_percentage || 40}
                          onChange={(e) => handleUpdateHabitImportance(h.id, Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Burnout status strip */}
        <BurnoutStatus
          compliance={compliance}
          hasUrgentTask={!!urgentTask}
          urgentCompanyName={urgentTask?.company_name}
          onRefresh={handleForceRecalculate}
        />

        {/* PRIMARY ACTION TAB RENDERING */}
        <div className="space-y-8">
          
          {/* 1. DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <DashboardView
                tasks={tasks}
                habits={habits}
                compliance={compliance}
                constraints={constraints}
                onUpdateStatus={handleUpdateStatus}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onDemoLaunched={fetchData}
                onLockIn={(task) => setActiveFocusTask(task)}
                onUpdateTaskImportance={handleUpdateTaskImportance}
              />
              
              {/* Secondary Navigation shortcuts footer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <button
                  onClick={() => setActiveTab("pipeline")}
                  className="bg-slate-900/30 border border-slate-800 hover:border-slate-700/80 p-5 rounded-2xl text-left cursor-pointer transition-all"
                >
                  <h4 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" /> Open Interactive 7-Day Timeline
                  </h4>
                  <p className="text-xs text-slate-400">
                    See exactly how non-overlapping intervals are allocated across class timetables.
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab("upskilling")}
                  className="bg-slate-900/30 border border-slate-800 hover:border-slate-700/80 p-5 rounded-2xl text-left cursor-pointer transition-all"
                >
                  <h4 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-violet-400" /> Review Post-Mortem Retrospectives
                  </h4>
                  <p className="text-xs text-slate-400">
                    Sift through failure points to auto-generate adaptive tutorial tracks.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* 2. PIPELINE VIEW */}
          {activeTab === "pipeline" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                {/* Sub-tab segment selector */}
                <div className="flex border-b border-slate-800">
                  <button
                    onClick={() => setPipelineSubTab("calendar")}
                    className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      pipelineSubTab === "calendar"
                        ? "border-indigo-500 text-white font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Protected Timeline
                  </button>
                  <button
                    onClick={() => setPipelineSubTab("architect")}
                    className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      pipelineSubTab === "architect"
                        ? "border-indigo-500 text-white font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Dynamic Tracks Architect
                  </button>
                </div>

                {pipelineSubTab === "calendar" ? (
                  /* 7-day eager schedule calendar */
                  <Timeline
                    tasks={tasks}
                    habits={habits}
                    onUpdateStatus={handleUpdateStatus}
                    onLockIn={(task) => setActiveFocusTask(task)}
                    onRefresh={fetchData}
                  />
                ) : (
                  /* Dynamic customizable pipelines manager */
                  <PipelinesManager onRefreshAll={fetchData} />
                )}
              </div>

              <div className="space-y-8">
                {/* Multimodal notice dropzone */}
                <div id="dropzone-step">
                  <Dropzone onIngestSuccess={fetchData} />
                </div>

                {/* Progressive disclosure: Collapsible Manual Task Entry */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-md">
                  <button
                    onClick={() => setIsManualFormExpanded(!isManualFormExpanded)}
                    className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <div>
                      <h3 className="text-sm font-display font-semibold text-white">
                        Manual Milestones Ingress
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Insert custom OA or interview slots manually.
                      </p>
                    </div>
                    <span className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">
                      {isManualFormExpanded ? (
                        <ChevronLeft className="w-4 h-4 rotate-90" />
                      ) : (
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      )}
                    </span>
                  </button>

                  {isManualFormExpanded && (
                    <form
                      onSubmit={handleManualTaskSubmit}
                      className="mt-4 pt-4 border-t border-slate-800 space-y-4"
                    >
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider">
                          Task / Prep Title
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Amazon OA Revision"
                          value={manualTitle}
                          onChange={(e) => setManualTitle(e.target.value)}
                          className="w-full text-xs bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider">
                            Company Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Microsoft"
                            value={manualCompany}
                            onChange={(e) => setManualCompany(e.target.value)}
                            className="w-full text-xs bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider">
                            Recruitment Stage
                          </label>
                          <select
                            value={manualStage}
                            onChange={(e: any) => setManualStage(e.target.value)}
                            className="w-full text-xs bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-white focus:outline-none bg-slate-950 cursor-pointer"
                          >
                            <option value="None">None (Up-skilling)</option>
                            <option value="Registration">Registration</option>
                            <option value="OA">OA (Online Assessment)</option>
                            <option value="Interview">Interview</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider">
                            Duration (Mins)
                          </label>
                          <input
                            type="number"
                            min="15"
                            max="300"
                            step="15"
                            required
                            value={manualDuration}
                            onChange={(e) => setManualDuration(Number(e.target.value))}
                            className="w-full text-xs bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider">
                            Cognitive Load
                          </label>
                          <select
                            value={manualLoad}
                            onChange={(e: any) => setManualLoad(e.target.value)}
                            className="w-full text-xs bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-white focus:outline-none bg-slate-950 cursor-pointer"
                          >
                            <option value="low">Low Intensity</option>
                            <option value="medium">Medium Intensity</option>
                            <option value="high">High Intensity</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider">
                          Deadline Date &amp; Time
                        </label>
                        <input
                          type="datetime-local"
                          value={manualDeadline}
                          onChange={(e) => setManualDeadline(e.target.value)}
                          className="w-full text-xs bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-white focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-indigo-600/15 cursor-pointer"
                      >
                        Insert &amp; Recalculate
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. UP-SKILLING TAB */}
          {activeTab === "upskilling" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                {/* Retrospective post-mortem loops */}
                <Retrospective tasks={tasks} onRetrospectiveSuccess={fetchData} />
              </div>

              <div className="space-y-8">
                {/* Explanatory progressive disclosure box */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-md">
                  <button
                    onClick={() => setIsRetroInfoExpanded(!isRetroInfoExpanded)}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-sm font-semibold text-white">
                        Adaptive Tutoring Core
                      </h4>
                    </div>
                    <span className="p-1 bg-slate-850 hover:bg-slate-800 rounded text-slate-400 transition-colors">
                      {isRetroInfoExpanded ? (
                        <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                      )}
                    </span>
                  </button>

                  {isRetroInfoExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2.5">
                      <p>
                        Failure points shouldn't trigger despair; they should initiate upskilling pipelines.
                      </p>
                      <p>
                        Our integration with <strong>Gemini Pro</strong> parses student reflection logs, isolating structural conceptual failures. It then synthesizes daily modular lessons directly inside the timetable gaps.
                      </p>
                      <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-300 font-mono">
                        <span className="font-bold uppercase tracking-wider block mb-1">
                          Automatic Tracing:
                        </span>
                        The scheduling core automatically shifts buffers after high cognitive load tasks are logged, preventing mental exhaustion.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. SETTINGS & PROTECTION TAB */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div id="chrono-shield-step" className="xl:col-span-2 space-y-8">
                {/* ChronoShield protections */}
                <ChronoShield
                  constraints={constraints}
                  onAddConstraint={handleAddConstraint}
                  onDeleteConstraint={handleDeleteConstraint}
                  onUpdateConstraintImportance={handleUpdateConstraintImportance}
                  habits={habits}
                  onUpdateHabitImportance={handleUpdateHabitImportance}
                />
              </div>

              <div className="space-y-8">
                {/* Progressive disclosure: Custom ChronoShield configurations */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-md">
                  <button
                    onClick={() => setIsChronoDetailsExpanded(!isChronoDetailsExpanded)}
                    className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <SettingsIcon className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-sm font-semibold text-white">
                        Shield Configurations
                      </h4>
                    </div>
                    <span className="p-1 bg-slate-850 hover:bg-slate-800 rounded text-slate-400 transition-colors">
                      {isChronoDetailsExpanded ? (
                        <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                      )}
                    </span>
                  </button>

                  {isChronoDetailsExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-4">
                      <div className="space-y-2">
                        <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          Automatic Deflection
                        </span>
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 h-4 w-4 cursor-pointer"
                          />
                          <span>Deflect tasks from medical buffers</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 h-4 w-4 cursor-pointer"
                          />
                          <span>Enforce 15-minute commute/travel buffer</span>
                        </label>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          Burnout Guard Sensitivity
                        </span>
                        <select className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none text-slate-300 cursor-pointer">
                          <option>Optimal (Recommended)</option>
                          <option>Aggressive (Extra Relaxation)</option>
                          <option>Strict (Academics First)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TELEMETRY ENGINE LOGGER (COLLAPSIBLE FOOTER BAR) */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-md">
            <button
              onClick={() => setIsTelemetryExpanded(!isTelemetryExpanded)}
              className="w-full p-4 flex items-center justify-between bg-slate-950/80 text-slate-300 font-semibold text-xs uppercase font-mono tracking-wider focus:outline-none hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" /> Kairos Live Telemetry Log Feed
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {isTelemetryExpanded ? "[Collapse Feed]" : "[Expand Feed]"}
              </span>
            </button>
            {isTelemetryExpanded && (
              <div id="execution-log-step">
                <NetworkLog logs={logs} onRefresh={fetchData} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
