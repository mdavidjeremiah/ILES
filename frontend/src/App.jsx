import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

import { API_BASE_URL, createResource as apiCreateResource, fetchWorkspace, patchResource } from './api/client'
import { AppShell } from './components/AppShell'
import { Modal } from './components/Modal'
import { EvaluationForm } from './forms/EvaluationForm'
import { LogForm } from './forms/LogForm'
import { PlacementDetail } from './forms/PlacementDetail'
import { PlacementForm } from './forms/PlacementForm'
import { StudentForm } from './forms/StudentForm'
import { CompaniesPage } from './pages/CompaniesPage'
import { DashboardPage } from './pages/DashboardPage'
import { EvaluationsPage } from './pages/EvaluationsPage'
import { LogbookPage } from './pages/LogbookPage'
import { LoginPage } from './pages/LoginPage'
import { PlacementsPage } from './pages/PlacementsPage'
import { ReportsPage } from './pages/ReportsPage'
import './App.css'

const USER_KEY = 'iles_user'

const storedUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    if (!user) return null

    if (user.source !== 'server') {
      localStorage.removeItem(USER_KEY)
      return null
    }

    return user
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

function App() {
  const [user, setUser] = useState(storedUser)
  const [activePage, setActivePage] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [selectedPlacement, setSelectedPlacement] = useState(null)

  const [stats, setStats] = useState(null)
  const [departments, setDepartments] = useState([])
  const [companies, setCompanies] = useState([])
  const [supervisors, setSupervisors] = useState([])
  const [students, setStudents] = useState([])
  const [placements, setPlacements] = useState([])
  const [logs, setLogs] = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [documents, setDocuments] = useState([])
  const [visits, setVisits] = useState([])

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const workspace = await fetchWorkspace()
      setStats(workspace.stats)
      setDepartments(workspace.departments)
      setCompanies(workspace.companies)
      setSupervisors(workspace.supervisors)
      setStudents(workspace.students)
      setPlacements(workspace.placements)
      setLogs(workspace.logs)
      setEvaluations(workspace.evaluations)
      setDocuments(workspace.documents)
      setVisits(workspace.visits)
    } catch {
      setError(`API unavailable at ${API_BASE_URL}. Start Django and seed Neon Postgres.`)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadData])

  const login = (nextUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }

  const logout = () => {
    localStorage.removeItem(USER_KEY)
    setUser(null)
    setActivePage('dashboard')
  }

  const createResource = async (resource, payload) => {
    setSaving(true)
    setError('')
    try {
      await apiCreateResource(resource, payload)
      setModal(null)
      await loadData()
    } catch (requestError) {
      const details = requestError.response?.data ? JSON.stringify(requestError.response.data) : requestError.message
      setError(`Could not save record: ${details}`)
    } finally {
      setSaving(false)
    }
  }

  const updateResource = async (resource, id, payload) => {
    setSaving(true)
    setError('')
    try {
      await patchResource(resource, id, payload)
      await loadData()
    } catch (requestError) {
      setError(`Could not update record: ${requestError.message}`)
    } finally {
      setSaving(false)
    }
  }

  const updateLogStatus = (log, status) => updateResource('logs', log.id, { status })
  const approveEvaluation = (evaluation) => updateResource('evaluations', evaluation.id, { status: 'approved' })

  if (!user) {
    return <LoginPage onLogin={login} />
  }

  let page
  if (activePage === 'placements') {
    page = (
      <PlacementsPage
        placements={placements}
        students={students}
        companies={companies}
        supervisors={supervisors}
        search={search}
        onOpenModal={setModal}
        onSelectPlacement={setSelectedPlacement}
      />
    )
  } else if (activePage === 'logbook') {
    page = (
      <LogbookPage
        logs={logs}
        placements={placements}
        search={search}
        onOpenModal={setModal}
        onUpdateLogStatus={updateLogStatus}
      />
    )
  } else if (activePage === 'evaluations') {
    page = (
      <EvaluationsPage
        evaluations={evaluations}
        search={search}
        onOpenModal={setModal}
        onApproveEvaluation={approveEvaluation}
      />
    )
  } else if (activePage === 'companies') {
    page = <CompaniesPage companies={companies} supervisors={supervisors} search={search} />
  } else if (activePage === 'reports') {
    page = (
      <ReportsPage
        stats={stats}
        placements={placements}
        logs={logs}
        evaluations={evaluations}
        documents={documents}
        visits={visits}
      />
    )
  } else {
    page = (
      <DashboardPage
        stats={stats}
        placements={placements}
        logs={logs}
        evaluations={evaluations}
        setActivePage={setActivePage}
        onSelectPlacement={setSelectedPlacement}
      />
    )
  }

  return (
    <>
      <AppShell
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={logout}
        search={search}
        setSearch={setSearch}
        loading={loading}
        refreshData={loadData}
        placements={placements}
        logs={logs}
      >
        {error && (
          <div className="error-banner">
            <AlertTriangle size={18} /> {error}
          </div>
        )}
        {page}
      </AppShell>

      {modal === 'student' && (
        <Modal title="Create Student" onClose={() => setModal(null)}>
          <StudentForm departments={departments} saving={saving} onClose={() => setModal(null)} onSubmit={(payload) => createResource('students', payload)} />
        </Modal>
      )}
      {modal === 'placement' && (
        <Modal title="Create Placement" onClose={() => setModal(null)}>
          <PlacementForm
            students={students}
            companies={companies}
            supervisors={supervisors}
            saving={saving}
            onClose={() => setModal(null)}
            onSubmit={(payload) => createResource('placements', payload)}
          />
        </Modal>
      )}
      {modal === 'log' && (
        <Modal title="Create Weekly Log" onClose={() => setModal(null)}>
          <LogForm placements={placements} saving={saving} onClose={() => setModal(null)} onSubmit={(payload) => createResource('logs', payload)} />
        </Modal>
      )}
      {modal === 'evaluation' && (
        <Modal title="Create Evaluation" onClose={() => setModal(null)}>
          <EvaluationForm placements={placements} saving={saving} onClose={() => setModal(null)} onSubmit={(payload) => createResource('evaluations', payload)} />
        </Modal>
      )}
      {selectedPlacement && (
        <PlacementDetail
          placement={selectedPlacement}
          logs={logs}
          evaluations={evaluations}
          documents={documents}
          visits={visits}
          onClose={() => setSelectedPlacement(null)}
        />
      )}
    </>
  )
}

export default App
