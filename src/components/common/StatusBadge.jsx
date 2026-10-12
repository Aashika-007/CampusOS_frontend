import { statusLabels } from '../../data/mockData.js'

export default function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{statusLabels[status] || status}</span>
}