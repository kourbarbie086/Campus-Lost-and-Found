import { AlertTriangle, PackageCheck, Zap, ShieldCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: AlertTriangle,
    title: 'Report Lost Items',
    description:
      `Quickly report anything you've lost on campus — keys, wallets, ID cards, electronics, and more. Add photos and precise location for faster matches.`,
    color: 'from-rose-500 to-orange-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    iconColor: 'text-rose-600',
    tag: 'Most Used',
  },
  {
    icon: PackageCheck,
    title: 'Report Found Items',
    description:
      `Found something on campus? Help a fellow student by reporting it here. Upload a photo and location and we'll find the rightful owner.`,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconColor: 'text-emerald-600',
    tag: 'Do Good',
  },
  {
    icon: Zap,
    title: 'Smart Search',
    description:
      'Our intelligent search engine matches lost reports with found items using keywords, location data, and item categories for accurate results.',
    color: 'from-amber-500 to-yellow-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconColor: 'text-amber-600',
    tag: 'Powered by AI',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Student Verification',
    description:
      'Only verified students and staff of your college can access the platform — ensuring a safe and trusted environment for every interaction.',
    color: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    iconColor: 'text-indigo-600',
    tag: 'Verified & Safe',
  },
]

export default function FeaturesSection() {
  return (
    <section id="about" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Why CampusFind
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Everything You Need to
            <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Recover What's Yours
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Built specifically for college campuses, CampusFind brings together powerful features in a clean, easy-to-use interface.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={idx}
                className={`group relative bg-white rounded-3xl p-7 border ${feat.border} shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden`}
              >
                {/* Tag */}
                <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider ${feat.iconColor} ${feat.bg} px-2.5 py-1 rounded-full`}>
                  {feat.tag}
                </span>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>

                {/* Bottom gradient bar on hover */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
