import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, MapPin, Calendar, Tag, Image, AlertCircle, CheckCircle,
  ArrowRight
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { CATEGORIES } from '../data/mockData'
import { api } from '../services/api'

/* ── Field wrapper ───────────────────────────────────────────────────── */
function Field({ label, required, children, error, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint  && <p className="text-xs text-slate-400">{hint}</p>}
      {error && (
        <div className="flex items-center gap-1.5 text-rose-500">
          <AlertCircle size={13} />
          <p className="text-xs">{error}</p>
        </div>
      )}
    </div>
  )
}

/* ── Input component ─────────────────────────────────────────────────── */
function Input({ error, ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
        error
          ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-200'
          : 'border-slate-200 bg-slate-50 focus:border-indigo-400 focus:ring-indigo-100 focus:bg-white'
      }`}
    />
  )
}

/* ── Select component ────────────────────────────────────────────────── */
function Select({ error, children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full px-4 py-3 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all appearance-none bg-no-repeat bg-right bg-white ${
        error
          ? 'border-rose-400 focus:ring-rose-200'
          : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'
      }`}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: 'right 12px center', backgroundSize: '18px' }}
    >
      {children}
    </select>
  )
}

/* ── Validate ────────────────────────────────────────────────────────── */
function validate(form) {
  const errs = {}
  if (!form.title.trim())       errs.title    = 'Item name is required.'
  if (!form.category)           errs.category = 'Please select a category.'
  if (!form.location.trim())    errs.location = 'Location is required.'
  if (!form.date)               errs.date     = 'Date is required.'
  if (!form.description.trim()) errs.description = 'Description is required.'
  return errs
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function ReportItemPage() {
  const [form, setForm]     = useState({
    type: 'lost', title: '', category: '', location: '',
    date: '', keywords: '', description: '', lat: '', lng: '',
  })
  const [errors,   setErrors]   = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [preview,  setPreview]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  const handleChange = field => e => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleImageChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('type', form.type)
      formData.append('title', form.title.trim())
      formData.append('category', form.category)
      formData.append('location', form.location.trim())
      formData.append('date', new Date(form.date).toISOString())
      formData.append('description', form.description.trim())

      if (form.keywords?.trim()) {
        formData.append('keywords', form.keywords.trim())
      }
      if (form.lat) formData.append('lat', form.lat)
      if (form.lng) formData.append('lng', form.lng)
      if (imageFile) formData.append('image', imageFile)

      await api.createItem(formData)
      setLoading(false)
      setSuccess(true)
    } catch (err) {
      setLoading(false)
      setErrors({ form: err.message || 'Failed to report item. Please try again.' })
    }
  }

  const handleReset = () => {
    setForm({ type: 'lost', title: '', category: '', location: '', date: '', keywords: '', description: '', lat: '', lng: '' })
    setErrors({})
    setImageFile(null)
    setPreview(null)
    setSuccess(false)
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-4">
            <FileText size={14} className="text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Report an Item</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Report Lost or Found</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Fill in the details below. The more accurate your description, the faster the item can be reunited with its owner.
          </p>
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

          {/* Color header strip */}
          <div className={`px-8 py-6 ${form.type === 'lost' ? 'bg-gradient-to-r from-indigo-600 to-violet-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}>
            <h2 className="text-xl font-bold text-white">
              {form.type === 'lost' ? '🔍 I Lost Something' : '📦 I Found Something'}
            </h2>
            <p className="text-white/70 text-sm mt-1">
              {form.type === 'lost'
                ? "Let's create a report so others can help you find it."
                : "Great! Let's report it so the owner can claim it."}
            </p>
          </div>

          {success ? (
            /* ── Success State ── */
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Report Submitted!</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                Your {form.type} item report has been submitted successfully. We'll notify you of any matches.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all text-sm"
                >
                  Submit Another Report
                </button>
                <Link
                  to="/items"
                  className="px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-all text-sm text-center"
                >
                  Browse All Items
                </Link>
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} noValidate className="p-8 space-y-6">
              {errors.form && (
                <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Report Type Toggle */}
              <Field label="Report Type" required>
                <div className="grid grid-cols-2 gap-3">
                  {['lost', 'found'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, type: t }))}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                        form.type === t
                          ? t === 'lost'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                            : 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {t === 'lost' ? '🔍 I Lost Something' : '📦 I Found Something'}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Title + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Item Name" required error={errors.title}>
                  <Input
                    type="text"
                    value={form.title}
                    placeholder="e.g. Black Leather Wallet"
                    onChange={handleChange('title')}
                    error={errors.title}
                  />
                </Field>

                <Field label="Category" required error={errors.category}>
                  <Select value={form.category} onChange={handleChange('category')} error={errors.category}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </Select>
                </Field>
              </div>

              {/* Location + Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Location" required error={errors.location} hint="Where was it lost/found?">
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <Input
                      type="text"
                      value={form.location}
                      placeholder="e.g. Library, Block A"
                      onChange={handleChange('location')}
                      error={errors.location}
                      className="pl-10"
                      style={{ paddingLeft: '2.25rem' }}
                    />
                  </div>
                </Field>

                <Field label="Date Lost / Found" required error={errors.date}>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={form.date}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={handleChange('date')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                        errors.date
                          ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-200'
                          : 'border-slate-200 bg-slate-50 focus:border-indigo-400 focus:ring-indigo-100 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.date && (
                    <div className="flex items-center gap-1.5 text-rose-500">
                      <AlertCircle size={13} />
                      <p className="text-xs">{errors.date}</p>
                    </div>
                  )}
                </Field>
              </div>

              {/* Description */}
              <Field label="Description" required error={errors.description} hint="Color, brand, unique features, etc.">
                <textarea
                  rows={4}
                  value={form.description}
                  placeholder="Describe the item in detail: color, size, brand, any identifying marks..."
                  onChange={handleChange('description')}
                  className={`w-full px-4 py-3 border rounded-xl text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 transition-all ${
                    errors.description
                      ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-200'
                      : 'border-slate-200 bg-slate-50 focus:border-indigo-400 focus:ring-indigo-100 focus:bg-white'
                  }`}
                />
                {errors.description && (
                  <div className="flex items-center gap-1.5 text-rose-500">
                    <AlertCircle size={13} />
                    <p className="text-xs">{errors.description}</p>
                  </div>
                )}
              </Field>

              {/* Keywords */}
              <Field label="Keywords" hint="Comma-separated tags to help with matching (optional)">
                <div className="relative">
                  <Tag size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={form.keywords}
                    placeholder="e.g. black, leather, bifold, samsung"
                    onChange={handleChange('keywords')}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                  />
                </div>
              </Field>

              {/* Coordinates (optional) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  GPS Coordinates <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" step="any" value={form.lat} placeholder="Latitude" onChange={handleChange('lat')} />
                  <Input type="number" step="any" value={form.lng} placeholder="Longitude" onChange={handleChange('lng')} />
                </div>
              </div>

              {/* Image Upload */}
              <Field label="Upload Image" hint="JPG, PNG or WEBP · Max 5MB (optional)">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer">
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setPreview(null) }}
                        className="absolute top-2 right-2 bg-white/90 text-slate-700 rounded-full p-1 text-xs hover:bg-rose-50 hover:text-rose-500 transition-all shadow"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                        <Image size={22} className="text-indigo-500" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Click to upload a photo</p>
                      <p className="text-xs text-slate-400 mt-1">or drag and drop</p>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </Field>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full flex items-center justify-center gap-2 py-4 font-bold text-white rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-base ${
                  form.type === 'lost'
                    ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Report
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-slate-400">
                By submitting, you agree to our{' '}
                <a href="#" className="text-indigo-500 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-indigo-500 hover:underline">Privacy Policy</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
