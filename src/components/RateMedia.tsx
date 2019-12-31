import React from 'react'
import { useActions } from '../api/hooks'
import Ratings from './Ratings'
import styles from './RateMedia.module.scss'

const RateMedia = ({ tmdb, ratings = {} }: Media) => {
  const { best, good, quality } = ratings
  const { rateMedia } = useActions()

  const withQuality = (ratings: Ratings) =>
    Object.assign({}, ratings, typeof quality === 'boolean' && { quality })

  const buttons = {
    best: {
      active: !!best,
      onClick: () => rateMedia(tmdb, withQuality({ best: true }))
    },

    good: {
      active: !!good,
      onClick: () => rateMedia(tmdb, withQuality({ good: true }))
    },

    reset: {
      active: !best && !good,
      onClick: () =>
        rateMedia(tmdb, withQuality({ best: null, good: null }))
    },

    quality: {
      active: !!quality,
      onClick: () =>
        rateMedia(tmdb, { ...ratings, quality: quality ? null : true })
    }
  }

  return <Ratings buttons={buttons} className={styles.ratings} />
}

export default RateMedia
