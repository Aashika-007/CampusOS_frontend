
import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { auth } from '../firebase.js'
import { useRole } from '../context/RoleContext.jsx'

export default function Login() {
  const { user, role, loading, roleError } = useRole()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && user && role) {
    return <Navigate to={homeFor(role)} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      )
      // RoleContext will load the role and redirect automatically.
    } catch (err) {
      console.error(err)
      setError(
        err.code === 'auth/invalid-credential'
          ? 'Email or password is incorrect.'
          : err.code === 'auth/too-many-requests'
            ? 'Too many attempts. Please try again later.'
            : 'Unable to sign in. Check your details and try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  async function handleSignOut() {
    await signOut(auth)
    setError('')
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">CampusOS</div>
        <h1>Welcome back</h1>
        <p>Sign in to open your CampusOS workspace.</p>

        {roleError && user && (
          <div className="auth-error" role="alert">
            {roleError}
            <button type="button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        )}

        {location.state?.message && (
          <p className="auth-success">{location.state.message}</p>
        )}

        {error && <p className="auth-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">College email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@college.edu"
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-bottom">
          New student? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  )
}

export function homeFor(role) {
  if (role === 'student') return '/'
  if (role === 'proctor') return '/proctor/reviews'
  if (role === 'eventAdmin') return '/admin'
  return '/login'
}
