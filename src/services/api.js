// API Client for Campus Find Backend
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/').replace(/\/$/, '')

export function getToken() {
  return localStorage.getItem('campus_find_token') || ''
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('campus_find_token', token)
  } else {
    localStorage.removeItem('campus_find_token')
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('campus_find_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('campus_find_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('campus_find_user')
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const token = getToken()

  const headers = { ...(options.headers || {}) }

  // Inject token if available
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Set application/json only if body is NOT FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, { ...options, headers })
  const json = await response.json().catch(() => null)

  if (!response.ok) {
    // Extract error message from express-validator or responseFormatter
    let errorMsg = 'An error occurred. Please try again.'
    if (json) {
      if (json.error?.errors && Array.isArray(json.error.errors)) {
        errorMsg = json.error.errors.map(e => e.msg || e.message).join(', ')
      } else if (Array.isArray(json.error)) {
        errorMsg = json.error.map(e => e.msg || e.message).join(', ')
      } else if (json.errors && Array.isArray(json.errors)) {
        errorMsg = json.errors.map(e => e.msg || e.message).join(', ')
      } else if (Array.isArray(json)) {
        errorMsg = json.map(e => e.msg || e.message).join(', ')
      } else if (json.error?.message) {
        errorMsg = json.error.message
      } else if (json.error?.reason) {
        errorMsg = json.error.reason
      } else if (typeof json.error === 'string') {
        errorMsg = json.error
      } else if (json.message && json.message !== 'Bad Request' && json.message !== 'Internal Server Error') {
        errorMsg = json.message
      } else if (json.reason) {
        errorMsg = json.reason
      }
    }
    const err = new Error(errorMsg)
    err.status = response.status
    err.payload = json
    throw err
  }

  // responseFormatter shape: { status, statusCode, message, data, pagination, summary }
  return json
}

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return res?.data || res
  },

  signup: async (userData) => {
    const res = await request('/users/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    return res?.data || res
  },

  // Dashboard
  getUserDashboard: async () => {
    const res = await request('/users/dashboard', {
      method: 'GET',
    })
    return res?.data || res
  },

  // Profile
  getProfile: async () => {
    const res = await request('/users/profile', {
      method: 'GET',
    })
    return res?.data || res
  },

  updateProfile: async (formData) => {
    const res = await request('/users/profile', {
      method: 'PATCH',
      body: formData,
    })
    return res?.data || res
  },

  updatePassword: async (passwordData) => {
    const res = await request('/users/password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    })
    return res?.data || res
  },

  // Items
  createItem: async (formData) => {
    const res = await request('/items', {
      method: 'POST',
      body: formData,
    })
    return res?.data || res
  },

  getItems: async (filters = {}) => {
    const res = await request('/getitems', {
      method: 'POST',
      body: JSON.stringify(filters),
    })
    return {
      items: Array.isArray(res?.data) ? res.data : [],
      pagination: res?.pagination || {},
    }
  },

  getMyItems: async (filters = {}) => {
    const res = await request('/getmyitems', {
      method: 'POST',
      body: JSON.stringify(filters),
    })
    return {
      items: Array.isArray(res?.data) ? res.data : [],
      pagination: res?.pagination || {},
      summary: res?.summary || {},
    }
  },

  getItemById: async (id) => {
    const res = await request(`/items/${id}`, {
      method: 'GET',
    })
    return res?.data || res
  },

  // Matches
  getMyMatches: async () => {
    const res = await request('/matches/my', {
      method: 'GET',
    })
    return res?.data || res
  },

  acceptMatch: async (id) => {
    const res = await request(`/matches/${id}/accept`, {
      method: 'PATCH',
    })
    return res?.data || res
  },

  rejectMatch: async (id) => {
    const res = await request(`/matches/${id}/reject`, {
      method: 'PATCH',
    })
    return res?.data || res
  },

  // Claims
  createClaim: async (claimData) => {
    const res = await request('/claims', {
      method: 'POST',
      body: JSON.stringify(claimData),
    })
    return res?.data || res
  },

  getMyClaims: async () => {
    const res = await request('/claims/my', {
      method: 'GET',
    })
    return res?.data || res
  },
}
