import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Package, TrendingUp, Layers, CheckCircle2,
  MapPin, Calendar, ArrowRight, LayoutDashboard, Plus, Loader2
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { CATEGORY_EMOJI } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

/* ── Stat card ───────────────────────────────────────────────────────── */
function StatCard({ title, value, color, bg, icon: Icon, href }) {
  return (
    <Link to={href} className="group">
      <div className={`${bg} rounded-2xl p-5 border border-white/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className={`w-9 h-9 rounded-xl ${color} bg-opacity-20 flex items-center justify-center`}>
            <Icon size={18} className={color.replace('bg-', 'text-')} />
          </div>
        </div>
        <p className={`text-3xl font-extrabold ${color.replace('bg-', 'text-')}`}>{value}</p>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
          View all <ArrowRight size={11} />
        </p>
      </div>
    </Link>
  )
}

/* ── Status badge ────────────────────────────────────────────────────── */
const STATUS_CLS = {
  pending:  'text-amber-600',
  approved: 'text-emerald-600',
  rejected: 'text-red-500',
  claimed:  'text-blue-600',
  closed:   'text-slate-400',
  suggested:'text-purple-600',
  accepted: 'text-emerald-600',
}

function StatusText({ status }) {
  return (
    <span className={`font-semibold capitalize text-xs ${STATUS_CLS[status] ?? 'text-slate-500'}`}>
      {status?.replace('_', ' ') ?? '—'}
    </span>
  )
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user: authUser } = useAuth()
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getUserDashboard()
      .then(data => { setDashData(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const user    = dashData?.profile   || authUser || {}
  const stats   = dashData?.stats     || { lostItems: 0, foundItems: 0, claims: 0, matches: 0 }
  const recent  = dashData?.recentActivity || []
  const matches = dashData?.matches   || []
  const claims  = dashData?.claims    || []
  const browse  = dashData?.browseItems || []

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
          <div>
            <p className="text-slate-500 text-lg mb-4">⚠️ Could not load your dashboard.</p>
            <p className="text-sm text-slate-400">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold">
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* ── Top Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-3">
              <LayoutDashboard size={14} className="text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back, {user.firstname}! 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">Here's what's happening with your items today.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 text-sm"
            >
              <Plus size={15} />
              Report Item
            </Link>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center rounded-full font-bold text-sm shadow-md shrink-0">
              {user.firstname?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="My Lost Items"
            value={stats.lostItems}
            color="bg-rose-500"
            bg="bg-rose-50"
            icon={Search}
            href="/lost-items"
          />
          <StatCard
            title="My Found Items"
            value={stats.foundItems}
            color="bg-emerald-500"
            bg="bg-emerald-50"
            icon={Package}
            href="/found-items"
          />
          <StatCard
            title="My Claims"
            value={stats.claims}
            color="bg-amber-500"
            bg="bg-amber-50"
            icon={CheckCircle2}
            href="/dashboard"
          />
          <StatCard
            title="My Matches"
            value={stats.matches}
            color="bg-indigo-500"
            bg="bg-indigo-50"
            icon={Layers}
            href="/dashboard"
          />
        </div>

        {/* ── Recent Activity + Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Activity Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-500" />
                Recent Activity
              </h2>
              <Link to="/items" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[360px]">
                <thead>
                  <tr className="text-slate-400 border-b text-xs uppercase tracking-wide">
                    <th className="py-2 pr-4">Item</th>
                    <th className="pr-4">Type</th>
                    <th className="pr-4 hidden sm:table-cell">Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.length === 0 ? (
                    <tr><td colSpan={4} className="py-6 text-center text-slate-400 text-sm">No recent activity yet.</td></tr>
                  ) : recent.map(item => (
                    <tr key={item._id || item.id} className="border-b hover:bg-indigo-50/50 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-slate-700 max-w-[140px] truncate">
                        {CATEGORY_EMOJI[item.category] ?? '📦'} {item.title}
                      </td>
                      <td className="pr-4">
                        <span className={`capitalize font-semibold text-xs ${item.type === 'lost' ? 'text-rose-500' : 'text-emerald-600'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="pr-4 text-slate-400 hidden sm:table-cell text-xs truncate max-w-[100px]">
                        {item.location}
                      </td>
                      <td><StatusText status={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { label: 'Report Lost Item',  href: '/report',       color: 'bg-rose-500',    emoji: '🔍' },
                  { label: 'Report Found Item', href: '/report',       color: 'bg-emerald-500', emoji: '📦' },
                  { label: 'Browse Items',      href: '/items',        color: 'bg-indigo-500',  emoji: '🧭' },
                  { label: 'My Profile',        href: '/profile',      color: 'bg-violet-500',  emoji: '👤' },
                ].map(action => (
                  <Link
                    key={action.label}
                    to={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <span className="text-lg">{action.emoji}</span>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{action.label}</span>
                    <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile mini card */}
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center font-bold text-base">
                  {user.firstname?.[0]}
                </div>
                <div>
                  <p className="font-bold text-sm">{user.firstname} {user.lastname}</p>
                  <p className="text-indigo-200 text-xs">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20">
                {[['Lost', stats.lostItems], ['Found', stats.foundItems], ['Claims', stats.claims]].map(([l, v]) => (
                  <div key={l} className="text-center">
                    <p className="font-extrabold text-lg">{v}</p>
                    <p className="text-xs text-indigo-200">{l}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/profile"
                className="mt-3 block text-center text-xs text-white/80 hover:text-white font-medium transition-colors underline underline-offset-2"
              >
                Edit Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Matches + Claims row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Matches */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Layers size={17} className="text-indigo-500" /> My Matches
              </h2>
              <span className="text-xs bg-indigo-100 text-indigo-600 font-semibold px-2.5 py-1 rounded-full">{matches.length}</span>
            </div>

            {matches.length === 0 ? (
              <p className="text-slate-400 text-sm">No matches found yet.</p>
            ) : (
              <div className="space-y-3">
                {matches.map(match => (
                  <Link key={match._id || match.id} to={`/items/${match.lostItem?._id || match.lostItem?.id}`} className="block p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-700 text-sm truncate">
                          {CATEGORY_EMOJI[match.lostItem?.category] ?? '📦'} {match.lostItem?.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">📍 {match.lostItem?.location}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Matched: {match.foundItem?.title}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                          {match.matchScore}%
                        </span>
                        <div className="mt-1">
                          <StatusText status={match.status} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Claims */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-500" /> My Claims
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">{claims.length}</span>
            </div>

            {claims.length === 0 ? (
              <p className="text-slate-400 text-sm">You haven't made any claims yet.</p>
            ) : (
              <ul className="space-y-3">
                {claims.map(claim => (
                  <li key={claim._id || claim.id}>
                    <Link to={`/items/${claim.item?._id || claim.item?.id}`} className="flex items-center justify-between bg-slate-50 hover:bg-indigo-50 p-3 rounded-xl transition-all border border-transparent hover:border-indigo-100 gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-700 text-sm truncate">
                          {CATEGORY_EMOJI[claim.item?.category] ?? '📦'} {claim.item?.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin size={10} /> {claim.item?.location}
                        </p>
                      </div>
                      <StatusText status={claim.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Browse Items Preview ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-800">Recent Campus Items</h2>
            <Link to="/items" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(browse.length ? browse : recent).slice(0, 4).map(item => (
              <Link to={`/items/${item._id || item.id}`} key={item._id || item.id}>
                <div className="border border-slate-100 hover:border-indigo-200 p-3 rounded-xl hover:shadow-md transition-all cursor-pointer h-full">
                  <p className="font-semibold text-slate-700 text-sm truncate">
                    {CATEGORY_EMOJI[item.category] ?? '📦'} {item.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 truncate flex items-center gap-1">
                    <MapPin size={10} /> {item.location}
                  </p>
                  <span className={`text-xs font-semibold capitalize mt-1.5 inline-block ${item.type === 'lost' ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {item.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </PageLayout>
  )
}
