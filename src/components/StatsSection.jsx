import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 500,  suffix: '+', label: 'Items Reported',   emoji: '📋', desc: 'and counting every day' },
  { value: 350,  suffix: '+', label: 'Items Recovered',  emoji: '🎉', desc: 'reunited with owners'  },
  { value: 1000, suffix: '+', label: 'Students Active',  emoji: '🎓', desc: 'across campus'          },
  { value: 90,   suffix: '%', label: 'Recovery Rate',    emoji: '🏆', desc: 'industry-leading'       },
]

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])

  return count
}

function StatCard({ value, suffix, label, emoji, desc, start, delay = 0 }) {
  const count = useCountUp(value, 1600 + delay, start)

  return (
    <div
      className="group text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 hover:-translate-y-1"
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <div className="text-4xl sm:text-5xl font-extrabold text-white mb-1 tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-base font-semibold text-indigo-200 mb-1">{label}</div>
      <div className="text-xs text-indigo-300/80">{desc}</div>
    </div>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-24 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-white/20">
            By The Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            CampusFind in Action
          </h2>
          <p className="text-indigo-200 max-w-xl mx-auto">
            Real results from real students — our platform has already made a meaningful impact on campus.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, idx) => (
            <StatCard key={idx} {...stat} start={hasStarted} delay={idx * 150} />
          ))}
        </div>
      </div>
    </section>
  )
}
