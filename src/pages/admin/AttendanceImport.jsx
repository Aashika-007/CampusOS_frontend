import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, UploadCloud } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader.jsx'
import { students, attendancePercent } from '../../data/mockData.js'

export default function AttendanceImport() {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  function readFile(file) {
    setError('')
    setRows([])
    if (!file) return
    if (!/\.(csv|txt)$/i.test(file.name)) {
      setError('This starter preview accepts CSV files only. Add a reviewed XLSX parser (such as SheetJS) for Excel files.')
      setFileName('')
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      const parsed = text.trim().split(/\r?\n/).map(line => line.split(',').map(cell => cell.trim()))
      if (parsed.length < 2) { setError('The file needs a header row and at least one data row.'); return }
      const headers = parsed[0].map(h => h.toLowerCase())
      const required = ['studentid', 'attended', 'conducted']
      const indexes = required.map(key => headers.indexOf(key))
      if (indexes.some(i => i < 0)) { setError('Required CSV columns: studentId, attended, conducted.'); return }
      const result = parsed.slice(1).filter(row => row.some(Boolean)).map((row, i) => {
        const attended = Number(row[indexes[1]])
        const conducted = Number(row[indexes[2]])
        const valid = row[indexes[0]] && Number.isFinite(attended) && Number.isFinite(conducted) && conducted > 0 && attended >= 0 && attended <= conducted
        return { id: row[indexes[0]] || `row-${i + 2}`, attended, conducted, valid }
      })
      setRows(result)
      if (!result.length) setError('No data rows were found.')
    }
    reader.onerror = () => setError('Could not read this file.')
    reader.readAsText(file)
  }
  return <div className="page-stack">
    <PageHeader eyebrow="REVIEW & ADMIN" title="Attendance import" description="Preview attendance records and validate data before handing them to the trusted import service." />
    <div className="notice"><AlertCircle size={18} /><span>This is a frontend CSV preview only. It does not write records to a database or calculate official eligibility.</span></div>
    <section className="panel import-panel">
      <div className="import-icon"><FileSpreadsheet size={25} /></div><h2>Upload attendance file</h2><p>Start with a CSV containing studentId, attended, and conducted columns.</p>
      <div className="dropzone" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); readFile(e.dataTransfer.files?.[0]) }}>
        <UploadCloud size={29} /><strong>Drop your CSV file here</strong><span>or choose a file from your computer</span>
        <button type="button" className="button button-primary" onClick={() => inputRef.current?.click()}>Choose CSV file</button>
        <input ref={inputRef} type="file" accept=".csv,.txt" hidden onChange={e => readFile(e.target.files?.[0])} />
      </div>
      {fileName && <div className="file-selected"><FileSpreadsheet size={18} /><span>{fileName}</span><CheckCircle2 size={17} /></div>}
      {error && <div className="notice error"><AlertCircle size={18} /><span>{error}</span></div>}
      {rows.length > 0 && <><div className="preview-heading"><div><h3>Import preview</h3><p>{rows.filter(r => r.valid).length} valid · {rows.filter(r => !r.valid).length} invalid</p></div><span className="mini-chip">Preview only</span></div><div className="table-scroll"><table><thead><tr><th>Student ID</th><th>Attended</th><th>Conducted</th><th>Calculated %</th><th>Validation</th></tr></thead><tbody>{rows.map((r, i) => <tr key={`${r.id}-${i}`}><td>{r.id}</td><td>{Number.isFinite(r.attended) ? r.attended : '—'}</td><td>{Number.isFinite(r.conducted) ? r.conducted : '—'}</td><td>{r.valid ? `${Math.round(r.attended / r.conducted * 100)}%` : '—'}</td><td><span className={`health-pill ${r.valid ? 'current' : 'missing'}`}>{r.valid ? 'Valid' : 'Invalid'}</span></td></tr>)}</tbody></table></div></>}
    </section>
    <section className="panel"><div className="panel-heading"><div><h2>Sample data quality preview</h2><p>Example records already in the demo.</p></div><button className="button button-secondary" onClick={() => { const blob = new Blob(['studentId,attended,conducted\\nSTU-1024,42,48\\nSTU-1038,31,40\\nSTU-1091,18,36\\nSTU-1102,0,0\\n'], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'campusos-attendance-template.csv'; a.click(); URL.revokeObjectURL(url) }} type="button"><Download size={16} /> Download template</button></div><div className="table-scroll"><table><thead><tr><th>Student</th><th>ID</th><th>Attendance</th><th>Data freshness</th></tr></thead><tbody>{students.map(s => <tr key={s.id}><td><strong>{s.name}</strong><small>{s.program}</small></td><td>{s.id}</td><td>{attendancePercent(s) === null ? 'Not calculable' : `${attendancePercent(s)}%`}</td><td><span className={`health-pill ${s.freshness.toLowerCase()}`}>{s.freshness}</span></td></tr>)}</tbody></table></div></section>
  </div>
}