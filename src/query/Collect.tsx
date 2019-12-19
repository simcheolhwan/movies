import React from 'react'
import { useApp, useDatabase, useAuth } from '../api/hooks'
import useIndexedCredits from './useIndexedCredits'
import Item from './Item'
import styles from './Collect.module.scss'

const Collect = () => {
  const { hydrated } = useApp()
  const [authenticated] = useAuth()
  const [{ movie, tv }] = useDatabase()
  const { isFetched, collection, collect } = useIndexedCredits()

  /* render */
  const render = (media: MediaDB) => {
    const entries = Object.entries<Media>(media)
    return (
      <ul className={styles.list}>
        {entries.map(([id, { tmdb }], index) => {
          const credits = collection[tmdb.media_type]
          const [prevId] = entries[index - 1] ?? []
          const prevHasCredits = !!credits[prevId]
          const hasCredits = !!credits[id]
          const shouldUpdate = !index
            ? !hasCredits
            : prevHasCredits && !hasCredits

          return (
            <Item
              tmdb={tmdb}
              hasCredits={!!credits[id]}
              shouldUpdate={shouldUpdate}
              onAddCredits={collect(tmdb)}
              key={id}
            />
          )
        })}
      </ul>
    )
  }

  const isReady = authenticated && hydrated && isFetched
  const isTvCollected = Object.keys(tv).every(id => !!collection.tv[id])

  return !isReady ? null : (
    <div className={styles.component}>
      {render(tv)}
      {isTvCollected && render(movie)}
    </div>
  )
}

export default Collect
