import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
} from 'lucide-react'

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'placements', label: 'Placements', icon: GraduationCap },
  { id: 'logbook', label: 'Logbook', icon: BookOpen },
  { id: 'evaluations', label: 'Evaluations', icon: ClipboardCheck },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
]

export const STATUS_LABELS = {
  active: 'Active',
  approved: 'Approved',
  completed: 'Completed',
  draft: 'Draft',
  flagged: 'Flagged',
  industry: 'Industry',
  academic: 'Academic',
  missed: 'Missed',
  pending: 'Pending',
  placed: 'Placed',
  rejected: 'Needs Revision',
  reviewed: 'Reviewed',
  scheduled: 'Scheduled',
  submitted: 'Submitted',
  technical_skill: 'Technical Skill',
  problem_solving: 'Problem Solving',
}
