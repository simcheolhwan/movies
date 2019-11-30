import React, { useState, useEffect } from 'react'
import { db } from '../api/firebase'
import { getMedia, helpers } from '../api/tmdb'
import { useAuth, useDatabase, useActions } from '../api/hooks'
import styles from './Collect.module.scss'

interface EntryProps {
  tmdb: TMDB
  shouldUpdate: boolean
}

const Entry: React.FC<EntryProps> = ({ children, tmdb, shouldUpdate }) => {
  const { refreshMedia } = useActions()

  useEffect(() => {
    const update = async () => {
      try {
        const media = await getMedia(tmdb)
        refreshMedia(tmdb, media)
      } catch (error) {
        setTimeout(() => update(), 250)
      }
    }

    shouldUpdate && update()
    // eslint-disable-next-line
  }, [shouldUpdate])

  return <>{children}</>
}

const initial = { movie: {}, tv: {} }
const Collect = () => {
  const [authenticated] = useAuth()
  const [{ movie, tv }] = useDatabase()
  const [isReady, setIsReady] = useState(false)
  const [credits, setCredits] = useState<CreditsDB>(initial)

  useEffect(() => {
    db.ref('/credits').on('value', s => {
      const v: CreditsDB = s.val()
      setCredits({ ...initial, ...v })
      setIsReady(true)
    })
  }, [])

  const renderTable = (media: MediaDB) => {
    const entries = Object.entries<Media>(media)

    return (
      <table className={styles.table}>
        <tbody>
          {entries.map(([id, { tmdb }], index) => {
            const getPrevHasCredits = () => {
              const prevId = entries[index - 1][0]
              return !!credits[tmdb.media_type][prevId]
            }

            const hasCredits = !!credits[tmdb.media_type][id]
            const shouldUpdate = !index
              ? !hasCredits
              : getPrevHasCredits() && !hasCredits

            return (
              <Entry shouldUpdate={shouldUpdate} tmdb={tmdb} key={id}>
                <tr>
                  <th>{helpers.getTitle(tmdb)}</th>
                  <td>{helpers.getYear(tmdb)}</td>
                  <td>{hasCredits && '✓'}</td>
                </tr>
              </Entry>
            )
          })}
        </tbody>
      </table>
    )
  }

  const showMovie = Object.keys(tv).every(key => !!credits.tv[key])

  return !authenticated || !isReady ? null : (
    <div className={styles.container}>
      {renderTable(tv)}
      {showMovie && renderTable(movie)}
    </div>
  )
}

export default Collect
