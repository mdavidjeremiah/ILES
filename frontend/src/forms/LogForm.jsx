import { useState } from 'react'

import { todayISO } from '../utils/format'

export function LogForm({ placements, onSubmit, onClose, saving }) {
  const [form, setForm] = useState({
    placement: placements[0]?.id || '',
    week_number: 1,
    date: todayISO(),
    title: '',
    activities: '',
    skills_gained: '',
    challenges: '',
    hours_worked: 40,
    status: 'submitted',
  })
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  return (
    <form
      className="form-grid"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(form)
      }}
    >
      <label className="span-2">
        Placement
        <select value={form.placement} onChange={(event) => update('placement', event.target.value)} required>
          {placements.map((placement) => (
            <option key={placement.id} value={placement.id}>
              {placement.student_name} - {placement.company_name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Week
        <input type="number" min="1" value={form.week_number} onChange={(event) => update('week_number', event.target.value)} required />
      </label>
      <label>
        Date
        <input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} required />
      </label>
      <label className="span-2">
        Title
        <input value={form.title} onChange={(event) => update('title', event.target.value)} required />
      </label>
      <label className="span-2">
        Activities
        <textarea value={form.activities} onChange={(event) => update('activities', event.target.value)} required />
      </label>
      <label className="span-2">
        Skills Gained
        <textarea value={form.skills_gained} onChange={(event) => update('skills_gained', event.target.value)} />
      </label>
      <label className="span-2">
        Challenges
        <textarea value={form.challenges} onChange={(event) => update('challenges', event.target.value)} />
      </label>
      <label>
        Hours
        <input type="number" min="0" step="0.5" value={form.hours_worked} onChange={(event) => update('hours_worked', event.target.value)} />
      </label>
      <label>
        Status
        <select value={form.status} onChange={(event) => update('status', event.target.value)}>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </label>
      <div className="form-actions">
        <button className="secondary-button" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Create Log'}
        </button>
      </div>
    </form>
  )
}
