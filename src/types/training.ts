
export interface TrainingMaterial {
  id: string;
  session_id: string;
  title: string;
  description: string | null;
  content_type: string;
  content_url: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingProgress {
  id: string;
  enrollment_id: string;
  material_id: string;
  completion_status: 'not_started' | 'in_progress' | 'completed';
  completed_at: string | null;
  last_accessed_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  max_participants: number | null;
  status: string;
  materials_url: string[] | null;
  trainer_id: string;
  training_materials?: TrainingMaterial[];
  _count: {
    enrollments: number;
  };
  created_at: string;
  updated_at: string;
}
