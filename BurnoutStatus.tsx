import { Activity, Flame, ShieldAlert, Sparkles, TrendingUp, Zap } from "lucide-react";

interface BurnoutStatusProps {
  compliance: number;
  hasUrgentTask: boolean;
  urgentCompanyName?: string;
  onRefresh: () => void;
}

export default function BurnoutStatus({
  compliance,
  hasUrgentTask,
  urgentCompanyName,
  onRefresh,
}: BurnoutStatusProps) {
  // Determine mode
  let mode: "Recovery" | "Thriving" | "Balanced" = "Balanced";
  if (compliance < 60) {
    mode = "Recovery";
  } else if (compliance >= 95) {
    mode = "Thriving";
  }

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">
            Kairos Governor Core
          </span>
          <h2 className="text-2xl font-display font-semibold text-[#0f172a] mt-1">
            Systemic Fatigue &amp; Urgency Analyzer
          </h2>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 text-sm font-medium border border-[#cbd5e1] rounded-lg hover:bg-[#f1f5f9] transition-colors flex items-center gap-2 text-[#475569]"
        >
          <Activity className="w-4 h-4" />
          Recalculate Engine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Metric Card */}
        <div className="border border-[#e2e8f0] rounded-xl p-5 bg-[#f8fafc] flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border border-[#e2e8f0] text-[#0f172a]">
            {compliance < 60 ? (
              <Flame className="w-6 h-6 text-[#ef4444]" />
            ) : compliance >= 95 ? (
              <Sparkles className="w-6 h-6 text-[#10b981]" />
            ) : (
              <Activity className="w-6 h-6 text-[#3b82f6]" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-[#64748b]">48-Hour Compliance</div>
            <div className="text-3xl font-display font-bold text-[#0f172a]">
              {compliance}%
            </div>
          </div>
        </div>

        {/* Burnout Profile Card */}
        <div className="border border-[#e2e8f0] rounded-xl p-5 bg-[#f8fafc] flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border border-[#e2e8f0]">
            {hasUrgentTask ? (
              <Zap className="w-6 h-6 text-[#eab308] animate-pulse" />
            ) : mode === "Recovery" ? (
              <ShieldAlert className="w-6 h-6 text-[#f97316]" />
            ) : mode === "Thriving" ? (
              <TrendingUp className="w-6 h-6 text-[#10b981]" />
            ) : (
              <Activity className="w-6 h-6 text-[#475569]" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-[#64748b]">Current Pacing Mode</div>
            <div className="text-xl font-display font-bold text-[#0f172a]">
              {hasUrgentTask
                ? "Hyper-Focus Mode"
                : mode === "Recovery"
                ? "Recovery Mode"
                : mode === "Thriving"
                ? "Thriving Mode"
                : "Balanced Mode"}
            </div>
          </div>
        </div>

        {/* Governor Adjustment Actions */}
        <div className="border border-[#e2e8f0] rounded-xl p-5 bg-[#f8fafc] flex flex-col justify-center">
          <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">
            Automated Interventions
          </span>
          <div className="text-sm text-[#334155] mt-1 font-sans">
            {hasUrgentTask ? (
              <span className="text-[#b45309] font-medium">
                🚨 CRITICAL OVERRIDE: Bypassing fatigue pacing due to upcoming{" "}
                {urgentCompanyName || "placement"} OA/Interview. Readying prep blocks.
              </span>
            ) : mode === "Recovery" ? (
              <span className="text-[#c2410c] font-medium">
                🧡 System is overwhelmed. Non-placement study tasks delayed. All flexible habits
                deactivated to avoid burnout.
              </span>
            ) : mode === "Thriving" ? (
              <span className="text-[#047857] font-medium">
                💎 High momentum detected. Micro-habits scheduled in open voids to eliminate
                unproductive downtime.
              </span>
            ) : (
              <span>
                Standard academic pacing is active. 10-minute buffers applied to prevent schedule
                clashes.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
