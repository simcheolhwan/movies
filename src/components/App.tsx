import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { auth, db } from '../api/firebase'
import { AuthProvider, DatabaseProvider } from '../api/hooks'
import MediaList from './MediaList'
import SignIn from './SignIn'
import SignOut from './SignOut'

const initial: Database = [{ movie: {}, tv: {} }, { watched_at: [], genre: [] }]

const App = () => {
  const [initiated, setInitiated] = useState(false)
  const [database, setDatabase] = useState(initial)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const init = (local: string) => {
      const parsed: Database = JSON.parse(local)
      setDatabase(parsed)
    }

    const local = localStorage.getItem('db')
    local && init(local)
    setInitiated(true)
  }, [])

  useEffect(() => {
    const connect = () => {
      auth.onAuthStateChanged(user => setAuthenticated(!!user))

      db.ref('/').on('value', s => {
        const v: DB = s.val()
        const normalized = normalize(v)
        localStorage.setItem('db', JSON.stringify(normalized))
        setDatabase(normalized)
      })
    }

    initiated && connect()
  }, [initiated])

  return (
    <Router>
      <AuthProvider value={[authenticated, setAuthenticated]}>
        <DatabaseProvider value={database}>
          <Switch>
            <Route path="/signin" component={SignIn} />
            <Route path="/signout" component={SignOut} />
            <Route path="/:genre" component={MediaList} />
            <Route path="/" component={MediaList} />
          </Switch>
        </DatabaseProvider>
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
