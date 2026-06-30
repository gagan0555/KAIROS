import React, { useState } from "react";
import { ShieldAlert, Plus, Trash2, Calendar, Clock, AlertTriangle, Sparkles } from "lucide-react";
import { HardConstraint, Habit } from "../types";

interface ChronoShieldProps {
  constraints: HardConstraint[];
  onAddConstraint: (constraint: Partial<HardConstraint>) => void;
  onDeleteConstraint: (id: number) => void;
  onUpdateConstraintImportance?: (id: number, importance: number) => void;
  habits?: Habit[];
  onUpdateHabitImportance?: (id: number, importance: number) => void;
}

export default function ChronoShield({
  constraints,
  onAddConstraint,
  onDeleteConstraint,
  onUpdateConstraintImportance,
  habits,
  onUpdateHabitImportance,
}: ChronoShieldProps) {
  const [type, setType] = useState<"timetable" | "exam" | "medical">("timetable");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);

  const handleDayToggle = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startTime || !endTime) return;

    if (type === "timetable") {
      if (daysOfWeek.length === 0) return;
      onAddConstraint({
        type,
        title,
        start_time: startTime,
        end_time: endTime,
        days_of_week: daysOfWeek.join(","),
      });
    } else {
      if (!date) return;
      // Convert start/end to full ISO strings
      const startISO = new Date(`${date}T${startTime}`).toISOString();
      const endISO = new Date(`${date}T${endTime}`).toISOString();
      onAddConstraint({
        type,
        title,
        start_time: startISO,
        end_time: endISO,
        date,
      });
    }

    // Reset Form
    setTitle("");
    setStartTime("");
    setEndTime("");
    setDate("");
    setDaysOfWeek([]);
  };

  const getDayName = (dayNum: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayNum];
  };

  return (
    <div id="chrono-shield-step" className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-[#475569]" />
        <h3 className="text-lg font-display font-semibold text-[#0f172a]">
          Immutable Lifecycle Commitments
        </h3>
      </div>
      <p className="text-sm text-[#64748b] mb-6">
        Register immutable recurring or one-off blocks (such as School Hours, Office shifts, Mandatory Family Windows, or Medical Treatments). The scheduling engine is strictly barred from allocating tasks here.
      </p>

      {/* Constraints List */}
      <div className="flex-1 overflow-y-auto max-h-[220px] mb-6 space-y-3 pr-1">
        {constraints.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-[#e2e8f0] rounded-lg">
            <span className="text-xs text-[#64748b] font-medium">No protected blocks registered.</span>
          </div>
        ) : (
          constraints.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold bg-[#e2e8f0] text-[#0f172a]">
                    {c.type}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                    Weight: {c.importance_percentage || 80}%
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#0f172a] mt-1">{c.title}</h4>
                
                {/* Manual Weight Override Controller */}
                {onUpdateConstraintImportance && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                    <span>Adjust Importance Weight:</span>
                    <select
                      value={c.importance_percentage || 80}
                      onChange={(e) => onUpdateConstraintImportance(c.id, Number(e.target.value))}
                      className="bg-transparent border border-slate-200 rounded px-1 py-0.5 text-slate-800 text-[9px] focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono font-bold"
                    >
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => (
                        <option key={num} value={num}>
                          {num}%
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="text-xs text-[#64748b] mt-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {c.type === "timetable" ? (
                    <span>
                      {c.start_time} - {c.end_time} on (
                      {c.days_of_week
                        ?.split(",")
                        .map(Number)
                        .map(getDayName)
                        .join(", ")}
                      )
                    </span>
                  ) : (
                    <span>
                      {new Date(c.start_time).toLocaleDateString()} at{" "}
                      {new Date(c.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(c.end_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDeleteConstraint(c.id)}
                className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                title="Remove Hard Constraint"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Flexible Habits Utility Weights Section */}
      {habits && habits.length > 0 && (
        <div className="border-t border-[#f1f5f9] pt-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
            <h4 className="text-sm font-display font-semibold text-[#0f172a]">
              Flexible Routine Habits Overrides
            </h4>
          </div>
          <p className="text-xs text-[#64748b] mb-4">
            Adjust the importance weights of your routines. Higher priority habits persist through Burnout recovery pacing blockdowns.
          </p>
          <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
            {habits.map((h) => (
              <div
                key={h.id}
                className="p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0f172a]">{h.title}</span>
                    <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-bold">
                      Weight: {h.importance_percentage || 50}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block mt-0.5">
                    Type: {h.type}
                  </span>
                </div>

                {onUpdateHabitImportance && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono">Weight:</span>
                    <select
                      value={h.importance_percentage || 50}
                      onChange={(e) => onUpdateHabitImportance(h.id, Number(e.target.value))}
                      className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 text-[10px] focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono font-bold"
                    >
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => (
                        <option key={num} value={num}>
                          {num}%
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Constraint Form */}
      <form onSubmit={handleSubmit} className="border-t border-[#f1f5f9] pt-4 space-y-4">
        <span className="block text-xs font-mono uppercase tracking-wider text-[#64748b]">
          Protect Immutable Block
        </span>

        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "timetable", label: "Recurring" },
            { value: "exam", label: "One-off" },
            { value: "medical", label: "Personal" }
          ].map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setType(t.value as any);
                setDaysOfWeek([]);
                setDate("");
              }}
              className={`py-1.5 px-2 text-[10px] font-semibold rounded-lg border uppercase font-mono transition-all ${
                type === t.value
                  ? "bg-[#0f172a] text-white border-[#0f172a]"
                  : "border-[#cbd5e1] text-[#475569] hover:bg-[#f1f5f9]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            required
            placeholder="Constraint Title (e.g., Daily Lab Session)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm p-2.5 border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#475569] text-[#334155]"
          />

          {type !== "timetable" && (
            <div className="flex items-center gap-2 border border-[#cbd5e1] rounded-lg p-2 bg-[#f8fafc]">
              <Calendar className="w-4 h-4 text-[#64748b]" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm focus:outline-none text-[#334155] bg-transparent"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono text-[#64748b] mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-sm p-2 border border-[#cbd5e1] rounded-lg text-[#334155] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-[#64748b] mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-sm p-2 border border-[#cbd5e1] rounded-lg text-[#334155] focus:outline-none"
              />
            </div>
          </div>

          {type === "timetable" && (
            <div>
              <label className="block text-[10px] font-mono text-[#64748b] mb-1.5">
                Select Repeating Days (Mon-Fri)
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      daysOfWeek.includes(day)
                        ? "bg-[#475569] text-white border-[#475569]"
                        : "border-[#cbd5e1] text-[#475569] hover:bg-[#f1f5f9]"
                    }`}
                  >
                    {getDayName(day)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-2"
        >
          <Plus className="w-4 h-4" /> Activate Protection
        </button>
      </form>
    </div>
  );
}
