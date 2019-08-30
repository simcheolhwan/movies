import React, { useState, useEffect, createContext } from 'react'
import { db } from '../api/firebase'
import Search from './Search'
import Movies from './Movies'

export const AppContext = createContext()
const App = () => {
  const [data, setData] = useState()

  useEffect(() => {
    db.ref('/').on('value', s => setData(s.val()))
  }, [])

  return !data ? null : (
    <AppContext.Provider value={data}>
      <Search />
      <Movies />
    </AppContext.Provider>
  )
}

export default App
