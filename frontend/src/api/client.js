import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function fetchWorkspace() {
  const [stats, departments, companies, supervisors, students, placements, logs, evaluations, documents, visits] =
    await Promise.all([
      api.get('/stats/'),
      api.get('/departments/'),
      api.get('/companies/'),
      api.get('/supervisors/'),
      api.get('/students/'),
      api.get('/placements/'),
      api.get('/logs/'),
      api.get('/evaluations/'),
      api.get('/documents/'),
      api.get('/visits/'),
    ])

  return {
    stats: stats.data,
    departments: departments.data,
    companies: companies.data,
    supervisors: supervisors.data,
    students: students.data,
    placements: placements.data,
    logs: logs.data,
    evaluations: evaluations.data,
    documents: documents.data,
    visits: visits.data,
  }
}

export async function createResource(resource, payload) {
  return api.post(`/${resource}/`, payload)
}

export async function patchResource(resource, id, payload) {
  return api.patch(`/${resource}/${id}/`, payload)
}

export async function signupAccount(payload) {
  const response = await api.post('/auth/signup/', payload)
  return response.data
}

export async function loginAccount(payload) {
  const response = await api.post('/auth/login/', payload)
  return response.data
}
