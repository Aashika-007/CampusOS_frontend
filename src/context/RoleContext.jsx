import { createContext, useContext, useMemo, useState } from 'react'

const RoleContext = createContext(null)

const roleProfiles = {
  student: { label: 'Student', name: 'Aarav Sharma', initials: 'AS', description: 'Student workspace' },
  proctor: { label: 'Proctor', name: 'Dr. Meera Rao', initials: 'MR', description: 'Proctor workspace' },
  admin: { label: 'Administrator', name: 'Campus Administrator', initials: 'CA', description: 'Administration workspace' },
}

export function RoleProvider({ children }) {
  const [role, setRole] = useState('student')
  const value = useMemo(() => ({ role, setRole, profile: roleProfiles[role] }), [role])
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) throw new Error('useRole must be used inside RoleProvider')
  return context
}
