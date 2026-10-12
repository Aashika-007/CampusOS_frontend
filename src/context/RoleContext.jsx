
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'

const RoleContext = createContext(null)

const demoUser = {
  uid: 'demo-student-user',
  email: 'aarav@campusos.demo',
  displayName: 'Aarav Sharma',
}

const roleProfiles = {
  student: {
    label: 'Student',
    description: 'Student workspace',
  },
  proctor: {
    label: 'Proctor',
    description: 'Proctor workspace',
  },
  eventAdmin: {
    label: 'Event Administrator',
    description: 'Administration workspace',
  },
}

const buildProfile = (roleName, name) => ({
  ...roleProfiles[roleName],
  name,
  initials: (name || 'U')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
  email: demoUser.email,
})

export function RoleProvider({ children }) {
  const [user, setUser] = useState(demoUser)
  const [role, setRole] = useState('student')
  const [profile, setProfile] = useState(buildProfile('student', 'Aarav Sharma'))
  const [loading, setLoading] = useState(false)
  const [roleError, setRoleError] = useState('')

  useEffect(() => {
    let active = true

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!active) return

      setLoading(true)
      setRoleError('')
      setUser(firebaseUser || demoUser)
      setRole(firebaseUser ? null : 'student')
      setProfile(firebaseUser ? null : buildProfile('student', 'Aarav Sharma'))

      if (!firebaseUser) {
        setLoading(false)
        return
      }

      try {
        const snapshot = await getDoc(
          doc(db, 'users', firebaseUser.uid),
        )

        if (!active) return

        if (!snapshot.exists()) {
          setRoleError(
            'Your account has no assigned CampusOS role. Contact the administrator.',
          )
          setLoading(false)
          return
        }

        const data = snapshot.data()
        const validRole = roleProfiles[data.role] ? data.role : null

        if (!validRole) {
          setRoleError(
            'Your account has an invalid role. Contact the administrator.',
          )
          setLoading(false)
          return
        }

        setRole(validRole)
        setProfile({
          ...roleProfiles[validRole],
          name: data.displayName || firebaseUser.displayName || firebaseUser.email,
          initials: (data.displayName || firebaseUser.email || 'U')
            .split(/\s+/)
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          email: firebaseUser.email,
        })
      } catch (error) {
        console.error('Failed to load CampusOS role:', error)
        if (active) {
          setRoleError(
            'Could not load your role. Check your connection and Firestore rules.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return (
    <RoleContext.Provider
      value={{ user, role, profile, loading, roleError }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used inside RoleProvider')
  }
  return context
}
