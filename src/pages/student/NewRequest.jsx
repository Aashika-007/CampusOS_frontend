import { useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, FileText, Info } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'

export default function NewRequest() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ eventName: '', organizer: '', date: '', venue: '', purpose: '', url: '' })
  const [message, setMessage] = useState('')
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  function submit(e) {
    e.preventDefault()
    setMessage('Demo request validated. It has not been saved to a backend yet.')
  }
  return <div className="page-stack">
    <PageHeader eyebrow="STUDENT SPACE / REQUESTS" title="Request event participation" description="Share the details so your proctor and event administrator can review your request." action={<Link className="button button-quiet" to="/requests"><ArrowLeft size={16} /> Back to requests</Link>} />
    {message && <div className="notice success"><CheckCircle2 size={18} /><div><strong>Form looks good</strong><p>{message}</p><button className="text-link" type="button" onClick={() => navigate('/requests')}>View request history <ArrowRight size={15} /></button></div></div>}
    <form className="form-layout" onSubmit={submit}>
      <div className="panel form-panel">
        <div className="form-section-title"><span className="section-icon"><CalendarDays size={18} /></span><div><h2>Event information</h2><p>Enter accurate event details.</p></div></div>
        <div className="field-grid">
          <label className="field full"><span>Event name <b>*</b></span><input name="eventName" value={form.eventName} onChange={update} placeholder="e.g. National Hackathon 2026" required /></label>
          <label className="field"><span>Organizer <b>*</b></span><input name="organizer" value={form.organizer} onChange={update} placeholder="Organization or institution" required /></label>
          <label className="field"><span>Event date <b>*</b></span><input type="date" name="date" value={form.date} onChange={update} min={new Date().toISOString().slice(0, 10)} required /></label>
          <label className="field full"><span>Venue / participation mode <b>*</b></span><input name="venue" value={form.venue} onChange={update} placeholder="City, venue, or online" required /></label>
          <label className="field full"><span>Purpose of participation <b>*</b></span><textarea name="purpose" value={form.purpose} onChange={update} placeholder="What will you learn, present, or contribute?" rows="4" required /></label>
          <label className="field full"><span>Event website or confirmation link <small>Optional</small></span><input type="url" name="url" value={form.url} onChange={update} placeholder="https://..." /></label>
        </div>
        <div className="form-footer"><span className="required-note">* Required fields</span><div className="button-group"><Link className="button button-quiet" to="/requests">Cancel</Link><button className="button button-primary" type="submit">Validate request <ArrowRight size={16} /></button></div></div>
      </div>
      <aside className="form-aside">
        <div className="aside-card"><div className="aside-title"><Info size={18} /><h3>Before you submit</h3></div><ul><li>Double-check the event date and organizer.</li><li>Explain how the event supports your learning.</li><li>Keep organizer confirmation ready if requested.</li><li>Check attendance data is up to date.</li></ul></div>
        <div className="aside-card aside-muted"><FileText size={20} /><h3>What happens next?</h3><p>Your proctor reviews the request and adds a recommendation. The event administrator makes the final decision.</p></div>
      </aside>
    </form>
  </div>
}