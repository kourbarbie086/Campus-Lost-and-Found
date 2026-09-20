import { ClipboardList, Sparkles, HandHeart } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Report an Item',
    description:
      'Fill out a quick form describing your lost or found item — include photos, location, date, and any identifying details.',
    color: 'from-indigo-500 to-indigo-600',
    lightColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    step: '02',
    icon: Sparkles,
    title: 'Find a Match',
    description:
      'Our smart system scans all reports and notifies you instantly when a potential match for your item is found.',
    color: 'from-violet-500 to-violet-600',
    lightColor: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    step: '03',
    icon: HandHeart,
    title: 'Get It Back',
    description:
      'Coordinate a safe handover through our verified student network and reunite with your belongings on campus.',
    color: 'from-emerald-500 to-emerald-600',
    lightColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Getting your lost item back is just three simple steps away. CampusFind makes it fast and stress-free.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-indigo-200 via-violet-200 to-emerald-200 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              return (
                <div
                  key={idx}
                  className="group text-center bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Step Number */}
                  <div className="flex items-center justify-center mb-6">
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-slate-100 text-xs font-black text-slate-600 flex items-center justify-center shadow-sm">
                        {idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Step label */}
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                    Step {step.step}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>

                  {/* Bottom accent */}
                  <div className={`mt-6 h-1 w-12 mx-auto rounded-full bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
