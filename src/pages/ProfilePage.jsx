import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserRound, Pencil, Lock, CheckCircle, XCircle, Camera, Save, X, Loader2 } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

/* ── Toast ───────────────────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold transition-all animate-fade-in-right ${
      type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
    }`}>
      {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
      {message}
    </div>
  )
}

/* ── Password strength bar ───────────────────────────────────────────── */
const PW_RULES = [
  { rule: pw => pw.length >= 8,         text: 'At least 8 characters'    },
  { rule: pw => /[A-Z]/.test(pw),       text: 'One uppercase letter'     },
  { rule: pw => /[0-9]/.test(pw),       text: 'One number'               },
  { rule: pw => /[^A-Za-z0-9]/.test(pw), text: 'One special character'  },
]

/* ── Input ───────────────────────────────────────────────────────────── */
function FormInput({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
      />
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const { user: authUser, updateCurrentUser } = useAuth()

  const [loading, setLoading]       = useState(true)
  const [profile, setProfile]       = useState(null)
  const [stats, setStats]           = useState({ lostItems: 0, foundItems: 0, claims: 0 })

  /* Profile form */
  const [profileForm, setProfileForm]   = useState({ firstname: '', lastname: '', phone: '' })
  const [imageFile, setImageFile]       = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [editMode, setEditMode]         = useState(false)
  const [saving, setSaving]             = useState(false)

  /* Password form */
  const [pwForm, setPwForm]         = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPwForm, setShowPwForm] = useState(false)
  const [changingPw, setChangingPw] = useState(false)

  /* Toast */
  const [toast, setToast] = useState(null)
  const showToast = (message, type = 'success') => setToast({ message, type })

  // Fetch real profile from MongoDB via backend
  const fetchProfile = async () => {
    try {
      const data = await api.getProfile()
      const p = data?.profile || authUser || {}
      setProfile(p)
      setStats(data?.stats || { lostItems: 0, foundItems: 0, claims: 0 })
      setProfileForm({
        firstname: p.firstname || '',
        lastname:  p.lastname  || '',
        phone:     p.phone     || '',
      })
    } catch (err) {
      showToast(err.message || 'Could not load profile data.', 'error')
      if (authUser) {
        setProfile(authUser)
        setProfileForm({
          firstname: authUser.firstname || '',
          lastname:  authUser.lastname  || '',
          phone:     authUser.phone     || '',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleImageChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreviewImage(URL.createObjectURL(file))
  }

  const handleProfileSubmit = async e => {
    e.preventDefault()
    if (!profileForm.firstname.trim()) return showToast('First name is required.', 'error')

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('firstname', profileForm.firstname.trim())
      fd.append('lastname', profileForm.lastname.trim())
      if (profileForm.phone?.trim()) {
        fd.append('phone', profileForm.phone.trim())
      }
      if (imageFile) {
        fd.append('image', imageFile)
      }

      const res = await api.updateProfile(fd)
      const updated = res?.data || res
      if (updated) {
        setProfile(prev => ({ ...prev, ...updated }))
        updateCurrentUser(updated)
      }
      setSaving(false)
      setEditMode(false)
      showToast('Profile updated successfully!')
    } catch (err) {
      setSaving(false)
      showToast(err.message || 'Failed to update profile.', 'error')
    }
  }

  const handlePasswordSubmit = async e => {
    e.preventDefault()
    if (!pwForm.currentPassword) return showToast('Current password is required.', 'error')
    if (pwForm.newPassword !== pwForm.confirmPassword) return showToast('Passwords do not match.', 'error')
    if (pwForm.newPassword.length < 8) return showToast('Password must be at least 8 characters.', 'error')

    setChangingPw(true)
    try {
      await api.updatePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmPassword: pwForm.confirmPassword,
      })
      setChangingPw(false)
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPwForm(false)
      showToast('Password changed successfully!')
    } catch (err) {
      setChangingPw(false)
      showToast(err.message || 'Failed to update password.', 'error')
    }
  }

  const user = profile || authUser || {}
  const rawImage = previewImage || user.profileImage || null
  const avatarSrc = rawImage?.startsWith('blob:') || rawImage?.startsWith('http')
    ? rawImage
    : rawImage
      ? `http://localhost:3001/${rawImage}`
      : null

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* ── Page Header ── */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-full mb-4">
            <UserRound size={14} className="text-violet-600" />
            <span className="text-xs font-semibold text-violet-700 uppercase tracking-wide">Account</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your personal information and settings</p>
        </div>

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">

          {/* Avatar + basic info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative shrink-0">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-lg object-cover" />
              ) : (
                <div className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-4xl font-extrabold">
                  {user.firstname?.[0]?.toUpperCase()}
                </div>
              )}
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-all shadow-md" title="Change photo">
                  <Camera size={14} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-extrabold text-slate-900">{user.firstname} {user.lastname}</h2>
              <p className="text-slate-500 text-sm">{user.email}</p>
              <p className="text-xs text-slate-400 capitalize mt-0.5">
                🎓 {user.role || 'Student'} · Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Recently'}
              </p>
              <button
                onClick={() => setEditMode(v => !v)}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                {editMode ? <><X size={13} /> Cancel</> : <><Pencil size={13} /> Edit Profile</>}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center py-5 border-y border-slate-100 mb-6">
            {[
              { label: 'Lost Items',  value: stats.lostItems ?? 0,  bg: 'bg-rose-50',    color: 'text-rose-600'    },
              { label: 'Found Items', value: stats.foundItems ?? 0, bg: 'bg-emerald-50', color: 'text-emerald-600' },
              { label: 'Claims',      value: stats.claims ?? 0,     bg: 'bg-amber-50',   color: 'text-amber-600'   },
            ].map(({ label, value, bg, color }) => (
              <div key={label} className={`${bg} p-4 rounded-xl`}>
                <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Additional info */}
          <div className="space-y-2 text-sm text-slate-600">
            <p><strong>Phone:</strong> {user.phone || <span className="text-slate-400">Not provided</span>}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>

        {/* ── Edit Profile Form ── */}
        {editMode && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Pencil size={18} className="text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-800">Edit Profile</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                  label="First Name"
                  type="text"
                  value={profileForm.firstname}
                  placeholder="First name"
                  onChange={e => setProfileForm(f => ({ ...f, firstname: e.target.value }))}
                />
                <FormInput
                  label="Last Name"
                  type="text"
                  value={profileForm.lastname}
                  placeholder="Last name"
                  onChange={e => setProfileForm(f => ({ ...f, lastname: e.target.value }))}
                />
              </div>
              <FormInput
                label="Phone Number"
                type="tel"
                value={profileForm.phone}
                placeholder="+91 98765 43210"
                onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <><Save size={15} /> Save Changes</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Change Password ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-800">Change Password</h2>
            </div>
            <button
              onClick={() => setShowPwForm(v => !v)}
              className="text-sm text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
            >
              {showPwForm ? 'Hide' : 'Show form'}
            </button>
          </div>
          <p className="text-slate-400 text-xs mb-5">Keep your account secure with a strong password.</p>

          {showPwForm && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FormInput
                label="Current Password"
                type="password"
                value={pwForm.currentPassword}
                placeholder="Enter current password"
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
              />
              <FormInput
                label="New Password"
                type="password"
                value={pwForm.newPassword}
                placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
              />

              {/* Strength indicator */}
              {pwForm.newPassword && (
                <ul className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl">
                  {PW_RULES.map(({ rule, text }) => {
                    const passed = rule(pwForm.newPassword)
                    return (
                      <li key={text} className={`flex items-center gap-1.5 ${passed ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {passed ? <CheckCircle size={12} /> : <span className="w-3 h-3 rounded-full border border-slate-300 inline-block" />}
                        {text}
                      </li>
                    )
                  })}
                </ul>
              )}

              <FormInput
                label="Confirm New Password"
                type="password"
                value={pwForm.confirmPassword}
                placeholder="Re-enter new password"
                onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
              />

              <button
                type="submit"
                disabled={changingPw}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {changingPw ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>

        {/* ── Navigation ── */}
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all">
            ← Back to Dashboard
          </Link>
          <Link to="/lost-items" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all">
            My Lost Items
          </Link>
          <Link to="/found-items" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all">
            My Found Items
          </Link>
        </div>

      </div>
    </PageLayout>
  )
}
