
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout.jsx'
import StudentDashboard from '../pages/student/Dashboard.jsx';
import NewRequest from '../pages/student/NewRequest.jsx';
import RequestHistory from '../pages/student/RequestHistory.jsx';
import ProctorQueue from '../pages/proctor/ReviewQueue.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AttendanceImport from '../pages/admin/AttendanceImport.jsx';
import Settings from '../Settings.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/requests/new" element={<NewRequest />} />
        <Route path="/requests" element={<RequestHistory />} />
        <Route path="/proctor/reviews" element={<ProctorQueue />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/attendance" element={<AttendanceImport />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
