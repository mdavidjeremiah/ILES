import { Plus } from 'lucide-react'

import { Badge } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { labelize } from '../utils/format'

export function EvaluationsPage({ evaluations, search, onOpenModal, onApproveEvaluation }) {
  const filtered = evaluations.filter((evaluation) =>
    [evaluation.student_name, evaluation.company_name, evaluation.evaluator_name, evaluation.period, evaluation.status]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  return (
    <>
      <PageHeader
        eyebrow="Evaluations"
        title="Supervisor Assessments"
        subtitle="Capture academic and industry scoring for each internship period."
        action={
          <button className="primary-button" type="button" onClick={() => onOpenModal('evaluation')}>
            <Plus size={18} />
            Evaluation
          </button>
        }
      />

      <section className="evaluation-grid">
        {filtered.map((evaluation) => (
          <article className="evaluation-card" key={evaluation.id}>
            <div className="card-topline">
              <Badge tone={evaluation.evaluator_role === 'industry' ? 'blue' : 'purple'}>{labelize(evaluation.evaluator_role)}</Badge>
              <Badge tone={evaluation.status === 'approved' ? 'green' : evaluation.status === 'submitted' ? 'amber' : 'neutral'}>
                {labelize(evaluation.status)}
              </Badge>
            </div>
            <h2>{evaluation.student_name}</h2>
            <p>
              {evaluation.period} assessment by {evaluation.evaluator_name}
            </p>
            <div className="score-line">
              <strong>{evaluation.score}</strong>
              <span>overall score</span>
            </div>
            <div className="criteria-list">
              <span>
                Professionalism <strong>{evaluation.professionalism}</strong>
              </span>
              <span>
                Technical Skill <strong>{evaluation.technical_skill}</strong>
              </span>
              <span>
                Communication <strong>{evaluation.communication}</strong>
              </span>
              <span>
                Problem Solving <strong>{evaluation.problem_solving}</strong>
              </span>
              <span>
                Attendance <strong>{evaluation.attendance}</strong>
              </span>
            </div>
            <button className="secondary-button full" type="button" onClick={() => onApproveEvaluation(evaluation)}>
              Approve
            </button>
          </article>
        ))}
        {!filtered.length && <EmptyState title="No evaluations found" message="Create a supervisor evaluation for an active placement." />}
      </section>
    </>
  )
}
