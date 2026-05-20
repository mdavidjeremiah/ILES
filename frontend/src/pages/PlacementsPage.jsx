import { BriefcaseBusiness, Building2, CalendarDays, Plus, ShieldCheck, Users } from 'lucide-react'

import { Badge } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { formatDate, initials, labelize } from '../utils/format'

export function PlacementsPage({ placements, students, companies, supervisors, search, onOpenModal, onSelectPlacement }) {
  const filtered = placements.filter((placement) =>
    [placement.student_name, placement.company_name, placement.title, placement.status]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  return (
    <>
      <PageHeader
        eyebrow="Placements"
        title="Student Attachments"
        subtitle="Manage internship allocation, host organization, supervisors, and progress."
        action={
          <div className="button-group">
            <button className="secondary-button" type="button" onClick={() => onOpenModal('student')}>
              <Users size={18} />
              Student
            </button>
            <button className="primary-button" type="button" onClick={() => onOpenModal('placement')}>
              <Plus size={18} />
              Placement
            </button>
          </div>
        }
      />

      <section className="stat-grid compact">
        <StatCard icon={Users} label="Students" value={students.length} detail="registered" />
        <StatCard icon={Building2} label="Companies" value={companies.length} detail="host partners" tone="green" />
        <StatCard icon={ShieldCheck} label="Supervisors" value={supervisors.length} detail="academic and industry" tone="purple" />
      </section>

      <section className="card-grid">
        {filtered.map((placement) => (
          <article className="placement-card" key={placement.id}>
            <div className="card-topline">
              <div className="person-avatar">{initials(placement.student_name)}</div>
              <Badge tone={placement.status === 'flagged' ? 'red' : placement.status === 'completed' ? 'blue' : 'green'}>
                {labelize(placement.status)}
              </Badge>
            </div>
            <h2>{placement.student_name}</h2>
            <p>{placement.title}</p>
            <div className="meta-grid">
              <span>
                <Building2 size={16} />
                {placement.company_name}
              </span>
              <span>
                <CalendarDays size={16} />
                {formatDate(placement.end_date)}
              </span>
              <span>
                <Users size={16} />
                {placement.academic_supervisor_name || 'Academic supervisor pending'}
              </span>
              <span>
                <BriefcaseBusiness size={16} />
                {placement.industry_supervisor_name || 'Industry supervisor pending'}
              </span>
            </div>
            <div className="progress-block">
              <div>
                <span>Progress</span>
                <strong>{placement.progress}%</strong>
              </div>
              <div className="progress-track">
                <span style={{ width: `${placement.progress}%` }} />
              </div>
            </div>
            <button className="secondary-button full" type="button" onClick={() => onSelectPlacement(placement)}>
              View Details
            </button>
          </article>
        ))}
        {!filtered.length && <EmptyState title="No placements found" message="Adjust search or create a new placement record." />}
      </section>
    </>
  )
}
