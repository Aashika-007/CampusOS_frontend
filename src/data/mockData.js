export const requests = [
  { id: 'EVT-2026-014', event: 'National Hackathon', organizer: 'TechSphere', date: '2026-10-24', venue: 'Vijayawada', purpose: 'Represent the college in a 24-hour software hackathon.', status: 'pendingFinalDecision', proctor: 'Dr. Meera Rao', remarks: 'Attendance verified; recommendation submitted.' },
  { id: 'EVT-2026-009', event: 'Cloud Computing Workshop', organizer: 'AWS User Group', date: '2026-10-02', venue: 'Online', purpose: 'Hands-on cloud deployment workshop.', status: 'approved', proctor: 'Prof. Arjun', remarks: 'Approved by event administrator.' },
  { id: 'EVT-2026-006', event: 'UI/UX Design Sprint', organizer: 'Design Club', date: '2026-09-18', venue: 'Campus Innovation Lab', purpose: 'Participate in a student design sprint.', status: 'returnedForCorrection', proctor: 'Dr. Meera Rao', remarks: 'Please attach organizer confirmation.' },
  { id: 'EVT-2026-003', event: 'Open Source Meetup', organizer: 'FOSS Community', date: '2026-09-05', venue: 'Online', purpose: 'Learn contribution workflows.', status: 'rejected', proctor: 'Prof. Arjun', remarks: 'Event date had passed before submission.' },
]

export const students = [
  { id: 'STU-1024', name: 'Aarav Sharma', email: 'aarav.sharma@example.edu', attended: 42, conducted: 48, freshness: 'Current', program: 'CSE · Year 3' },
  { id: 'STU-1038', name: 'Diya Reddy', email: 'diya.reddy@example.edu', attended: 31, conducted: 40, freshness: 'Current', program: 'IT · Year 2' },
  { id: 'STU-1091', name: 'Kabir Patel', email: 'kabir.patel@example.edu', attended: 18, conducted: 36, freshness: 'Outdated', program: 'CSE · Year 3' },
  { id: 'STU-1102', name: 'Mira Nair', email: 'mira.nair@example.edu', attended: 0, conducted: 0, freshness: 'Missing', program: 'ECE · Year 1' },
]

export const statusLabels = {
  submitted: 'Submitted',
  underProctorReview: 'Under proctor review',
  recommended: 'Recommended',
  pendingFinalDecision: 'Pending final decision',
  approved: 'Approved',
  rejected: 'Rejected',
  returnedForCorrection: 'Needs correction',
}

export function attendancePercent(student) {
  if (!student || student.conducted <= 0) return null
  return Math.round((student.attended / student.conducted) * 100)
}