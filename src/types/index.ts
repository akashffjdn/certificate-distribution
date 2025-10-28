export interface User {
  id: string;
  role: 'student' | 'staff' | 'admin';
  id_card_no: string;
  reg_no?: string;
  name: string;
  dept: string;
  program?: string;
  year?: number;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface CompetitionEvent {
  id: string;
  title: string;
  level: 'Intra-College' | 'Inter-College' | 'State' | 'National' | 'International';
  category: 'Sports' | 'Cultural' | 'Technical' | 'Other';
  discipline: string;
  organizer: string;
  date: string;
  venue?: string;
  coordinator_name?: string;
  notes?: string;
  status: 'draft' | 'published' | 'archived';
  created_by: string;
  created_at: string;
}

export interface CompetitionAward {
  id: string;
  event_id: string;
  award_type: 'Winner' | 'Runner-Up' | 'First' | 'Second' | 'Third' | 'Participation' | 'Special Mention';
  position?: number;
  team_or_solo: 'team' | 'solo';
  performance_details?: string;
  status: 'draft' | 'ready' | 'approved';
  created_at: string;
  template_id?: string;
}

export interface CompetitionAwardRecipient {
  id: string;
  award_id: string;
  student_id: string;
  added_by: string;
  added_at: string;
  student?: User;
}

export interface Template {
  id: string;
  title: string;
  certificate_type: 'Competition';
  scope: 'dept' | 'college';
  file_type: '.docx' | '.pdf' | '.png';
  fields_json: {
    title: string;
    body: string;
    footer: string;
    signatures?: Array<{
      id: string;
      role: 'principal' | 'hod' | 'coordinator';
      type: 'upload' | 'draw';
      data: string;
      name: string;
    }>;
    settings?: {
      visibility: 'department' | 'college';
      field_validation: boolean;
      allow_edits_after_approval: boolean;
      enable_signatures: boolean;
    };
  };
  uploaded_by: string;
  approved: boolean;
  created_at: string;
}

export interface Certificate {
  id: string;
  certificate_id: string;
  student_id: string;
  award_id: string;
  template_id: string;
  pdf_url?: string;
  issue_status: 'draft' | 'generated' | 'issued' | 'revoked';
  issued_by?: string;
  issued_at?: string;
  revoke_reason?: string;
  student?: User;
  award?: CompetitionAward;
  event?: CompetitionEvent;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  timestamp: string;
  notes?: string;
  actor?: User;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
  read: boolean;
}