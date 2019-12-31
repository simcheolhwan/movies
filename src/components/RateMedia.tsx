import React from 'react'
import { useActions } from '../api/hooks'
import Ratings from './Ratings'
import styles from './RateMedia.module.scss'

const RateMedia = ({ tmdb, best }: Media) => {
  const { rateMedia } = useActions()
  return (
    <Ratings
      active={!!best}
      onClick={() => rateMedia(tmdb, best ? null : true)}
      className={styles.ratings}
    />
  )
}

export default RateMedia
