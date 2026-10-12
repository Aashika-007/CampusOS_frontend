import { AlertCircle, CheckCircle2, Inbox, LoaderCircle } from 'lucide-react'

export function LoadingState({ title = 'Loading your workspace', message = 'Please wait while we fetch the latest information.' }) {
  return <div className="state-panel" role="status" aria-live="polite">
    <span className="state-icon loading-icon"><LoaderCircle size={23} /></span>
    <h3>{title}</h3><p>{message}</p>
  </div>
}

export function ErrorState({ title = 'Something went wrong', message = 'We could not load this information. Please try again.', onRetry }) {
  return <div className="state-panel" role="alert">
    <span className="state-icon error-icon"><AlertCircle size={23} /></span>
    <h3>{title}</h3><p>{message}</p>
    {onRetry && <button className="button button-secondary" onClick={onRetry} type="button">Try again</button>}
  </div>
}

export function EmptyState({ title = 'Nothing here yet', message = 'When there is something to show, it will appear here.', actionLabel, onAction }) {
  return <div className="state-panel">
    <span className="state-icon empty-icon"><Inbox size={23} /></span>
    <h3>{title}</h3><p>{message}</p>
    {actionLabel && onAction && <button className="button button-primary" onClick={onAction} type="button">{actionLabel}</button>}
  </div>
}

export function SuccessState({ title = 'Changes saved', message = 'Your changes have been saved successfully.' }) {
  return <div className="state-inline success-state" role="status"><CheckCircle2 size={18} /><span><strong>{title}</strong> {message}</span></div>
}
