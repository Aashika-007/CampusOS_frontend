import { Inbox } from 'lucide-react'
export default function EmptyState({ title = 'Nothing here yet', description = 'Items will appear here when they are available.' }) {
  return <div className="empty-state"><span><Inbox size={23} /></span><h3>{title}</h3><p>{description}</p></div>
}