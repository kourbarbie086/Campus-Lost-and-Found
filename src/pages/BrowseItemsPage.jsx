import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, MapPin, Calendar, Tag, Loader2 } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { CATEGORIES, CATEGORY_EMOJI, STATUS_BADGE } from '../data/mockData'
import { api } from '../services/api'

function formatImageUrl(url) {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `/${url.replace(/^\//, '')}`
}

/* ── Item card ───────────────────────────────────────────────────────── */
function ItemCard({ item }) {
  const emoji  = CATEGORY_EMOJI[item.category] ?? '📦'
  const status = STATUS_BADGE[item.status]     ?? STATUS_BADGE.pending
  const isLost = item.type === 'lost'

  const dateStr = item.date
    ? new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  const itemId = item._id || item.id

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {item.imageURL ? (
        <img src={formatImageUrl(item.imageURL)} alt={item.title} className="w-full h-44 object-cover" />
      ) : (
        <div className={`w-full h-44 flex items-center justify-center text-6xl ${
          isLost
            ? 'bg-gradient-to-br from-rose-50 to-red-100'
            : 'bg-gradient-to-br from-emerald-50 to-green-100'
        }`}>
          {emoji}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
            isLost
              ? 'bg-rose-100 text-rose-600'
              : 'bg-emerald-100 text-emerald-600'
          }`}>
            {isLost ? 'Lost' : 'Found'}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${status.cls}`}>
            {status.label}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-800 leading-snug mb-1 line-clamp-1">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description}</p>
        )}

        <div className="space-y-1 text-xs text-slate-400 mb-4">
          <p className="flex items-center gap-1.5"><MapPin size={12} className="text-indigo-400" /> {item.location}</p>
          <p className="flex items-center gap-1.5"><Calendar size={12} className="text-indigo-400" /> {dateStr}</p>
          <p className="flex items-center gap-1.5 capitalize"><Tag size={12} className="text-indigo-400" /> {item.category}</p>
        </div>

        {item.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.keywords.slice(0, 3).map(kw => (
              <span key={kw} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                #{kw}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/items/${itemId}`}
          className="mt-auto block text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-indigo-200"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

/* ── Skeleton card ───────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
      <div className="w-full h-44 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-slate-200 rounded-full" />
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-10 bg-slate-200 rounded-xl mt-4" />
      </div>
    </div>
  )
}

/* ── Filter chip ─────────────────────────────────────────────────────── */
function FilterChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-indigo-900 transition-colors"><X size={12} /></button>
    </span>
  )
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function BrowseItemsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [keyword,     setKeyword]     = useState('')
  const [category,    setCategory]    = useState('')
  const [type,        setType]        = useState('')

  const [items,   setItems]   = useState([])
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  /* Fetch from backend whenever filters change */
  useEffect(() => {
    setLoading(true)
    setError('')
    const filters = {}
    if (keyword)  filters.title    = keyword
    if (category) filters.category = category
    if (type)     filters.type     = type

    api.getItems(filters)
      .then(({ items: data, pagination }) => {
        setItems(data)
        setTotal(pagination?.total ?? data.length)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [keyword, category, type])

  const handleSearch = () => setKeyword(searchInput.trim())

  const activeFilters = [
    keyword  && { key: 'keyword',  label: `"${keyword}"`,       clear: () => { setKeyword(''); setSearchInput('') } },
    category && { key: 'category', label: CATEGORIES.find(c => c.value === category)?.label, clear: () => setCategory('') },
    type     && { key: 'type',     label: type === 'lost' ? 'Lost Items' : 'Found Items',    clear: () => setType('')     },
  ].filter(Boolean)

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-4">
            <Search size={14} className="text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Lost &amp; Found</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Browse All Items</h1>
          <p className="text-slate-500 text-lg">Search through reported lost and found items on campus</p>
        </div>

        {/* ── Search Bar ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-5">
          <div className="flex flex-col md:flex-row gap-3 flex-wrap">
            {/* Keyword search */}
            <div className="flex flex-1 gap-2 min-w-52">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  placeholder="Search by title, description..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-indigo-200"
              >
                Search
              </button>
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>

            {/* Type */}
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
            >
              <option value="">All Types</option>
              <option value="lost">Lost Items</option>
              <option value="found">Found Items</option>
            </select>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
              {activeFilters.map(f => (
                <FilterChip key={f.key} label={f.label} onRemove={f.clear} />
              ))}
              <button
                onClick={() => { setKeyword(''); setSearchInput(''); setCategory(''); setType('') }}
                className="text-xs text-slate-500 hover:text-red-500 transition-colors underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ── Results count ── */}
        {!loading && !error && (
          <p className="text-sm text-slate-400 mb-6">
            Showing <span className="font-semibold text-slate-700">{items.length}</span>
            {total > items.length && <> of <span className="font-semibold text-slate-700">{total}</span></>} items
          </p>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg font-semibold text-red-500 mb-2">⚠️ Failed to load items</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : !error && items.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-semibold text-slate-600">No items found</p>
            <p className="text-sm mt-2">Try adjusting your search or clearing filters</p>
          </div>
        ) : !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(item => <ItemCard key={item._id || item.id} item={item} />)}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
