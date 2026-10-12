import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AppLayout from './components/layout/AppLayout.jsx'
import StudentDashboard from './pages/student/Dashboard.jsx'
import NewRequest from './pages/student/NewRequest.jsx'
import RequestHistory from './pages/student/RequestHistory.jsx'
import ProctorQueue from './pages/proctor/ReviewQueue.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AttendanceImport from './pages/admin/AttendanceImport.jsx'
import Settings from './pages/Settings.jsx'
import { useRole } from './context/RoleContext.jsx'

function RoleRoute({ allowed, children }) {
  const { role } = useRole()
  return allowed.includes(role) ? children : <Navigate to={role === 'student' ? '/' : role === 'proctor' ? '/proctor/reviews' : '/admin'} replace />
}

function RoleHomeRedirect() {
  const { role } = useRole()
  return <Navigate to={role === 'student' ? '/' : role === 'proctor' ? '/proctor/reviews' : '/admin'} replace />
}

export default function App() {
  const { role } = useRole()
  const location = useLocation()

  useEffect(() => {
    // Keep the URL on a page available to the selected demo role.
    const studentPaths = ['/', '/requests/new', '/requests', '/settings']
    const proctorPaths = ['/proctor/reviews', '/settings']
    const adminPaths = ['/admin', '/admin/attendance', '/proctor/reviews', '/settings']
    const allowed = role === 'student' ? studentPaths : role === 'proctor' ? proctorPaths : adminPaths
    if (!allowed.includes(location.pathname)) {
      const home = role === 'student' ? '/' : role === 'proctor' ? '/proctor/reviews' : '/admin'
      window.history.replaceState(null, '', home)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [role, location.pathname])

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<RoleRoute allowed={['student']}><StudentDashboard /></RoleRoute>} />
        <Route path="/requests/new" element={<RoleRoute allowed={['student']}><NewRequest /></RoleRoute>} />
        <Route path="/requests" element={<RoleRoute allowed={['student']}><RequestHistory /></RoleRoute>} />
        <Route path="/proctor/reviews" element={<RoleRoute allowed={['proctor', 'admin']}><ProctorQueue /></RoleRoute>} />
        <Route path="/admin" element={<RoleRoute allowed={['admin']}><AdminDashboard /></RoleRoute>} />
        <Route path="/admin/attendance" element={<RoleRoute allowed={['admin']}><AttendanceImport /></RoleRoute>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<RoleHomeRedirect />} />
      </Route>
    </Routes>
  )
}
