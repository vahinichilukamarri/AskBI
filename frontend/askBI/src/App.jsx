import { useState } from 'react'
import LandingPage from './components/LandingPage'
import DashboardPage from './components/DashboardPage'

function App() {
  const [page, setPage] = useState('landing')

  return page === 'landing'
    ? <LandingPage onNavigate={() => setPage('dashboard')} />
    : <DashboardPage onHome={() => setPage('landing')} />
}

export default App