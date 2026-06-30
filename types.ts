export interface HardConstraint {
  id: number;
  type: 'timetable' | 'exam' | 'medical';
  title: string;
  start_time: string;
  end_time: string;
  days_of_week?: string;
  date?: string;
  importance_percentage?: number;
}

export interface Task {
  id: number;
  title: string;
  company_name?: string;
  recruitment_stage: 'Registration' | 'OA' | 'Interview' | 'None';
  portal_link?: string;
  deadline?: string;
  duration_minutes: number;
  cognitive_load: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'missed';
  scheduled_start?: string;
  scheduled_end?: string;
  buffer_minutes: number;
  post_mortem_submitted: number;
  post_mortem_response?: string;
  up_skilling_objective?: string;
  up_skilling_syllabus?: string;
  created_at: string;
  importance_percentage?: number;
  scratchpad?: string;
}

export interface Habit {
  id: number;
  title: string;
  type: 'micro-habit' | 'flexible-habit';
  active: number;
  duration_minutes: number;
  scheduled_start?: string;
  scheduled_end?: string;
  importance_percentage?: number;
}

export interface AgentLog {
  id: number;
  timestamp: string;
  message: string;
  category: 'ingestion' | 'scheduling' | 'governor' | 'retrospective' | 'urgency_sentinel' | 'burnout_governor' | 'chrono_gatekeeper' | 'habit_architect' | 'skill_synthesizer' | 'admin_quartermaster' | 'focus_guardian';
}
