import React, { useEffect } from 'react'
import classNames from 'classnames'
import { omit } from 'ramda'
import { helpers, fetchMedia, fetchCredits } from '../api/tmdb'
import { useActions } from '../api/hooks'
import styles from './Item.module.scss'

interface Props {
  tmdb: TMDB
  hasCredits: boolean
  shouldUpdate: boolean
  onAddCredits: (data: Credits) => void
}

const Item = ({ tmdb, hasCredits, shouldUpdate, onAddCredits }: Props) => {
  const { refreshMedia } = useActions()

  useEffect(() => {
    const update = async () => {
      try {
        const media = await fetchMedia(tmdb)
        const credits = await fetchCredits(tmdb)
        refreshMedia(tmdb, omit(['title', 'name'], media))
        onAddCredits(credits)
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
