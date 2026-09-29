import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/**
 * PageLayout — wraps every inner page with Navbar + main padding + Footer.
 * Pass `noPadding` to skip the top padding (e.g. full-bleed hero sections).
 */
export default function PageLayout({ children, noPadding = false }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 flex flex-col">
      <Navbar />
      <main className={`flex-1 ${noPadding ? '' : 'pt-20'}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
