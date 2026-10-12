import { Bell, Search, ChevronDown, Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useRole } from '../../context/RoleContext.jsx'

const titles = {
  '/': 'Student overview',
  '/requests/new': 'New event request',
  '/requests': 'My requests',
  '/proctor/reviews': 'Proctor review queue',
  '/admin': 'Admin overview',
  '/admin/attendance': 'Attendance import',
  '/settings': 'Settings',
}

export default function Header({ onMenuClick }) {
  const location = useLocation()
  const { role, setRole, profile = { initials: 'AS', name: 'Aarav Sharma' } } = useRole()
  const title = titles[location.pathname] || 'CampusOS'
  const onRoleChange = (event) => {
    const nextRole = event.target.value
    setRole(nextRole)
    const routes = { student: '/', proctor: '/proctor/reviews', admin: '/admin' }
    window.history.replaceState(null, '', routes[nextRole])
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <header className="topbar">
      <div className="topbar-leading">
        <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={onMenuClick} type="button"><Menu size={20} /></button>
        <div className="breadcrumb"><span>CampusOS</span><span className="crumb-slash">/</span><strong>{title}</strong></div>
      </div>
      <div className="topbar-actions">
        <label className="search-box"><Search size={17} /><input placeholder="Search this workspace..." aria-label="Search this workspace" /></label>
        <button className="icon-button notification-button" aria-label="Notifications" type="button"><Bell size={18} /><i /></button>
        <label className="role-select-wrap" title="Demo role selector">
          <span className="sr-only">Switch demo role</span>
          <select className="role-select" value={role} onChange={onRoleChange} aria-label="Switch demo role">
            <option value="student">Student demo</option>
            <option value="proctor">Proctor demo</option>
            <option value="admin">Admin demo</option>
          </select>
          <ChevronDown size={14} />
        </label>
        <button className="profile-button" type="button"><span className="avatar">{profile.initials}</span><span className="profile-name">{profile.name}</span><ChevronDown size={15} /></button>
      </div>
    </header>
  )
}
