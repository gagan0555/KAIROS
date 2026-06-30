import React from "react";
import { Clock, ExternalLink, CheckCircle2, XCircle, AlertTriangle, PlayCircle, Lock } from "lucide-react";
import { Task, Habit } from "../types";

interface TimelineProps {
  tasks: Task[];
  habits: Habit[];
  onUpdateStatus: (id: number, status: "completed" | "missed") => void;
  onLockIn?: (task: Task) => void;
  onRefresh?: () => void;
}

export default function Timeline({ tasks, habits, onUpdateStatus, onLockIn, onRefresh }: TimelineProps) {
  // Combine tasks and habits that are scheduled
  const scheduledItems: Array<{
    id: number;
    title: string;
    type: "task" | "habit";
    start: string;
    end: string;
    cognitiveLoad?: string;
    companyName?: string;
    recruitmentStage?: string;
    portalLink?: string;
    buffer?: number;
    status?: string;
    habitType?: string;
    importance?: number;
  }> = [];

  tasks.forEach((t) => {
    if (t.scheduled_start && t.scheduled_end) {
      scheduledItems.push({
        id: t.id,
        title: t.title,
        type: "task",
        start: t.scheduled_start,
        end: t.scheduled_end,
        cognitiveLoad: t.cognitive_load,
        companyName: t.company_name,
        recruitmentStage: t.recruitment_stage,
        portalLink: t.portal_link,
        buffer: t.buffer_minutes,
        status: t.status,
        importance: t.importance_percentage || 60,
      });
    }
  });

  habits.forEach((h) => {
    if (h.scheduled_start && h.scheduled_end) {
      scheduledItems.push({
        id: h.id,
        title: h.title,
        type: "habit",
        start: h.scheduled_start,
        end: h.scheduled_end,
        buffer: 5, // Habits get 5m buffer
        habitType: h.type,
        importance: h.importance_percentage || 40,
      });
    }
  });

  // Sort chronologically
  scheduledItems.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // Group by date
  const groupedByDate: { [date: string]: typeof scheduledItems } = {};
  scheduledItems.forEach((item) => {
    const dStr = new Date(item.start).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    if (!groupedByDate[dStr]) {
      groupedByDate[dStr] = [];
    }
    groupedByDate[dStr].push(item);
  });

  const getStageColor = (stage?: string) => {
    switch (stage) {
      case "Registration":
        return "border-l-4 border-slate-500 bg-slate-900/30 border-slate-800 text-slate-300";
      case "OA":
        return "border-l-4 border-amber-500 bg-amber-950/10 border-amber-500/20 text-amber-200";
      case "Interview":
        return "border-l-4 border-indigo-500 bg-indigo-950/20 border-indigo-500/20 text-indigo-200";
      default:
        return "border-l-4 border-cyan-500 bg-cyan-950/10 border-cyan-500/20 text-cyan-200";
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-md flex flex-col h-full font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h3 className="text-lg font-display font-bold text-white">
            The Eager Scheduling Engine
          </h3>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-slate-950 text-indigo-400 border border-slate-800 rounded-full font-semibold">
          Conflict-Free Sync
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        Schedules are eagerly organized around existing constraints. Priority weights (importance %) resolve overlapping blocks automatically with a 10-minute protective shield.
      </p>

      <div className="flex-1 overflow-y-auto pr-1 space-y-6 max-h-[520px]">
        {Object.keys(groupedByDate).length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
            <Clock className="w-9 h-9 text-slate-600 mx-auto mb-2 animate-bounce" />
            <span className="text-sm text-slate-400 block font-semibold">No active timeline blocks.</span>
            <span className="text-xs text-slate-500 mt-1 block">
              Paste or drop text notices to run autopilot.
            </span>
          </div>
        ) : (
          Object.keys(groupedByDate).map((dateKey) => (
            <div key={dateKey} className="space-y-3">
              <div className="sticky top-0 bg-[#0a0d14]/90 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 font-mono border-b border-slate-800/80 flex justify-between items-center z-10 backdrop-blur-sm">
                <span>{dateKey}</span>
                {dateKey.includes("Today") && (
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 font-mono font-bold uppercase tracking-widest">
                    Today
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {groupedByDate[dateKey].map((item, idx) => {
                  const isTask = item.type === "task";
                  const duration = Math.round(
                    (new Date(item.end).getTime() - new Date(item.start).getTime()) / 60000
                  );

                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      className={`rounded-xl p-4 transition-all duration-300 border border-slate-800/40 relative hover:border-slate-700 ${getStageColor(
                        item.recruitmentStage
                      )}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
                              {formatTime(item.start)} - {formatTime(item.end)}
                            </span>
                            <span className="text-xs text-slate-400">({duration} mins)</span>
                            {item.recruitmentStage && item.recruitmentStage !== "None" && (
                              <span className="text-[10px] font-mono uppercase bg-slate-950 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-bold">
                                {item.recruitmentStage}
                              </span>
                            )}
                            {item.cognitiveLoad === "high" && (
                              <span className="text-[9px] font-mono uppercase bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 border border-rose-500/20">
                                <AlertTriangle className="w-3 h-3" /> High Load
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 flex-wrap">
                            {item.title}
                            {item.companyName && (
                              <span className="text-xs text-slate-400 font-normal">
                                @ {item.companyName}
                              </span>
                            )}
                          </h4>

                          {/* Portal Links */}
                          {item.portalLink && (
                            <a
                              href={item.portalLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1 mt-1 font-semibold"
                            >
                              Launch Portal <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Actions for Task Status */}
                        {isTask && item.status === "pending" && (
                          <div className="flex gap-1.5 shrink-0">
                            {onLockIn && (
                              <button
                                onClick={() => {
                                  const origTask = tasks.find((tk) => tk.id === item.id);
                                  if (origTask) onLockIn(origTask);
                                }}
                                className="p-2 text-indigo-400 hover:text-white bg-slate-950 border border-slate-800/80 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                                title="Lock In Focus Chamber"
                              >
                                <Lock className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => onUpdateStatus(item.id, "completed")}
                              className="p-2 text-emerald-400 hover:text-white bg-slate-950 border border-slate-800/80 hover:bg-emerald-950/40 rounded-lg transition-all cursor-pointer"
                              title="Mark as Completed"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onUpdateStatus(item.id, "missed")}
                              className="p-2 text-rose-400 hover:text-white bg-slate-950 border border-slate-800/80 hover:bg-rose-950/40 rounded-lg transition-all cursor-pointer"
                              title="Mark as Missed"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {isTask && item.status !== "pending" && (
                          <span
                            className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                              item.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}
                          >
                            {item.status}
                          </span>
                        )}

                        {!isTask && (
                          <span className="text-[9px] font-mono uppercase bg-slate-950 text-slate-500 px-2 py-0.5 rounded border border-slate-800 font-bold">
                            Habit Fill
                          </span>
                        )}
                      </div>

                      {/* Protective Buffer Visual Indicator */}
                      <div className="mt-3.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <PlayCircle className="w-3.5 h-3.5 text-indigo-400/60" /> Auto-Synced Google Calendar
                        </span>
                        <span className="bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800 text-slate-300 font-semibold text-[9px]">
                          🛡️ Overlap Gap: +{item.buffer || 10}m
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
