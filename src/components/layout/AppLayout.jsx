import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      <div className="main-column">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="page-content"><Outlet /></main>
        <footer className="footer">CampusOS <span>·</span> Frontend prototype</footer>
      </div>
    </div>
  )
}
