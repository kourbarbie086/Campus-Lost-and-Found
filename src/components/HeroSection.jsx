import { Link } from 'react-router-dom'
import { ArrowRight, Search, Package } from 'lucide-react'

/* ---------- Floating Item Card ---------- */
function FloatingCard({ icon: Icon, label, color, className }) {
  return (
    <div className={`absolute bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-slate-100 ${className}`}>
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
  )
}

/* ---------- Inline SVG Illustration ---------- */
function HeroIllustration() {
  return (
    <div className="relative w-full max-w-sm lg:max-w-lg mx-auto h-80 lg:h-[460px]">

      {/* Main circle glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 opacity-60"></div>
      </div>

      {/* Centre illustration */}
      <div className="absolute inset-0 flex items-center justify-center animate-float">
        <div className="w-44 h-44 lg:w-56 lg:h-56 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-200 flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-28 h-28 lg:w-36 lg:h-36" fill="none">
            {/* Magnifying glass */}
            <circle cx="50" cy="48" r="26" stroke="white" strokeWidth="6" fill="none" opacity="0.9"/>
            <line x1="69" y1="67" x2="88" y2="88" stroke="white" strokeWidth="7" strokeLinecap="round"/>
            {/* Item inside lens */}
            <rect x="38" y="38" width="24" height="18" rx="4" fill="white" opacity="0.5"/>
            <rect x="42" y="42" width="10" height="3" rx="1.5" fill="white"/>
            <rect x="42" y="47" width="16" height="3" rx="1.5" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Floating badge cards */}
      <FloatingCard
        icon={Package}
        label="Item Found!"
        color="bg-emerald-500"
        className="top-6 -left-4 lg:-left-12 animate-float-delayed"
      />
      <FloatingCard
        icon={Search}
        label="Searching..."
        color="bg-indigo-500"
        className="bottom-12 -right-4 lg:-right-10 animate-float-delayed-2"
      />

      {/* Decorative dots */}
      <div className="absolute top-8 right-12 w-3 h-3 rounded-full bg-violet-300 opacity-70 animate-float-delayed"></div>
      <div className="absolute bottom-24 left-10 w-2 h-2 rounded-full bg-indigo-400 opacity-60 animate-float-delayed-2"></div>
      <div className="absolute top-1/2 left-4 w-4 h-4 rounded-full bg-indigo-200 opacity-50 animate-float"></div>
    </div>
  )
}

/* =================== HERO =================== */
export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30 pt-20"
    >
      {/* Background decorators */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-100/40 blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">College Lost &amp; Found Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Lost Something?
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Let's Help You
              </span>
              <br />
              Find It.
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              CampusFind is your college's smart lost &amp; found hub. Report, discover, and recover your belongings quickly and securely — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 text-base">
                I Lost Something
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-2xl shadow-md border border-slate-200 transition-all duration-300 hover:-translate-y-0.5 text-base">
                I Found Something
                <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 justify-center lg:justify-start pt-2">
              <div className="flex -space-x-2">
                {['🎓','📚','🎒','🏫'].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">1,000+ students</span> already using CampusFind
              </p>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center lg:justify-end">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}
