import { ArrowUpRight, CheckCircle2, Clock3, FileSpreadsheet, ShieldCheck, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import StatCard from '../../components/common/StatCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { requests, students, attendancePercent } from '../../data/mockData.js'

export default function AdminDashboard() {
  const pending = requests.filter(r => ['pendingFinalDecision', 'recommended'].includes(r.status))
  return <div className="page-stack">
    <PageHeader eyebrow="REVIEW & ADMIN" title="Administration overview" description="Monitor request decisions and attendance data quality." action={<Link to="/admin/attendance" className="button button-primary"><FileSpreadsheet size={17} /> Import attendance</Link>} />
    <section className="stat-grid">
      <StatCard label="Student records" value="128" detail="Illustrative demo total" icon={UsersRound} tone="blue" />
      <StatCard label="Pending decisions" value={String(pending.length).padStart(2, '0')} detail="Awaiting final action" icon={Clock3} tone="sand" />
      <StatCard label="Approved requests" value={String(requests.filter(r => r.status === 'approved').length).padStart(2, '0')} detail="In current demo dataset" icon={CheckCircle2} tone="green" />
      <StatCard label="Data quality flags" value={String(students.filter(s => s.freshness !== 'Current').length).padStart(2, '0')} detail="Missing or outdated samples" icon={ShieldCheck} tone="teal" />
    </section>
    <div className="content-grid admin-grid">
      <section className="panel"><div className="panel-heading"><div><h2>Final decision queue</h2><p>Requests that need administrator attention.</p></div><span className="mini-chip">{pending.length} pending</span></div>
        <div className="request-list">{pending.map(r => <div className="request-row" key={r.id}><div className="event-symbol"><FileSpreadsheet size={18} /></div><div className="request-main"><strong>{r.event}</strong><span>{r.id} · {r.date}</span></div><StatusBadge status={r.status} /><button className="row-arrow" type="button" onClick={() => window.alert('Prototype only: connect final decision to M2 secure backend service.')} aria-label="Review decision"><ArrowUpRight size={17} /></button></div>)}</div>
      </section>
      <section className="panel"><div className="panel-heading"><div><h2>Attendance data health</h2><p>Sample records requiring attention.</p></div></div>
        <div className="data-health-list">{students.map(s => <div className="health-row" key={s.id}><div className="avatar">{s.name.split(' ').map(x => x[0]).join('')}</div><div className="health-main"><strong>{s.name}</strong><small>{s.id} · {s.freshness === 'Current' ? `${attendancePercent(s)}% attendance` : s.freshness + ' data'}</small></div><span className={`health-pill ${s.freshness.toLowerCase()}`}>{s.freshness}</span></div>)}</div>
        <Link className="button button-secondary full-button" to="/admin/attendance">Manage attendance data <ArrowUpRight size={16} /></Link>
      </section>
    </div>
    <div className="notice"><ShieldCheck size={18} /><span>Approval, role permissions, audit history, and attendance eligibility must be validated by trusted backend logic—not just by these screens.</span></div>
  </div>
}