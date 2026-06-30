import { Terminal, RefreshCw, Layers } from "lucide-react";
import { AgentLog } from "../types";

interface NetworkLogProps {
  logs: AgentLog[];
  onRefresh: () => void;
}

export default function NetworkLog({ logs, onRefresh }: NetworkLogProps) {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "urgency_sentinel": return "Urgency_Sentinel";
      case "burnout_governor": return "Burnout_Governor";
      case "chrono_gatekeeper": return "Chrono_Gatekeeper";
      case "habit_architect": return "Habit_Architect";
      case "skill_synthesizer": return "Skill_Synthesizer";
      case "admin_quartermaster": return "Admin_Quartermaster";
      case "focus_guardian": return "Focus_Guardian";
      default: return cat;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "ingestion":
        return "text-fuchsia-400 font-bold";
      case "scheduling":
        return "text-cyan-400 font-bold";
      case "governor":
        return "text-amber-400 font-bold";
      case "retrospective":
        return "text-emerald-400 font-bold";
      case "urgency_sentinel":
        return "text-rose-400 font-bold";
      case "burnout_governor":
        return "text-amber-400 font-bold";
      case "chrono_gatekeeper":
        return "text-sky-400 font-bold";
      case "habit_architect":
        return "text-violet-400 font-bold";
      case "skill_synthesizer":
        return "text-emerald-400 font-bold";
      case "admin_quartermaster":
        return "text-orange-400 font-bold";
      case "focus_guardian":
        return "text-yellow-400 font-bold";
      default:
        return "text-slate-400 font-bold";
    }
  };

  const formatTimestamp = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div id="execution-log-step" className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-inner flex flex-col h-full font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <h3 className="font-display font-semibold text-slate-200 tracking-wide">
            Kairos Agent Network Logs
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            System Live
          </span>
          <button
            onClick={onRefresh}
            className="text-slate-400 hover:text-white transition-colors ml-2"
            title="Refresh logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[220px] scrollbar-thin scrollbar-thumb-slate-700 bg-black/40 p-3 rounded-lg border border-slate-900 leading-relaxed text-slate-300">
        {logs.length === 0 ? (
          <div className="text-slate-500 italic py-4 text-center">
            Initializing telemetry feed...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2 items-start hover:bg-slate-900/40 p-0.5 rounded">
              <span className="text-slate-500 shrink-0 font-medium select-none">
                [{formatTimestamp(log.timestamp)}]
              </span>
              <span className={`${getCategoryColor(log.category)} uppercase tracking-wider text-[10px] shrink-0 font-bold`}>
                [{getCategoryLabel(log.category)}]
              </span>
              <span className="text-slate-300 break-words font-light">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 text-[10px] text-slate-500 flex justify-between items-center select-none">
        <span className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Core Agent Engine: v1.5.0-Release
        </span>
        <span>Secure SQLite Ingress</span>
      </div>
    </div>
  );
}
