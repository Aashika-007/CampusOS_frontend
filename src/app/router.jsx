
import { Navigate, Route, Routes } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useRole } from '../context/RoleContext.jsx'
import AppLayout from '../components/layout/AppLayout.jsx'

import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import StudentDashboard from '../pages/student/Dashboard.jsx'
import NewRequest from '../pages/student/NewRequest.jsx'
import RequestHistory from '../pages/student/RequestHistory.jsx'
import ProctorQueue from '../pages/proctor/ReviewQueue.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import AttendanceImport from '../pages/admin/AttendanceImport.jsx'
import Settings from '../pages/Settings.jsx'

function LoadingScreen() {
  return <main className="auth-page"><p>Loading CampusOS…</p></main>
}

function AccountProblem() {
  const { roleError } = useRole()

  async function handleSignOut() {
    await signOut(auth)
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Account setup needed</h1>
        <p>{roleError || 'Your account needs a valid CampusOS role.'}</p>
        <button className="auth-submit" onClick={handleSignOut}>
          Sign out
        </button>
      </section>
    </main>
  )
}

function RequireRole({ allowed, children }) {
  const { user, role, loading, roleError } = useRole()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (roleError || !role) return <AccountProblem />

  if (!allowed.includes(role)) {
    return (
      <Navigate
        to={
          role === 'student'
            ? '/'
            : role === 'proctor'
              ? '/proctor/reviews'
              : '/admin'
        }
        replace
      />
    )
  }

  return children
}

function HomeRedirect() {
  const { user, role, loading, roleError } = useRole()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (roleError || !role) return <AccountProblem />

  if (role === 'student') return <StudentDashboard />
  if (role === 'proctor') return <Navigate to="/proctor/reviews" replace />
  if (role === 'eventAdmin') return <Navigate to="/admin" replace />

  return <Navigate to="/login" replace />
}

function Workspace({ allowed, children }) {
  return (
    <RequireRole allowed={allowed}>
      <AppLayout />
    </RequireRole>
  )
}

export default function AppRouter() {
  const { user, role, loading, roleError } = useRole()

  if (loading) return <LoadingScreen />

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user && role && !roleError
            ? <Navigate to={role === 'student' ? '/' : role === 'proctor' ? '/proctor/reviews' : '/admin'} replace />
            : <Login />
        }
      />

      <Route
        path="/register"
        element={
          user && role && !roleError
            ? <Navigate to={role === 'student' ? '/' : role === 'proctor' ? '/proctor/reviews' : '/admin'} replace />
            : <Register />
        }
      />

      <Route
        path="/"
        element={
          <RequireRole allowed={['student']}>
            <AppLayout />
          </RequireRole>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="requests/new" element={<NewRequest />} />
        <Route path="requests" element={<RequestHistory />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="/proctor"
        element={
          <RequireRole allowed={['proctor']}>
            <AppLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="reviews" replace />} />
        <Route path="reviews" element={<ProctorQueue />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireRole allowed={['eventAdmin']}>
            <AppLayout />
          </RequireRole>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="attendance" element={<AttendanceImport />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="*"
        element={
          !user
            ? <Navigate to="/login" replace />
            : roleError
              ? <AccountProblem />
              : <HomeRedirect />
        }
      />
    </Routes>
  )
}
