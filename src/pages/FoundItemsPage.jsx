import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Plus } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { CATEGORIES, CATEGORY_EMOJI, STATUS_BADGE, STATUSES } from '../data/mockData'
import { api } from '../services/api'

function formatImageUrl(url) {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `/${url.replace(/^\//, '')}`
}

/* ── Item card ───────────────────────────────────────────────────────── */
function ItemCard({ item }) {
  const navigate = useNavigate()
  const emoji    = CATEGORY_EMOJI[item.category] ?? '📦'
  const status   = STATUS_BADGE[item.status]     ?? STATUS_BADGE.pending
  const itemId   = item._id || item.id

  const dateStr = item.date
    ? new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : '—'

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {item.imageURL ? (
        <img src={formatImageUrl(item.imageURL)} alt={item.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center text-5xl">
          {emoji}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-slate-800 line-clamp-1">{item.title}</h3>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.cls}`}>
            {status.label}
          </span>
        </div>

        {item.description && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description}</p>
        )}

        <div className="space-y-1 text-xs text-slate-400 mb-4">
          <p className="flex items-center gap-1.5"><MapPin size={12} className="text-emerald-500" /> {item.location}</p>
          <p className="flex items-center gap-1.5"><Calendar size={12} className="text-emerald-500" /> {dateStr}</p>
        </div>

        {item.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.keywords.slice(0, 3).map(kw => (
              <span key={kw} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">#{kw}</span>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate(`/items/${itemId}`)}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-indigo-200"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

/* ── Skeleton ────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
      <div className="w-full h-40 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-10 bg-slate-200 rounded-xl mt-4" />
      </div>
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function FoundItemsPage() {
  const [searchInput,  setSearchInput]  = useState('')
  const [keyword,      setKeyword]      = useState('')
  const [category,     setCategory]     = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [allItems, setAllItems] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    setLoading(true)
    api.getMyItems({ type: 'found' })
      .then(({ items }) => { setAllItems(items); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    return allItems.filter(item => {
      const matchKeyword  = !keyword      || item.title.toLowerCase().includes(keyword.toLowerCase())
      const matchCategory = !category     || item.category === category
      const matchStatus   = !statusFilter || item.status   === statusFilter
      return matchKeyword && matchCategory && matchStatus
    })
  }, [allItems, keyword, category, statusFilter])

  const handleSearch = () => setKeyword(searchInput.trim())

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">My Reports</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">My Found Items</h1>
            <p className="text-slate-500">Items you have reported as found</p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 text-sm whitespace-nowrap"
          >
            <Plus size={16} />
            Report Found Item
          </Link>
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 flex-wrap">
            <div className="flex flex-1 gap-2 min-w-52">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  placeholder="Search your found items..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all"
              >
                Search
              </button>
            </div>

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-400 bg-white"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-400 bg-white"
            >
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="text-center py-10 text-slate-400">
            <p className="text-red-500 font-semibold mb-1">⚠️ Failed to load items</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* ── Count ── */}
        {!loading && !error && (
          <p className="text-sm text-slate-400 mb-6">
            <span className="font-semibold text-slate-700">{filtered.length}</span> item{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : !error && filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-lg font-semibold text-slate-600">No found items yet</p>
            <p className="text-sm mt-2">Found something? Report it so the owner can claim it.</p>
            <Link to="/report" className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-all">
              <Plus size={15} /> Report Found Item
            </Link>
          </div>
        ) : !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(item => <ItemCard key={item._id || item.id} item={item} />)}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
