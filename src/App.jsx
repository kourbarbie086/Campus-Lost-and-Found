import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// ── Existing pages ────────────────────────────────────────────────────────
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'

// ── App pages ─────────────────────────────────────────────────────────────
import SignupPage      from './pages/SignupPage'
import BrowseItemsPage from './pages/BrowseItemsPage'
import LostItemsPage   from './pages/LostItemsPage'
import FoundItemsPage  from './pages/FoundItemsPage'
import ReportItemPage  from './pages/ReportItemPage'
import ItemDetailPage  from './pages/ItemDetailPage'
import DashboardPage   from './pages/DashboardPage'
import ProfilePage     from './pages/ProfilePage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public ── */}
          <Route path="/"            element={<LandingPage />} />
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/signup"      element={<SignupPage />} />

          {/* ── Items ── */}
          <Route path="/items"       element={<BrowseItemsPage />} />
          <Route path="/items/:id"   element={<ItemDetailPage />} />
          <Route path="/lost-items"  element={<LostItemsPage />} />
          <Route path="/found-items" element={<FoundItemsPage />} />
          <Route path="/report"      element={<ProtectedRoute><ReportItemPage /></ProtectedRoute>} />

          {/* ── User ── */}
          <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
