import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { equals } from 'ramda'
import { auth, db } from '../api/firebase'
import { AppProvider, AuthProvider, DatabaseProvider } from '../api/hooks'
import routes from '../routes'

const initial: Database = [
  { movie: {}, tv: {} },
  { watched_at: [], genre: [] }
]

const App = () => {
  const [hydrated, setHydrated] = useState(false)

  const [database, setDatabase] = useState(() => {
    const local = localStorage.getItem('db')
    return local ? JSON.parse(local) : initial
  })

  const [authenticated, setAuthenticated] = useState(
    () => !!localStorage.getItem('authenticated')
  )

  useEffect(() => {
    const hydrate = () => {
      auth.onAuthStateChanged(user => {
        setAuthenticated(!!user)
        user
          ? localStorage.setItem('authenticated', 'true')
          : localStorage.removeItem('authenticated')
      })

      db.ref().on('value', s => {
        const v: DB = s.val()
        const normalized = normalize(v)
        localStorage.setItem('db', JSON.stringify(normalized))
        !equals(normalized, database) && setDatabase(normalized)
        setHydrated(true)
      })
    }

    !hydrated && hydrate()
  }, [hydrated, database])

  return (
    <Router>
      <AuthProvider value={[authenticated, setAuthenticated]}>
        <AppProvider value={{ hydrated }}>
          <DatabaseProvider value={database}>
            <DndProvider backend={HTML5Backend}>{routes}</DndProvider>
          </DatabaseProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

/* helper */
const normalize = ({ indexes, ...media }: DB): Database => [
  { ...initial[0], ...media },
  { ...initial[1], ...indexes }
]
