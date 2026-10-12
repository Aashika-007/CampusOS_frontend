import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, Plus, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import StatCard from '../../components/common/StatCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { attendancePercent, requests, students } from '../../data/mockData.js'

export default function Dashboard() {
  const student = students[0]
  const percent = attendancePercent(student)
  return <div className="page-stack">
    <PageHeader eyebrow="MONDAY, OCTOBER 12, 2026" title="Your campus, at a glance." description="Keep track of your attendance and technical event participation in one place."
      action={<Link className="button button-primary" to="/requests/new"><Plus size={17} /> New request</Link>} />
    <section className="welcome-banner">
      <div><span className="welcome-kicker">WELCOME BACK</span><h2>Ready to make something happen, Aarav?</h2><p>Your next opportunity might be one request away.</p></div>
      <div className="banner-orbit orbit-one" /><div className="banner-orbit orbit-two" /><div className="banner-icon"><GraduationCapFallback /></div>
    </section>
    <section className="stat-grid">
      <StatCard label="Total requests" value="04" detail="Across this semester" icon={CalendarDays} tone="teal" />
      <StatCard label="Approved" value="01" detail="Ready to participate" icon={CheckCircle2} tone="green" />
      <StatCard label="Awaiting decision" value="01" detail="With event administrator" icon={Clock3} tone="blue" />
      <StatCard label="Attendance" value={`${percent}%`} detail="Current record · 42 of 48" icon={ShieldCheck} tone="sand" />
    </section>
    <section className="content-grid">
      <div className="panel">
        <div className="panel-heading"><div><h2>Recent event requests</h2><p>Follow the progress of your submissions.</p></div><Link className="text-link" to="/requests">View all <ArrowUpRight size={15} /></Link></div>
        <div className="request-list">{requests.slice(0, 3).map((request) => <div className="request-row" key={request.id}>
          <div className="event-symbol"><CalendarDays size={19} /></div><div className="request-main"><strong>{request.event}</strong><span>{request.id} · {request.date}</span></div><StatusBadge status={request.status} /><Link className="row-arrow" to="/requests" aria-label={`View ${request.event}`}><ArrowUpRight size={17} /></Link>
        </div>)}</div>
      </div>
      <div className="panel attendance-panel">
        <div className="panel-heading"><div><h2>Attendance snapshot</h2><p>Eligibility overview</p></div><span className="mini-chip">Current</span></div>
        <div className="attendance-number">{percent}<span>%</span></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
        <div className="progress-meta"><span>42 attended</span><span>48 conducted</span></div>
        <div className="threshold-note"><ShieldCheck size={17} /><span>Illustrative threshold: <strong>75%</strong>. Confirm the official threshold with your team.</span></div>
      </div>
    </section>
    <section className="tip-strip"><div className="tip-icon"><ShieldCheck size={18} /></div><div><strong>Keep your request details complete</strong><p>Include the organizer, event date, purpose, and supporting confirmation to help reviewers process your request.</p></div><Link to="/requests/new" className="text-link">Start a request <ArrowUpRight size={15} /></Link></section>
  </div>
}
function GraduationCapFallback() { return <span className="banner-monogram">C<span>O</span></span> }