import { Navigate, Route, Routes } from 'react-router-dom'
import { useRole } from '../context/RoleContext.jsx'
import AppLayout from '../components/layout/AppLayout.jsx'

import StudentDashboard from '../pages/student/Dashboard.jsx'
import NewRequest from '../pages/student/NewRequest.jsx'
import RequestHistory from '../pages/student/RequestHistory.jsx'
import ProctorQueue from '../pages/proctor/ReviewQueue.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import AttendanceImport from '../pages/admin/AttendanceImport.jsx'
import Settings from '../pages/Settings.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'

function RoleRoute({ allowed, children }) {
  const { role, loading, user } = useRole()

  if (loading) return <p>Loading CampusOS...</p>

  if (!user) return <Navigate to="/login" replace />

  if (!role) return <p>Your account has no valid assigned role. Please contact the administrator.</p>

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
  const { user, role, loading } = useRole()

  if (loading) return <p>Loading CampusOS...</p>

  if (!user) return <Navigate to="/login" replace />

  if (role === 'student') return <Navigate to="/" replace />
  if (role === 'proctor') return <Navigate to="/proctor/reviews" replace />
  if (role === 'eventAdmin') return <Navigate to="/admin" replace />

  return <p>Your account role could not be loaded. Please contact the administrator.</p>
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <RoleRoute allowed={['student']}>
              <StudentDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/requests/new"
          element={
            <RoleRoute allowed={['student']}>
              <NewRequest />
            </RoleRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <RoleRoute allowed={['student']}>
              <RequestHistory />
            </RoleRoute>
          }
        />

        <Route
          path="/proctor/reviews"
          element={
            <RoleRoute allowed={['proctor', 'eventAdmin']}>
              <ProctorQueue />
            </RoleRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute allowed={['eventAdmin']}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/attendance"
          element={
            <RoleRoute allowed={['eventAdmin']}>
              <AttendanceImport />
            </RoleRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <RoleRoute allowed={['student', 'proctor', 'eventAdmin']}>
              <Settings />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="/home" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}