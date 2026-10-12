import { NavLink } from 'react-router-dom'
import { Activity, CalendarDays, ChartNoAxesCombined, ClipboardCheck, ClipboardList, GraduationCap, LayoutDashboard, Settings, Upload, UsersRound } from 'lucide-react'
import { useRole } from '../../context/RoleContext.jsx'

const linksByRole = {
  student: [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/requests/new', label: 'New event request', icon: CalendarDays },
    { to: '/requests', label: 'My requests', icon: ClipboardList },
  ],
  proctor: [
    { to: '/proctor/reviews', label: 'Review queue', icon: ClipboardCheck },
  ],
  admin: [
    { to: '/admin', label: 'Admin overview', icon: ChartNoAxesCombined, end: true },
    { to: '/admin/attendance', label: 'Attendance import', icon: Upload },
    { to: '/proctor/reviews', label: 'Request reviews', icon: ClipboardCheck },
  ],
}

export default function Sidebar({ mobileOpen = false, onNavigate }) {
  const { role, profile } = useRole()
  const links = linksByRole[role]
  return <>
    {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={onNavigate} />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <a className="brand" href="/" aria-label="CampusOS home">
        <span className="brand-mark"><GraduationCap size={23} /></span>
        <span>Campus<span className="brand-os">OS</span></span>
      </a>
      <div className="nav-caption">{profile.label.toUpperCase()} SPACE</div>
      <nav className="nav-list" aria-label={`${profile.label} navigation`}>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><Activity size={16} /><span>One campus.<br />One connected space.</span></div>
        <NavLink to="/settings" onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Settings size={18} /><span>Settings</span></NavLink>
        <div className="user-mini"><div className="avatar">{profile.initials}</div><div><strong>{profile.name}</strong><small>{profile.label} · Demo</small></div><span className="online-dot" /></div>
      </div>
    </aside>
  </>
}
