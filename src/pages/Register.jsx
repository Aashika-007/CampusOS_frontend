
import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth'
import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase.js'

export default function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    setBusy(true)
    let createdUser = null

    try {
      // 1. Create the Firebase Authentication account
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      )

      createdUser = credential.user

      // 2. Set the user's display name
      await updateProfile(createdUser, {
        displayName: name.trim(),
      })

      // 3. Create the Firestore user document
      await setDoc(doc(db, 'users', createdUser.uid), {
        displayName: name.trim(),
        email: createdUser.email,
        role: 'student',
        createdAt: serverTimestamp(),
      })

      // 4. Sign out after successful registration
      await signOut(auth)

      // 5. Send the student to the login page
      navigate('/login', {
        replace: true,
        state: {
          message: 'Account created successfully! Please sign in.',
        },
      })
    } catch (err) {
      console.error('Registration error:', err)

      if (createdUser) {
        await signOut(auth).catch(() => {})
      }

      if (err.code === 'auth/email-already-in-use') {
        setError('An account already exists with this email.')
      } else if (err.code === 'auth/weak-password') {
        setError('Please choose a stronger password.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (err.code === 'permission-denied') {
        setError(
          'Firestore denied access. Check your Firestore security rules.',
        )
      } else {
        setError(
          'Registration failed. Check your Firebase setup and try again.',
        )
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">CampusOS</div>

        <h1>Create your account</h1>
        <p>Register as a student to access your campus workspace.</p>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="register-name">Full name</label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="register-email">College email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@college.edu"
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={6}
            placeholder="At least 6 characters"
            required
          />

          <button
            className="auth-submit"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Creating account...' : 'Create student account'}
          </button>
        </form>

        <p className="auth-bottom">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  )
}
