import React from 'react'
import { useApp, useAuth, FilterProvider } from '../api/hooks'
import { useFilterReducer, useURLParams } from '../data/hooks'
import Search from './Search'
import Genres from './Genres'
import Filter from './Filter'
import List from './List'
import styles from './MediaList.module.scss'

const Component = () => {
  const { hydrated } = useApp()
  const [authenticated] = useAuth()
  const value = useFilterReducer()

  return !value.count && !hydrated ? (
    <div className={styles.loading}>Loading...</div>
  ) : (
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

const MediaList = () => {
  const { genre = '', watched_at = 0 } = useURLParams()
  return <Component key={genre + watched_at} />
}

export default MediaList
