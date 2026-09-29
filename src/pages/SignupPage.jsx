import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Mail, Lock, Eye, EyeOff, User, Search, ArrowRight,
  AlertCircle, CheckCircle, Phone
} from 'lucide-react'

/* ── Validation ──────────────────────────────────────────────────────── */
function validate(fields) {
  const errors = {}
  if (!fields.firstname.trim()) errors.firstname = 'First name is required.'
  if (!fields.lastname.trim())  errors.lastname  = 'Last name is required.'

  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!fields.password) {
    errors.password = 'Password is required.'
  } else if (fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  } else if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(fields.password)) {
    errors.password = 'Must include uppercase, lowercase, number, and special character (!@#$%^&*).'
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

/* ── Form field ──────────────────────────────────────────────────────── */
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
        <div className="pl-4 pr-1 shrink-0">
          <Icon className={`w-4 h-4 transition-colors ${error ? 'text-rose-400' : hasValue ? 'text-indigo-500' : 'text-slate-400'}`} />
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={label}
          className="flex-1 px-3 py-3.5 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          autoComplete={id}
        />
        {rightElement && <div className="pr-3 shrink-0">{rightElement}</div>}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 px-1">
          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <p className="text-xs text-rose-500">{error}</p>
        </div>
      )}
    </div>
  )
}

/* ── Password strength ───────────────────────────────────────────────── */
const PW_RULES = [
  { test: pw => pw.length >= 8,          label: '8+ characters'    },
  { test: pw => /[A-Z]/.test(pw),        label: 'Uppercase letter' },
  { test: pw => /[0-9]/.test(pw),        label: 'Number'           },
  { test: pw => /[^A-Za-z0-9]/.test(pw), label: 'Special char'    },
]

function PwStrength({ pw }) {
  if (!pw) return null
  const passed = PW_RULES.filter(r => r.test(pw)).length
  const pct    = (passed / PW_RULES.length) * 100
  const color  = passed <= 1 ? 'bg-rose-400' : passed <= 2 ? 'bg-amber-400' : passed <= 3 ? 'bg-yellow-400' : 'bg-emerald-500'

  return (
    <div className="space-y-2">
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {PW_RULES.map(r => (
          <span key={r.label} className={`text-xs flex items-center gap-1 ${r.test(pw) ? 'text-emerald-500' : 'text-slate-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${r.test(pw) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            {r.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function SignupPage() {
  const navigate = useNavigate()
  const { signup, login, isAuthenticated } = useAuth()

  const [form, setForm]           = useState({ firstname: '', lastname: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors]       = useState({})
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [agreed,   setAgreed]     = useState(false)
  const [loading,  setLoading]    = useState(false)
  const [success,  setSuccess]    = useState(false)

  useEffect(() => {
    if (isAuthenticated && !success) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, success, navigate])

  const handleChange = field => e => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!agreed) { setErrors({ form: 'Please agree to the terms.' }); return }
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const payload = {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        password: form.password,
      }
      if (form.phone?.trim()) {
        payload.phone = form.phone.trim()
      }

      await signup(payload)

      // Auto login after registration
      try {
        await login({ email: payload.email, password: payload.password })
      } catch {
        // Fallback: user can still click Go to Login
      }

      setLoading(false)
      setSuccess(true)
    } catch (err) {
      setLoading(false)
      setErrors({ form: err.message || 'Registration failed. Please try again.' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30 flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative bg-gradient-to-br from-violet-600 via-indigo-700 to-indigo-600 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm">
              <Search className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white">
              Campus<span className="text-violet-200">Find</span>
            </span>
          </Link>

          <div className="space-y-6">
            <div>
              <h2 className="text-4xl xl:text-5xl font-extrabold text-white mb-4 leading-tight">
                Join your campus<br />
                <span className="text-violet-200">community.</span>
              </h2>
              <p className="text-violet-200 text-lg leading-relaxed max-w-md">
                Create your CampusFind account and start helping fellow students recover their lost belongings.
              </p>
            </div>
            <div className="space-y-3">
              {['✓ Free for all verified students', '✓ Smart matching algorithm', '✓ Secure & FERPA-compliant', '✓ Campus-wide reach'].map((t, i) => (
                <div key={i} className="text-violet-100 text-sm">{t}</div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {[['500+', 'Items Reported'], ['350+', 'Recovered'], ['1k+', 'Students']].map(([val, label]) => (
              <div key={label}>
                <p className="text-2xl font-extrabold text-white">{val}</p>
                <p className="text-xs text-violet-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
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

        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 space-y-5">

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">Create Account 🎓</h1>
              <p className="text-sm text-slate-500">Sign up for your free CampusFind account</p>
            </div>

            {success ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-9 h-9 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Account Created!</h3>
                <p className="text-sm text-slate-500">Welcome to CampusFind. You can now log in and start using the platform.</p>
                <Link to="/login" className="block w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition-all text-center text-base">
                  Go to Login <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
              </div>
            ) : (
              <>
                {/* Google Signup */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {errors.form && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-600">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errors.form}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField id="firstname" label="First Name" value={form.firstname} onChange={handleChange('firstname')} error={errors.firstname} icon={User} />
                    <FormField id="lastname"  label="Last Name"  value={form.lastname}  onChange={handleChange('lastname')}  error={errors.lastname}  icon={User} />
                  </div>

                  <FormField id="email" label="College Email" type="email" value={form.email} onChange={handleChange('email')} error={errors.email} icon={Mail} />

                  <FormField id="phone" label="Phone (optional)" type="tel" value={form.phone} onChange={handleChange('phone')} error={errors.phone} icon={Phone} />

                  <FormField
                    id="password" label="Password" type={showPass ? 'text' : 'password'}
                    value={form.password} onChange={handleChange('password')} error={errors.password} icon={Lock}
                    rightElement={
                      <button type="button" onClick={() => setShowPass(v => !v)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                        {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    }
                  />

                  <PwStrength pw={form.password} />

                  <FormField
                    id="confirmPassword" label="Confirm Password" type={showConf ? 'text' : 'password'}
                    value={form.confirmPassword} onChange={handleChange('confirmPassword')} error={errors.confirmPassword} icon={Lock}
                    rightElement={
                      <button type="button" onClick={() => setShowConf(v => !v)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                        {showConf ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    }
                  />

                  {/* Terms */}
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="sr-only" />
                      <div className={`w-4.5 h-4.5 rounded border-2 transition-all flex items-center justify-center ${agreed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`} style={{ width: '18px', height: '18px' }}>
                        {agreed && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 leading-relaxed">
                      I agree to the{' '}
                      <a href="#" className="text-indigo-600 hover:underline font-medium">Terms of Service</a>{' '}
                      and{' '}
                      <a href="#" className="text-indigo-600 hover:underline font-medium">Privacy Policy</a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-md hover:shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 text-base mt-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      <>Create Account <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                    Sign In
                  </Link>
                </p>
              </>
            )}
          </div>

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
