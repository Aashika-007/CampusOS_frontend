import { useEffect, useRef, useState } from 'react'
import { Bell, Search, ChevronDown, Menu, CheckCheck, ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
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

const demoNotifications = [
  {
    id: 'request-update',
    title: 'Request update',
    message: 'Your Cloud Computing Workshop request was approved.',
    time: 'Today',
    to: '/requests',
  },
  {
    id: 'review-needed',
    title: 'Action needed',
    message: 'Add organizer confirmation to your UI/UX Design Sprint request.',
    time: 'Yesterday',
    to: '/requests',
  },
  {
    id: 'attendance',
    title: 'Attendance updated',
    message: 'Your attendance record is current: 42 of 48 sessions.',
    time: '2 days ago',
    to: '/settings',
  },
]

export default function Header({ onMenuClick }) {
  const location = useLocation()
  const { role, setRole, profile: contextProfile } = useRole()
  const profile = contextProfile || { initials: 'AS', name: 'Aarav Sharma' }
  const title = titles[location.pathname] || 'CampusOS'
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(demoNotifications)
  const notificationRef = useRef(null)
  const unreadCount = notifications.filter((notification) => !notification.read).length

  useEffect(() => {
    if (!notificationsOpen) return undefined

    function handlePointerDown(event) {
      if (!notificationRef.current?.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setNotificationsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [notificationsOpen])

  useEffect(() => {
    setNotificationsOpen(false)
  }, [location.pathname])

  function markNotificationRead(id) {
    setNotifications((current) => current.map((notification) => (
      notification.id === id ? { ...notification, read: true } : notification
    )))
  }

  function markAllNotificationsRead() {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))
  }

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
        <div className="notification-menu" ref={notificationRef}>
          <button
            className="icon-button notification-button"
            aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
            aria-expanded={notificationsOpen}
            aria-controls="notification-panel"
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
          </button>
          {notificationsOpen && (
            <section className="notification-panel" id="notification-panel" aria-label="Demo notifications">
              <div className="notification-panel-heading">
                <div>
                  <h2>Notifications</h2>
                  <p>{unreadCount ? `${unreadCount} unread updates` : 'You’re all caught up'}</p>
                </div>
                {unreadCount > 0 && (
                  <button className="notification-mark-read" type="button" onClick={markAllNotificationsRead}>
                    <CheckCheck size={15} /> Mark all read
                  </button>
                )}
              </div>
              {notifications.length ? (
                <ul className="notification-list">
                  {notifications.map((notification) => (
                    <li className={notification.read ? 'notification-item' : 'notification-item unread'} key={notification.id}>
                      <Link
                        to={notification.to}
                        onClick={() => {
                          markNotificationRead(notification.id)
                          setNotificationsOpen(false)
                        }}
                      >
                        <span className="notification-item-heading">
                          <strong>{notification.title}</strong>
                          <time>{notification.time}</time>
                        </span>
                        <span className="notification-message">{notification.message}</span>
                        <span className="notification-link">View details <ArrowUpRight size={14} /></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="notification-empty">No demo notifications yet.</p>
              )}
              <p className="notification-demo-note">Demo notifications · changes aren’t saved to a backend.</p>
            </section>
          )}
        </div>
        <label className="role-select-wrap" title="Demo role selector">
          <span className="sr-only">Switch demo role</span>
          <select className="role-select" value={role || 'student'} onChange={onRoleChange} aria-label="Switch demo role">
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
