import React, { useEffect } from 'react'
import classNames from 'classnames'
import { helpers, fetchMedia, fetchCredits } from '../api/tmdb'
import { useActions } from '../api/hooks'
import styles from './Item.module.scss'

interface Props {
  tmdb: TMDB
  hasCredits: boolean
  shouldUpdate: boolean
  onFetchCredits: (data: Credits) => void
}

const Item = ({ tmdb, hasCredits, shouldUpdate, onFetchCredits }: Props) => {
  const { refreshMedia } = useActions()

  useEffect(() => {
    const update = async () => {
      try {
        const media = await fetchMedia(tmdb)
        const credits = await fetchCredits(tmdb)
        refreshMedia(tmdb, media)
        onFetchCredits(credits)
      } catch (error) {
        setTimeout(() => update(), 250)
      }
    }

    shouldUpdate && update()
    // eslint-disable-next-line
  }, [shouldUpdate])

  return (
    <li
      className={classNames(
        styles.item,
        shouldUpdate ? styles.loading : !hasCredits && styles.idle
      )}
    >
      {[
        shouldUpdate ? '…' : hasCredits ? '✓' : '✗',
        helpers.getTitle(tmdb)
      ].join(' ')}
    </li>
  )
}

export default Item
