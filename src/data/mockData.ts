import type { CompetitionEvent, CompetitionAward, CompetitionAwardRecipient, Certificate, Template, AuditLog } from '../types';

export const mockEvents: CompetitionEvent[] = [
  {
    id: '1',
    title: 'Annual Web Development Competition',
    level: 'Inter-College',
    category: 'Technical',
    discipline: 'Web Development',
    organizer: 'Computer Science Dept',
    date: '2024-03-15',
    venue: 'CS Lab Complex',
    coordinator_name: 'Dr. Priya Sharma',
    notes: 'Open source web applications judged on innovation and code quality',
    status: 'published',
    created_by: '1',
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'State Level Coding Marathon',
    level: 'State',
    category: 'Technical',
    discipline: 'Competitive Programming',
    organizer: 'Tech Club',
    date: '2024-02-28',
    venue: 'Main Auditorium',
    coordinator_name: 'Prof. Raj Kumar',
    status: 'archived',
    created_by: '1',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    title: 'Intra-College Sports Fest - Football',
    level: 'Intra-College',
    category: 'Sports',
    discipline: 'Football',
    organizer: 'Sports Committee',
    date: '2024-04-10',
    venue: 'College Grounds',
    coordinator_name: 'Mr. David Lee',
    notes: 'Annual football tournament for all departments.',
    status: 'published',
    created_by: '1',
    created_at: '2024-03-20T00:00:00Z'
  },
  {
    id: '4',
    title: 'National Robotics Challenge',
    level: 'National',
    category: 'Technical',
    discipline: 'Robotics',
    organizer: 'IEEE Student Branch',
    date: '2024-05-05',
    venue: 'Electronics Dept Lab',
    coordinator_name: 'Dr. Meena Iyer',
    notes: 'Build and present an autonomous robot for a specified task.',
    status: 'draft',
    created_by: '1',
    created_at: '2024-04-15T00:00:00Z'
  }
];

export const mockAwards: CompetitionAward[] = [
  {
    id: '1',
    event_id: '1',
    award_type: 'First',
    position: 1,
    team_or_solo: 'solo',
    performance_details: 'Built innovative e-commerce platform with 95% performance score',
    status: 'approved',
    created_at: '2024-03-16T00:00:00Z',
    template_id: '1'
  },
  {
    id: '2',
    event_id: '1',
    award_type: 'Second',
    position: 2,
    team_or_solo: 'team',
    performance_details: 'Created excellent project management tool',
    status: 'approved',
    created_at: '2024-03-16T00:00:00Z',
    template_id: '1'
  },
  {
    id: '3',
    event_id: '1',
    award_type: 'Participation',
    team_or_solo: 'solo',
    performance_details: 'Completed all challenges within time limit',
    status: 'approved',
    created_at: '2024-03-16T00:00:00Z',
    template_id: '2'
  },
  {
    id: '4',
    event_id: '3',
    award_type: 'Winner',
    team_or_solo: 'team',
    performance_details: 'Winning team of the tournament.',
    status: 'approved',
    created_at: '2024-04-11T00:00:00Z',
    template_id: '3'
  },
  {
    id: '5',
    event_id: '3',
    award_type: 'Runner-Up',
    team_or_solo: 'team',
    status: 'ready',
    created_at: '2024-04-11T00:00:00Z',
    template_id: '3'
  }
];

export const mockRecipients: CompetitionAwardRecipient[] = [
  {
    id: '1',
    award_id: '1',
    student_id: '2',
    added_by: '1',
    added_at: '2024-03-16T00:00:00Z'
  },
  {
    id: '2',
    award_id: '2',
    student_id: '3',
    added_by: '1',
    added_at: '2024-03-16T00:00:00Z'
  },
  {
    id: '3',
    award_id: '3',
    student_id: '2',
    added_by: '1',
    added_at: '2024-03-16T00:00:00Z'
  },
  {
    id: '4',
    award_id: '4', // Winner of Football
    student_id: '2', // Arjun Patel
    added_by: '1',
    added_at: '2024-04-11T00:00:00Z'
  },
  {
    id: '5',
    award_id: '4', // Winner of Football
    student_id: '4', // Rahul Kumar (New student you might need to add to your user mocks)
    added_by: '1',
    added_at: '2024-04-11T00:00:00Z'
  }
];

export const mockTemplates: Template[] = [
  {
    id: '1',
    title: 'Competition Achievement - Standard',
    certificate_type: 'Competition',
    scope: 'college',
    file_type: '.pdf',
    fields_json: {
      title: 'COMPETITION ACHIEVEMENT CERTIFICATE',
      body: 'This is to certify that {student_name} (Reg No {register_no}), {program}, {department}, has secured {award_type} (Rank {position}) in {event_name} ({discipline}) held on {event_date} at {venue}, organized by {organizer}.',
      footer: 'Issued on {issue_date}'
    },
    uploaded_by: '1',
    approved: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Participation Certificate - Standard',
    certificate_type: 'Competition',
    scope: 'college',
    file_type: '.pdf',
    fields_json: {
      title: 'CERTIFICATE OF PARTICIPATION',
      body: 'This is to certify that {student_name} (Reg No {register_no}), {program}, {department}, has participated in {event_name} ({discipline}) held on {event_date} at {venue}, organized by {organizer}.',
      footer: 'Issued on {issue_date}'
    },
    uploaded_by: '1',
    approved: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Sports Victory Certificate - Modern',
    certificate_type: 'Competition',
    scope: 'dept',
    file_type: '.png',
    fields_json: {
      title: 'CERTIFICATE OF VICTORY',
      body: 'This is to certify that the team of {department} including {student_name} has won the {event_name} tournament held on {event_date}.',
      footer: 'Verified at {verify_link}'
    },
    uploaded_by: '1',
    approved: false,
    created_at: '2024-02-10T00:00:00Z'
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: '1',
    certificate_id: 'CERT-2024-001',
    student_id: '2',
    award_id: '1',
    template_id: '1',
    pdf_url: '/certificates/CERT-2024-001.pdf',
    issue_status: 'issued',
    issued_by: '1',
    issued_at: '2024-03-17T00:00:00Z'
  },
  {
    id: '2',
    certificate_id: 'CERT-2024-002',
    student_id: '3',
    award_id: '2',
    template_id: '1',
    pdf_url: '/certificates/CERT-2024-002.pdf',
    issue_status: 'issued',
    issued_by: '1',
    issued_at: '2024-03-17T00:00:00Z'
  },
  {
    id: '3',
    certificate_id: 'CERT-2024-003',
    student_id: '2',
    award_id: '3',
    template_id: '2',
    pdf_url: '/certificates/CERT-2024-003.pdf',
    issue_status: 'generated',
    issued_by: '1',
    issued_at: '2024-03-17T00:00:00Z'
  },
  {
    id: '4',
    certificate_id: 'CERT-2024-004',
    student_id: '3',
    award_id: '2',
    template_id: '1',
    issue_status: 'revoked',
    issued_by: '1',
    issued_at: '2024-03-18T00:00:00Z',
    revoke_reason: 'Duplicate entry found.'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    actor_id: '1',
    action: 'EVENT_CREATE',
    entity_type: 'CompetitionEvent',
    entity_id: '1',
    timestamp: '2024-02-01T00:00:00Z',
    notes: 'Created Annual Web Development Competition'
  },
  {
    id: '2',
    actor_id: '1',
    action: 'CERT_GENERATE',
    entity_type: 'Certificate',
    entity_id: '1',
    timestamp: '2024-03-17T00:00:00Z',
    notes: 'Generated certificate for Arjun Patel'
  },
  {
    id: '3',
    actor_id: '1',
    action: 'CERT_ISSUE',
    entity_type: 'Certificate',
    entity_id: '1',
    timestamp: '2024-03-17T01:00:00Z',
    notes: 'Issued certificate CERT-2024-001'
  },
  {
    id: '4',
    actor_id: '1',
    action: 'EVENT_UPDATE',
    entity_type: 'CompetitionEvent',
    entity_id: '2',
    timestamp: '2024-03-20T00:00:00Z',
    notes: 'Archived State Level Coding Marathon'
  },
  {
    id: '5',
    actor_id: '1',
    action: 'TEMPLATE_APPROVE',
    entity_type: 'Template',
    entity_id: '2',
    timestamp: '2024-02-05T00:00:00Z',
    notes: 'Approved Participation Certificate - Standard'
  }
];