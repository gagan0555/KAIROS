import React, { useState } from "react";
import { ClipboardList, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import { Task } from "../types";
import RemedialSyllabusDropdown from "./RemedialSyllabusDropdown";

interface RetrospectiveProps {
  tasks: Task[];
  onRetrospectiveSuccess: () => void;
}

export default function Retrospective({ tasks, onRetrospectiveSuccess }: RetrospectiveProps) {
  // Filter for completed or missed placement/exam tasks
  const passedTasks = tasks.filter(
    (t) =>
      (t.status === "completed" || t.status === "missed") &&
      (t.recruitment_stage && t.recruitment_stage !== "None")
  );

  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [successPlan, setSuccessPlan] = useState<{ title: string; plan: string; micro_syllabus?: any } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmitPostMortem = async (taskId: number) => {
    if (!reflectionText.trim()) return;

    setIsAnalyzing(true);
    setErrorMsg(null);
    setSuccessPlan(null);

    try {
      const res = await fetch(`/api/tasks/${taskId}/retrospective`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reflection: reflectionText }),
      });

      if (!res.ok) {
        throw new Error("Failed to process post-event analysis. Please check console.");
      }

      const data = await res.json();
      if (data.success && data.plan) {
        setSuccessPlan(data.plan);
        setReflectionText("");
        onRetrospectiveSuccess(); // Refresh parents schedules and log trace
      } else {
        throw new Error("Invalid response schema from generative retrospective server.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-[#475569]" />
        <h3 className="text-lg font-display font-semibold text-[#0f172a]">
          Post-Event Retrospective Loop
        </h3>
      </div>
      <p className="text-sm text-[#64748b] mb-4">
        When recruitment stages or exams pass, review what caught you off guard. Gemini analyzes obstacles and inserts 3-day targeted upskilling roadmaps.
      </p>

      <div className="flex-1 overflow-y-auto max-h-[300px] space-y-4 pr-1">
        {passedTasks.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[#e2e8f0] rounded-lg">
            <span className="text-xs text-[#64748b] font-medium">No passed milestones eligible for review.</span>
          </div>
        ) : (
          passedTasks.map((t) => (
            <div key={t.id} className="border border-[#e2e8f0] rounded-lg p-4 bg-[#f8fafc]">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-[#1e293b] text-white px-1.5 py-0.5 rounded font-semibold">
                      {t.recruitment_stage}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${
                        t.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0f172a] mt-1.5">
                    {t.title} <span className="font-normal text-[#64748b]">@ {t.company_name}</span>
                  </h4>
                </div>

                {t.post_mortem_submitted === 0 && activeTaskId !== t.id && (
                  <button
                    onClick={() => {
                      setActiveTaskId(t.id);
                      setSuccessPlan(null);
                      setErrorMsg(null);
                    }}
                    className="px-3 py-1.5 bg-[#0f172a] text-white text-xs font-semibold rounded-lg hover:bg-[#1e293b] transition-colors"
                  >
                    Perform Review
                  </button>
                )}
              </div>

              {/* Reflection text area active form */}
              {activeTaskId === t.id && (
                <div className="mt-4 border-t border-[#e2e8f0] pt-4 space-y-3">
                  <label className="block text-xs font-mono uppercase text-[#475569]">
                    What concepts caught you off guard or went wrong?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 'I choked on graph algorithms. The problem was a Dijkstra shortest path but with vertex weights instead of edges...'"
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#475569] text-[#334155] bg-white"
                  />

                  {errorMsg && (
                    <div className="text-red-700 text-[11px] bg-red-50 p-2 rounded">{errorMsg}</div>
                  )}

                  {successPlan && (
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-xs space-y-2">
                      <div className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Targeted Upskilling Injected: {successPlan.title}
                      </div>
                      <div className="text-emerald-700 font-mono whitespace-pre-line text-[11px]">
                        {successPlan.plan}
                      </div>
                      <RemedialSyllabusDropdown syllabusJson={successPlan.micro_syllabus} />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setActiveTaskId(null);
                        setSuccessPlan(null);
                      }}
                      className="px-2.5 py-1.5 border border-[#cbd5e1] text-xs rounded-lg text-[#64748b] hover:bg-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmitPostMortem(t.id)}
                      disabled={isAnalyzing}
                      className="px-3 py-1.5 bg-[#475569] hover:bg-[#334155] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing Reflection...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> Submit to Kairos AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Already Completed Review Display */}
              {t.post_mortem_submitted === 1 && (
                <div className="mt-3 pt-3 border-t border-[#e2e8f0]/60 text-xs">
                  <div className="text-[#64748b] italic">
                    &ldquo;{t.post_mortem_response}&rdquo;
                  </div>
                  <div className="mt-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-[#312e81]">
                    <div className="font-semibold flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600" /> Auto-Generated 3-Day Roadmap
                    </div>
                    <div className="mt-1.5 font-mono text-[10px] whitespace-pre-line text-[#3730a3]">
                      {t.up_skilling_objective}
                    </div>
                    <RemedialSyllabusDropdown syllabusJson={t.up_skilling_syllabus} />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
