import { useMemo, useState } from 'react'
import { ArrowUpRight, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { requests } from '../../data/mockData.js'

const filters = ['All', 'Pending', 'Approved', 'Rejected', 'Needs correction']
const matches = { Pending: ['submitted', 'underProctorReview', 'recommended', 'pendingFinalDecision'], Approved: ['approved'], Rejected: ['rejected'], 'Needs correction': ['returnedForCorrection'] }

export default function RequestHistory() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const visible = useMemo(() => requests.filter(r => (filter === 'All' || matches[filter]?.includes(r.status)) && `${r.event} ${r.id} ${r.organizer}`.toLowerCase().includes(search.toLowerCase())), [filter, search])
  return <div className="page-stack">
    <PageHeader eyebrow="STUDENT SPACE" title="My event requests" description="A single view of your submissions, reviewer notes, and final decisions." action={<Link className="button button-primary" to="/requests/new"><Plus size={17} /> New request</Link>} />
    <div className="panel">
      <div className="toolbar"><div className="filter-tabs">{filters.map(f => <button key={f} className={`filter-tab ${filter === f ? 'selected' : ''}`} onClick={() => setFilter(f)} type="button">{f}</button>)}</div><label className="table-search"><Search size={16} /><input placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} /></label></div>
      {visible.length ? <div className="table-scroll"><table><thead><tr><th>Event</th><th>Event date</th><th>Proctor</th><th>Status</th><th>Reviewer note</th><th /></tr></thead><tbody>{visible.map(r => <tr key={r.id}><td><strong>{r.event}</strong><small>{r.id} · {r.organizer}</small></td><td>{r.date}</td><td>{r.proctor}</td><td><StatusBadge status={r.status} /></td><td className="remarks-cell">{r.remarks}</td><td><button className="row-arrow" type="button" title="Demo details"><ArrowUpRight size={17} /></button></td></tr>)}</tbody></table></div> : <EmptyState title="No matching requests" description="Try another filter or search term." />}
    </div>
    <p className="prototype-note">Prototype data only. Request changes are not persisted between refreshes.</p>
  </div>
}