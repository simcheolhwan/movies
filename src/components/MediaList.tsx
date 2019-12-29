import React from 'react'
import { useAuth, FilterProvider } from '../api/hooks'
import { useFilterReducer } from '../data/hooks'
import Search from './Search'
import Genres from './Genres'
import Filter from './Filter'
import List from './List'
import styles from './MediaList.module.scss'

const MediaList = () => {
  const [authenticated] = useAuth()
  const value = useFilterReducer()

  return (
    <FilterProvider value={value}>
      {authenticated && <Search />}

      <section className={styles.content}>
        <nav>
          <Genres />
        </nav>

        <main>
          <Filter />
          <List />
        </main>
      </section>
    </FilterProvider>
  )
}

export default MediaList
