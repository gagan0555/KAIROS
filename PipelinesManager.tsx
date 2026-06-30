import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Layers, 
  Compass, 
  BookOpen, 
  Award, 
  Calendar, 
  Clock, 
  Activity, 
  CheckCircle,
  HelpCircle,
  FolderOpen
} from "lucide-react";

interface Stage {
  id: number;
  pipeline_id: number;
  stage_name: string;
  position_order: number;
  status: string;
  deadline?: string;
  duration_minutes: number;
  cognitive_load: string;
  importance_percentage?: number;
}

interface Pipeline {
  id: number;
  pipeline_name: string;
  track_type: "Career" | "Academic" | "Independent";
  created_at: string;
  stages: Stage[];
}

interface PipelinesManagerProps {
  onRefreshAll: () => void;
}

export default function PipelinesManager({ onRefreshAll }: PipelinesManagerProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states for creating a new pipeline
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState("");
  const [newTrackType, setNewTrackType] = useState<"Career" | "Academic" | "Independent">("Career");
  const [initialStagesText, setInitialStagesText] = useState(""); // newline separated stages

  // Fetch all pipelines and stages
  const fetchPipelines = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/pipelines");
      if (res.ok) {
        const data = await res.json();
        setPipelines(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch pipelines:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  const handleCreatePipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPipelineName.trim()) return;

    // Parse initial stages list
    const stages = initialStagesText
      .split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(name => ({
        stage_name: name,
        status: "pending",
        duration_minutes: 60,
        cognitive_load: "medium"
      }));

    // If no stages provided, supply a default one
    const finalStages = stages.length > 0 ? stages : [{
      stage_name: "Initialization Block",
      status: "pending",
      duration_minutes: 60,
      cognitive_load: "medium"
    }];

    try {
      const res = await fetch("/api/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pipeline_name: newPipelineName,
          track_type: newTrackType,
          stages: finalStages
        })
      });

      if (res.ok) {
        setNewPipelineName("");
        setInitialStagesText("");
        setShowCreateModal(false);
        fetchPipelines();
        onRefreshAll();
      }
    } catch (err) {
      console.error("Failed to create pipeline:", err);
    }
  };

  const handleDeletePipeline = async (id: number) => {
    if (!confirm("Are you sure you want to completely delete this pipeline and all its stages?")) return;
    try {
      const res = await fetch(`/api/pipelines/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchPipelines();
        onRefreshAll();
      }
    } catch (err) {
      console.error("Failed to delete pipeline:", err);
    }
  };

  const handleAddStage = async (pipelineId: number, stageName: string) => {
    if (!stageName.trim()) return;
    try {
      const res = await fetch(`/api/pipelines/${pipelineId}/stages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage_name: stageName,
          status: "pending",
          duration_minutes: 60,
          cognitive_load: "medium"
        })
      });
      if (res.ok) {
        fetchPipelines();
        onRefreshAll();
      }
    } catch (err) {
      console.error("Failed to add stage:", err);
    }
  };

  const handleReorderStages = async (pipelineId: number, stagesList: Stage[], direction: "up" | "down", currentIndex: number) => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= stagesList.length) return;

    const reordered = [...stagesList];
    const temp = reordered[currentIndex];
    reordered[currentIndex] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const stageIds = reordered.map(s => s.id);

    try {
      const res = await fetch(`/api/pipelines/${pipelineId}/stages/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage_ids: stageIds })
      });
      if (res.ok) {
        fetchPipelines();
        onRefreshAll();
      }
    } catch (err) {
      console.error("Failed to reorder stages:", err);
    }
  };

  const handleUpdateStageStatus = async (stageId: number, status: string) => {
    try {
      const res = await fetch(`/api/tasks/${stageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchPipelines();
        onRefreshAll();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleUpdateStageImportance = async (stageId: number, importance: number) => {
    try {
      const res = await fetch(`/api/tasks/${stageId}/importance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ importance_percentage: importance })
      });
      if (res.ok) {
        fetchPipelines();
        onRefreshAll();
      }
    } catch (err) {
      console.error("Failed to update stage importance:", err);
    }
  };

  const getTrackIcon = (type: string) => {
    switch (type) {
      case "Career":
        return <Compass className="w-4 h-4 text-emerald-500" />;
      case "Academic":
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      default:
        return <Award className="w-4 h-4 text-amber-500" />;
    }
  };

  const getTrackBadgeColor = (type: string) => {
    switch (type) {
      case "Career":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Academic":
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col h-full font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#475569]" />
          <h3 className="text-lg font-display font-semibold text-[#0f172a]">
            Dynamic Tracks Architect
          </h3>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Spin up Track
        </button>
      </div>

      <p className="text-sm text-[#64748b] mb-6">
        Eliminate rigid tracking pipelines. Create Career, Academic, or Independent tracks with dynamically ordered custom stages. Reorder stages to reschedule them automatically.
      </p>

      {/* Grid of Dynamic Pipelines */}
      <div className="space-y-6 flex-1 overflow-y-auto max-h-[520px] pr-1">
        {isLoading && pipelines.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
            <span className="text-xs text-slate-400">Loading dynamic architect pipelines...</span>
          </div>
        ) : pipelines.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <span className="text-xs text-slate-500 font-semibold block">No dynamic pipelines spun up.</span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Click "Spin up Track" or upload documents to ingest new pipelines.
            </span>
          </div>
        ) : (
          pipelines.map((p) => (
            <div key={p.id} className="border border-[#e2e8f0] rounded-xl overflow-hidden hover:shadow-sm transition-all bg-slate-50/20">
              {/* Header block */}
              <div className="bg-[#f8fafc] px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  {getTrackIcon(p.track_type)}
                  <div className="truncate">
                    <span className="font-display font-bold text-sm text-[#0f172a] block truncate">
                      {p.pipeline_name}
                    </span>
                    <span className={`inline-block text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${getTrackBadgeColor(p.track_type)} mt-0.5`}>
                      {p.track_type} Track
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeletePipeline(p.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors shrink-0"
                  title="Delete Track completely"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stages List */}
              <div className="p-3 bg-white space-y-2">
                {p.stages.map((st, sIdx) => (
                  <div 
                    key={st.id} 
                    className="p-2.5 rounded-lg border border-slate-100 bg-white shadow-xs flex items-center justify-between gap-4 text-xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-600 w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0">
                        {sIdx + 1}
                      </span>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-slate-800 block truncate">
                            {st.stage_name}
                          </span>
                          <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                            Weight: {st.importance_percentage || 50}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {st.duration_minutes}m
                          </span>
                          <span>•</span>
                          <span className="uppercase text-[9px] font-semibold text-slate-500">
                            {st.cognitive_load} intensity
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status selectors */}
                      <select
                        value={st.status ? st.status.toLowerCase() : "pending"}
                        onChange={(e) => handleUpdateStageStatus(st.id, e.target.value)}
                        className="text-[10px] p-1 border border-slate-200 rounded bg-white text-slate-700 focus:outline-none font-medium"
                        title="Change Status"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="missed">Missed</option>
                      </select>

                      {/* Importance Overrides selector */}
                      <select
                        value={st.importance_percentage || 50}
                        onChange={(e) => handleUpdateStageImportance(st.id, Number(e.target.value))}
                        className="text-[10px] p-1 border border-slate-200 rounded bg-white text-slate-700 focus:outline-none font-mono font-bold text-amber-700"
                        title="Override Importance Weight"
                      >
                        {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
                          <option key={v} value={v}>
                            {v}% W
                          </option>
                        ))}
                      </select>

                      {/* Stage Ordering arrows */}
                      <div className="flex flex-col">
                        <button
                          disabled={sIdx === 0}
                          onClick={() => handleReorderStages(p.id, p.stages, "up", sIdx)}
                          className="text-slate-400 hover:text-slate-800 disabled:opacity-30 p-0.5"
                          title="Move Stage Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={sIdx === p.stages.length - 1}
                          onClick={() => handleReorderStages(p.id, p.stages, "down", sIdx)}
                          className="text-slate-400 hover:text-slate-800 disabled:opacity-30 p-0.5"
                          title="Move Stage Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Inline Quick Add Stage */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const input = form.elements.namedItem("stageName") as HTMLInputElement;
                    handleAddStage(p.id, input.value);
                    input.value = "";
                  }}
                  className="mt-3 pt-2.5 border-t border-slate-100 flex gap-2"
                >
                  <input
                    type="text"
                    required
                    name="stageName"
                    placeholder="Quick insert new stage (e.g. Mock Test)"
                    className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 bg-slate-50/50"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded transition-all"
                  >
                    Add Stage
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Creation Modal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 duration-150">
            <h4 className="font-display font-bold text-sm text-[#0f172a] mb-2">
              Spin up Custom Scaling Track
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Deploy a new polymorphic track configured with any custom steps immediately.
            </p>

            <form onSubmit={handleCreatePipeline} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">
                  Track / Pipeline Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAT Preparation, AWS Solutions Architect"
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">
                  Track Category / Type
                </label>
                <select
                  value={newTrackType}
                  onChange={(e: any) => setNewTrackType(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none text-slate-700 bg-white"
                >
                  <option value="Career">Career Track (Placements, Internships)</option>
                  <option value="Academic">Academic Track (Courses, Exams, Certs)</option>
                  <option value="Independent">Independent Track (Personal Goals, Hobbies)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">
                  Initial Ordered Stages (one per line)
                </label>
                <textarea
                  placeholder="e.g.&#10;Diagnostic Exam&#10;Review Math Section&#10;Practice Test 1&#10;Final Assessment"
                  rows={4}
                  value={initialStagesText}
                  onChange={(e) => setInitialStagesText(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 font-sans"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Spin up Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
