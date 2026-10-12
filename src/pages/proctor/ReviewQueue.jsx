import { useState } from 'react'
import { Check, ClipboardCheck, Search, X } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { requests, students, attendancePercent } from '../../data/mockData.js'

export default function ReviewQueue() {
  const [search, setSearch] = useState('')
  const [remarks, setRemarks] = useState({})
  const [notice, setNotice] = useState('')
  const queue = requests.filter(r => ['submitted', 'underProctorReview'].includes(r.status) || r.status === 'pendingFinalDecision').filter(r => `${r.event} ${r.id}`.toLowerCase().includes(search.toLowerCase()))
  const student = students[0]
  function recommend(id, decision) {
    setNotice(`${id}: demo ${decision} action captured. Connect this to M2's secure backend service before using real records.`)
  }
  return <div className="page-stack">
    <PageHeader eyebrow="REVIEW & ADMIN" title="Proctor review queue" description="Review event details and attendance context before sending a recommendation." />
    {notice && <div className="notice"><ClipboardCheck size={18} /><span>{notice}</span><button className="plain-icon" onClick={() => setNotice('')} aria-label="Dismiss"><X size={16} /></button></div>}
    <div className="queue-summary"><div><span className="eyebrow">ASSIGNED TO YOU</span><strong>03</strong><small>Requests to review</small></div><div><span className="eyebrow">SAMPLE STUDENT ATTENDANCE</span><strong>{attendancePercent(student)}%</strong><small>{student.attended} of {student.conducted} sessions</small></div><div><span className="eyebrow">REVIEW REMINDER</span><strong className="queue-reminder">Check the evidence</strong><small>Verify dates, organizer, and attendance freshness.</small></div></div>
    <div className="panel"><div className="panel-heading"><div><h2>Requests requiring attention</h2><p>Demo records for UI implementation.</p></div><label className="table-search"><Search size={16} /><input placeholder="Search queue..." value={search} onChange={e => setSearch(e.target.value)} /></label></div>
      <div className="review-list">{queue.map(r => <article className="review-card" key={r.id}><div className="review-card-top"><div className="event-symbol"><ClipboardCheck size={19} /></div><div className="review-title"><strong>{r.event}</strong><span>{r.id} · {r.organizer}</span></div><StatusBadge status={r.status} /></div><div className="review-details"><div><small>Event date</small><strong>{r.date}</strong></div><div><small>Venue</small><strong>{r.venue}</strong></div><div><small>Student attendance</small><strong>{attendancePercent(student)}% <span className="muted-inline">· sample</span></strong></div></div><label className="field"><span>Proctor remarks</span><textarea rows="2" value={remarks[r.id] || ''} onChange={e => setRemarks({ ...remarks, [r.id]: e.target.value })} placeholder="Add a concise review note..." /></label><div className="review-actions"><button className="button button-quiet" onClick={() => recommend(r.id, 'return for correction')} type="button"><X size={16} /> Return for correction</button><button className="button button-primary" onClick={() => recommend(r.id, 'recommendation submitted')} type="button"><Check size={16} /> Submit recommendation</button></div></article>)}</div>
    </div>
  </div>
}