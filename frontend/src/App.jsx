import { useState, useEffect } from 'react'
import { getAllSessions, getSummary } from './api/client'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import LiveCamera from './pages/LiveCamera'
import Members from './pages/Members'
import Attendance from './pages/Attendance'
import AnalyticsPage from './pages/AnalyticsPage'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

const BREADCRUMBS = {
  dashboard: 'nexus / dashboard',
  live: 'nexus / live-camera',
  members: 'nexus / members',
  attendance: 'nexus / attendance',
  analytics: 'nexus / analytics',
  reports: 'nexus / reports',
  settings: 'nexus / settings',
}

function App() {
  const [page, setPage] = useState('dashboard')
  const [sessions, setSessions] = useState([])
  const [summary, setSummary] = useState({ leaderboard: [] })
  const [systemOnline, setSystemOnline] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, sum] = await Promise.all([getAllSessions(), getSummary()])
        setSessions(s)
        setSummary(sum)
        setSystemOnline(true)
      } catch (err) {
        console.error('Failed to load data from API:', err)
        setSystemOnline(false)
      }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex bg-black min-h-screen text-gray-100">
      <Sidebar active={page} onNavigate={setPage} systemOnline={systemOnline} />

      <div className="flex-1">
        <Topbar breadcrumb={BREADCRUMBS[page]} />

        {page === 'dashboard' && <Dashboard sessions={sessions} summary={summary} onNavigate={setPage} />}
        {page === 'live' && <LiveCamera />}
        {page === 'members' && <Members />}
        {page === 'attendance' && <Attendance sessions={sessions} />}
        {page === 'analytics' && <AnalyticsPage sessions={sessions} summary={summary} />}
        {page === 'reports' && <Reports sessions={sessions} />}
        {page === 'settings' && <Settings />}
      </div>
    </div>
  )
}

export default App
