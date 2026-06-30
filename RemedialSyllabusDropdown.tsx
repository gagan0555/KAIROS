import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

interface Syllabus {
  day_by_day_objectives?: { day: number; objective: string }[];
  conceptual_frameworks?: string[];
  practice_points?: string[];
}

export default function RemedialSyllabusDropdown({ syllabusJson }: { syllabusJson?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!syllabusJson) return null;

  let syllabus: Syllabus | null = null;
  try {
    // If it's already an object, great. If not, parse it.
    syllabus = typeof syllabusJson === "string" ? JSON.parse(syllabusJson) : syllabusJson;
  } catch (e) {
    console.error("Failed to parse up_skilling_syllabus JSON:", e);
    return null;
  }

  if (!syllabus || (!syllabus.day_by_day_objectives && !syllabus.conceptual_frameworks && !syllabus.practice_points)) {
    return null;
  }

  return (
    <div className="mt-3 border-t border-indigo-100/60 pt-3">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between text-[10px] font-semibold tracking-wide uppercase text-indigo-700 bg-indigo-100/50 hover:bg-indigo-100 py-2 px-3 rounded-lg transition-all border border-indigo-200/50 cursor-pointer"
      >
        <span className="flex items-center gap-1.5 font-mono">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          {isOpen ? "Hide Syllabus Details" : "Expand Remedial Syllabus"}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-indigo-600 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 p-3 bg-white border border-indigo-100/80 rounded-lg shadow-sm space-y-4 text-slate-700 font-sans">
          {/* Day-by-day core objectives */}
          {syllabus.day_by_day_objectives && syllabus.day_by_day_objectives.length > 0 && (
            <div>
              <h6 className="text-[10px] font-bold uppercase tracking-wider text-indigo-800/90 mb-2 flex items-center gap-1.5 font-mono">
                📅 Day-by-Day Core Objectives
              </h6>
              <div className="space-y-2">
                {syllabus.day_by_day_objectives.map((obj, i) => (
                  <div key={i} className="flex gap-2.5 items-start text-xs leading-relaxed">
                    <span className="font-mono font-bold text-indigo-600 shrink-0 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded text-[10px]">
                      Day {obj.day}
                    </span>
                    <span className="text-slate-600 font-medium">{obj.objective}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Essential Conceptual Frameworks */}
          {syllabus.conceptual_frameworks && syllabus.conceptual_frameworks.length > 0 && (
            <div>
              <h6 className="text-[10px] font-bold uppercase tracking-wider text-indigo-800/90 mb-2 flex items-center gap-1.5 font-mono">
                🧠 Essential Conceptual Frameworks
              </h6>
              <ul className="list-disc pl-4 text-xs space-y-1.5 text-slate-600 font-medium">
                {syllabus.conceptual_frameworks.map((fw, i) => (
                  <li key={i}>{fw}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Practice Bullet Points */}
          {syllabus.practice_points && syllabus.practice_points.length > 0 && (
            <div>
              <h6 className="text-[10px] font-bold uppercase tracking-wider text-indigo-800/90 mb-2 flex items-center gap-1.5 font-mono">
                🚀 High-Impact Practice Challenges
              </h6>
              <div className="space-y-2">
                {syllabus.practice_points.map((pt, i) => (
                  <div
                    key={i}
                    className="flex gap-2.5 items-start text-xs leading-relaxed bg-slate-50 border border-slate-100/80 p-2.5 rounded-lg"
                  >
                    <span className="font-mono text-indigo-600 font-bold shrink-0 text-[10px] bg-white border border-indigo-100 h-5 w-5 flex items-center justify-center rounded-full shadow-xs">
                      {i + 1}
                    </span>
                    <span className="text-slate-600 font-mono text-[10.5px] leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
