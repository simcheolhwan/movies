import React, { useState, useEffect, createContext } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { auth, db } from '../api/firebase'
import SignIn from './SignIn'
import SignOut from './SignOut'
import Search from './Search'
import Movies from './Movies'

export const AppContext = createContext()
const App = () => {
  const [initiated, setInitiated] = useState(false)
  const [data, setData] = useState()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const db = localStorage.getItem('db')
    db && setData(JSON.parse(db))
    setInitiated(true)
  }, [])

  useEffect(() => {
    const connect = () => {
      auth.onAuthStateChanged(user => setAuthenticated(!!user))

      db.ref('/').on('value', s => {
        const data = s.val()
        localStorage.setItem('db', JSON.stringify(data))
        setData(init(data))
      })
    }

    initiated && connect()
  }, [initiated])

  return data === undefined ? null : (
    <Router>
      <AppContext.Provider value={{ ...data, authenticated, setAuthenticated }}>
        {authenticated && <Search />}
        <DndProvider backend={HTML5Backend}>
          <Switch>
            <Route path="/signin" component={SignIn} />
            <Route path="/signout" component={SignOut} />
            <Route path="/:genre" component={Movies} />
            <Route path="/" component={Movies} />
          </Switch>
        </DndProvider>
      </AppContext.Provider>
    </Router>
  )
}

export default App

/* helper */
const init = v => {
  const initial = { indexes: { watched_at: [], genre: [] }, movies: {} }
  return v ? { ...v, indexes: { ...initial.indexes, ...v.indexes } } : initial
}
