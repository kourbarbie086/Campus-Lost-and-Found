import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail, Lock, Eye, EyeOff, Search, ArrowRight,
  AlertCircle, CheckCircle
} from 'lucide-react'

/* ===========================
   FORM VALIDATION
   =========================== */
function validate(fields) {
  const errors = {}

  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!fields.password) {
    errors.password = 'Password is required.'
  } else if (fields.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return errors
}

/* ===========================
   FLOATING LABEL INPUT
   =========================== */
function FormField({ id, label, type = 'text', value, onChange, error, icon: Icon, rightElement }) {
  const hasValue = value.length > 0

  return (
    <div className="space-y-1.5">
      <div className={`relative flex items-center border rounded-2xl transition-all duration-200 ${
        error
          ? 'border-rose-400 bg-rose-50/50'
          : hasValue
            ? 'border-indigo-400 bg-white'
            : 'border-slate-200 bg-slate-50 focus-within:border-indigo-400 focus-within:bg-white'
      }`}>
        {/* Leading icon */}
        <div className="pl-4 pr-1 shrink-0">
          <Icon className={`w-4.5 h-4.5 transition-colors ${error ? 'text-rose-400' : hasValue ? 'text-indigo-500' : 'text-slate-400'}`} size={18} />
        </div>

        {/* Input */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={label}
          className="flex-1 px-3 py-3.5 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          autoComplete={id}
        />

        {/* Right element (e.g. show/hide) */}
        {rightElement && (
          <div className="pr-3 shrink-0">{rightElement}</div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1.5 px-1">
          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <p className="text-xs text-rose-500">{error}</p>
        </div>
      )}
    </div>
  )
}

/* ===========================
   SUCCESS TOAST
   =========================== */
function SuccessToast({ message }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
      <p className="text-sm font-medium text-emerald-700">{message}</p>
    </div>
  )
}

/* ===========================
   LOGIN PAGE
   =========================== */
export default function LoginPage() {
  const [form, setForm]           = useState({ email: '', password: '' })
  const [errors, setErrors]       = useState({})
  const [showPass, setShowPass]   = useState(false)
  const [remember, setRemember]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error on type
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    // ──────────────────────────────────────────────────
    // 🔗 BACKEND INTEGRATION POINT
    // Replace the setTimeout below with your actual API call:
    //
    //   const res = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email: form.email, password: form.password }),
    //   })
    //   const data = await res.json()
    //   if (!res.ok) { setErrors({ form: data.message }); return }
    //   localStorage.setItem('token', data.token)
    //   navigate('/dashboard')
    // ──────────────────────────────────────────────────
    await new Promise(r => setTimeout(r, 1500)) // Simulated delay
    setLoading(false)
    setSuccess(true)
  }

  const handleGoogleLogin = () => {
    // 🔗 BACKEND INTEGRATION POINT
    // Connect Google OAuth here:
    //   window.location.href = '/api/auth/google'
    alert('Google login will be connected to your backend OAuth route.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30 flex">

      {/* ── Left Panel (decorative, hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 overflow-hidden">

        {/* Blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm">
              <Search className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white">
              Campus<span className="text-indigo-200">Find</span>
            </span>
          </Link>

          {/* Centre message */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-extrabold text-white mb-4 leading-tight">
                Welcome back
                <br />
                <span className="text-indigo-200">to CampusFind.</span>
              </h2>
              <p className="text-indigo-200 text-lg leading-relaxed max-w-md">
                Your campus's trusted platform for recovering lost belongings and helping others find theirs.
              </p>
            </div>

            {/* Feature pills */}
            <div className="space-y-3">
              {[
                '✓ Verified college students only',
                '✓ Smart item matching technology',
                '✓ Secure & private messaging',
                '✓ 90% average recovery rate',
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-indigo-100 text-sm"
                >
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stat */}
          <div className="flex items-center gap-6">
            {[['500+', 'Items Reported'], ['350+', 'Recovered'], ['1k+', 'Students']].map(([val, label]) => (
              <div key={label}>
                <p className="text-2xl font-extrabold text-white">{val}</p>
                <p className="text-xs text-indigo-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel (Login Form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-12">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <Search className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-slate-800">
              Campus<span className="text-indigo-600">Find</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 space-y-6">

            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">Welcome Back 👋</h1>
              <p className="text-sm text-slate-500">Sign in to your CampusFind account</p>
            </div>

            {/* Success state */}
            {success && (
              <SuccessToast message="Login successful! Redirecting to your dashboard..." />
            )}

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              {/* Google SVG icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <FormField
                id="email"
                label="College Email Address"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                error={errors.email}
                icon={Mail}
              />

              <FormField
                id="password"
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
                icon={Lock}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
              />

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4.5 h-4.5 rounded-md border-2 transition-all flex items-center justify-center ${
                      remember ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'
                    }`} style={{ width: '18px', height: '18px' }}>
                      {remember && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-md hover:shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 text-base mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Signing in...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Success!
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Sign up link */}
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                Sign Up — it's free
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-5 text-xs text-slate-400">
            <span>🔒 Secured with SSL</span>
            <span>·</span>
            <span>🎓 Students only</span>
            <span>·</span>
            <span>🛡️ FERPA compliant</span>
          </div>
        </div>
      </div>
    </div>
  )
}
