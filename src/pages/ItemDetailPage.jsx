import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Calendar, Tag, User, Shield, Clock,
  CheckCircle, XCircle, Layers, ChevronRight, Loader2
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { CATEGORY_EMOJI, STATUS_BADGE } from '../data/mockData'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

/* ── Status config ───────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  pending:  { label: 'Pending Review', color: 'text-amber-600',   bg: 'bg-amber-50  border-amber-200',   icon: Clock       },
  approved: { label: 'Approved',       color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle },
  rejected: { label: 'Rejected',       color: 'text-red-600',     bg: 'bg-red-50    border-red-200',      icon: XCircle     },
  claimed:  { label: 'Claimed',        color: 'text-blue-600',    bg: 'bg-blue-50   border-blue-200',     icon: CheckCircle },
  closed:   { label: 'Closed',         color: 'text-slate-500',   bg: 'bg-slate-50  border-slate-200',    icon: XCircle     },
}

const MATCH_STATUS = {
  suggested: { label: 'Suggested', cls: 'bg-purple-100 text-purple-600' },
  accepted:  { label: 'Accepted',  cls: 'bg-green-100  text-green-600'  },
  rejected:  { label: 'Rejected',  cls: 'bg-red-100    text-red-500'    },
}

/* ── Info row ────────────────────────────────────────────────────────── */
function InfoRow({ icon: Icon, label, value, className = '' }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-2 bg-indigo-50 rounded-lg shrink-0">
        <Icon size={15} className="text-indigo-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 text-slate-700 ${className}`}>{value}</p>
      </div>
    </div>
  )
}

/* ── Match card ──────────────────────────────────────────────────────── */
function MatchCard({ match, currentId }) {
  const navigate    = useNavigate()
  const isLost      = (match.lostItem?._id || match.lostItem?.id) === currentId
  const otherItem   = isLost ? match.foundItem : match.lostItem
  const statusCls   = MATCH_STATUS[match.status]?.cls   ?? 'bg-slate-100 text-slate-500'
  const statusLabel = MATCH_STATUS[match.status]?.label ?? match.status
  if (!otherItem) return null

  const otherId = otherItem._id || otherItem.id

  return (
    <div
      onClick={() => navigate(`/items/${otherId}`)}
      className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shrink-0">
          {CATEGORY_EMOJI[otherItem.category] ?? '📦'}
        </div>
        <div>
          <p className="font-semibold text-slate-700 text-sm">{otherItem.title}</p>
          <p className="text-xs text-slate-400">📍 {otherItem.location}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{match.matchScore}%</span>
          <div className="mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCls}`}>{statusLabel}</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
      </div>
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function ItemDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [item,     setItem]     = useState(null)
  const [matches,  setMatches]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [claiming, setClaiming] = useState(false)
  const [claimMsg, setClaimMsg] = useState('')
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [claimForm, setClaimForm] = useState({ message: '', contactInfo: '' })
  const [claimError, setClaimError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.getItemById(id)
      .then(data => {
        setItem(data?.item || data)
        setMatches(data?.matches || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  const openClaimModal = () => {
    if (!user) { navigate('/login'); return }
    setClaimForm({
      message: '',
      contactInfo: user.email || user.phone || '',
    })
    setClaimError('')
    setShowClaimModal(true)
  }

  const handleClaimSubmit = async (e) => {
    e.preventDefault()
    if (!claimForm.contactInfo.trim()) {
      setClaimError('Please provide your contact information (email or phone).')
      return
    }
    if (!claimForm.message.trim() || claimForm.message.trim().length < 10) {
      setClaimError('Message must be at least 10 characters describing how this item is yours.')
      return
    }

    setClaiming(true)
    setClaimError('')
    try {
      await api.createClaim({
        itemId: id,
        message: claimForm.message.trim(),
        contactInfo: claimForm.contactInfo.trim(),
      })
      setClaimMsg('✅ Claim submitted successfully! The reporter will review it.')
      setShowClaimModal(false)
    } catch (err) {
      setClaimError(err.message || 'Failed to submit claim.')
    } finally {
      setClaiming(false)
    }
  }

  const formatImageUrl = (url) => {
    if (!url) return null
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `/${url.replace(/^\//, '')}`
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </PageLayout>
    )
  }

  if (error || !item) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Item Not Found</h1>
          <p className="text-slate-500 mb-8">{error || 'This item may have been removed or the link is invalid.'}</p>
          <Link to="/items" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all">
            Browse All Items
          </Link>
        </div>
      </PageLayout>
    )
  }

  const isLost      = item.type === 'lost'
  const emoji       = CATEGORY_EMOJI[item.category] ?? '📦'
  const status      = STATUS_CONFIG[item.status]    ?? STATUS_CONFIG.pending
  const StatusIcon  = status.icon
  const statusBadge = STATUS_BADGE[item.status]     ?? STATUS_BADGE.pending

  const dateStr = item.date
    ? new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  const createdStr = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  // reporter info — backend may populate postedBy as an object
  const reporter = item.postedBy
  const reporterName = reporter?.firstname
    ? `${reporter.firstname} ${reporter.lastname ?? ''}`.trim()
    : reporter?.name ?? null

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Back ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="space-y-6">

          {/* ── Hero Card ── */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row">

              {/* Image / Emoji */}
              <div className="lg:w-2/5 shrink-0">
                {item.imageURL ? (
                  <img src={formatImageUrl(item.imageURL)} alt={item.title} className="w-full h-64 lg:h-full object-cover" />
                ) : (
                  <div className={`w-full h-64 lg:h-full min-h-64 flex items-center justify-center text-8xl ${
                    isLost
                      ? 'bg-gradient-to-br from-rose-50 to-red-100'
                      : 'bg-gradient-to-br from-emerald-50 to-green-100'
                  }`}>
                    {emoji}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 p-7 lg:p-10 flex flex-col justify-between">
                <div>
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                      isLost ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {isLost ? 'Lost' : 'Found'}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${status.bg} ${status.color}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                  </div>

                  <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight mb-3">
                    {item.title}
                  </h1>

                  {item.description && (
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.description}</p>
                  )}

                  {/* Info grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoRow icon={MapPin}   label="Location"    value={item.location} />
                    <InfoRow icon={Calendar} label="Date"        value={dateStr} />
                    <InfoRow icon={Tag}      label="Category"    value={`${emoji} ${item.category}`} className="capitalize" />
                    <InfoRow icon={Calendar} label="Reported On" value={createdStr} />
                  </div>
                </div>

                {/* Reporter */}
                {reporterName && (
                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {reporterName[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Reported by</p>
                      <p className="text-sm font-semibold text-slate-700">{reporterName}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-medium">
                        <Shield size={11} /> Verified
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Keywords ── */}
          {item.keywords?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={17} className="text-indigo-500" />
                <h2 className="font-bold text-slate-800">Keywords</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.keywords.map(kw => (
                  <span key={kw} className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Potential Matches ── */}
          {matches.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Layers size={17} className="text-indigo-500" />
                <h2 className="font-bold text-slate-800">Potential Matches</h2>
                <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                  {matches.length}
                </span>
              </div>
              <div className="space-y-3">
                {matches.map(match => (
                  <MatchCard key={match._id || match.id} match={match} currentId={id} />
                ))}
              </div>
            </div>
          )}

          {/* ── Claim message ── */}
          {claimMsg && (
            <div className={`text-sm font-semibold px-4 py-3 rounded-xl ${claimMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              {claimMsg}
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex flex-wrap gap-3 pb-4">
            {!isLost && item.status !== 'claimed' && item.status !== 'closed' && (
              <button
                onClick={openClaimModal}
                disabled={claiming}
                className="flex-1 sm:flex-none px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-200 text-sm disabled:opacity-60"
              >
                🙋 Claim This Item
              </button>
            )}
            <Link
              to="/report"
              className="flex-1 sm:flex-none px-7 py-3.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-2xl font-semibold transition-all text-sm text-center"
            >
              Report Similar Item
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none px-7 py-3.5 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-2xl font-semibold transition-all text-sm"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>

      {/* ── Claim Modal ── */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Claim "{item.title}"</h3>
              <button
                onClick={() => setShowClaimModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {claimError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {claimError}
              </div>
            )}

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Contact Information <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your phone number or campus email"
                  value={claimForm.contactInfo}
                  onChange={e => setClaimForm(prev => ({ ...prev, contactInfo: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Proof of Ownership / Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe unique marks, serial numbers, wallpapers, contents, or circumstances proving this item belongs to you..."
                  value={claimForm.message}
                  onChange={e => setClaimForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Minimum 10 characters required.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={claiming}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-all disabled:opacity-60"
                >
                  {claiming ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
