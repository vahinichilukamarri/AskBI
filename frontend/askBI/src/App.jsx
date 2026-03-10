import { useState } from 'react'
import LandingPage from './components/LandingPage'
import DashboardPage from './components/DashboardPage'
import FeaturesPage from './components/Features'
import ContactPage from './components/ContactUs'
import AboutPage from './components/About'

function App() {
  const [page, setPage] = useState(
    () => sessionStorage.getItem('currentPage') || 'landing'
  )

  const navigate = (to) => {
    sessionStorage.setItem('currentPage', to)
    setPage(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (page === 'landing')   return <LandingPage   onNavigate={navigate} />
  if (page === 'dashboard') return <DashboardPage onNavigate={navigate} onHome={() => navigate('landing')} />
  if (page === 'features')  return <FeaturesPage  onNavigate={navigate} />
  if (page === 'contact')   return <ContactPage   onNavigate={navigate} />
  if (page === 'about')     return <AboutPage     onNavigate={navigate} />

  return <LandingPage onNavigate={navigate} />
}

export default App