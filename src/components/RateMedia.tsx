import React from 'react'
import { useActions } from '../api/hooks'
import Ratings from './Ratings'
import styles from './RateMedia.module.scss'

const RateMedia = ({ tmdb, ratings = {} }: Media) => {
  const { best, forgotten, watchlist, grade } = ratings
  const { rateMedia } = useActions()

  const withWatchlist = (ratings: Ratings) =>
    Object.assign({}, ratings, typeof watchlist === 'boolean' && { watchlist })

  const buttons = {
    best: {
      active: !!best,
      onClick: () => rateMedia(tmdb, withWatchlist({ best: true }))
    },

    increase: {
      active: grade === 1,
      onClick: () => rateMedia(tmdb, withWatchlist({ grade: 1 }))
    },

    decrease: {
      active: grade === -1,
      onClick: () => rateMedia(tmdb, withWatchlist({ grade: -1 }))
    },

    reset: {
      active: grade === 0,
      onClick: () => rateMedia(tmdb, withWatchlist({ grade: 0 }))
    },

    forget: {
      active: !!forgotten,
      onClick: () => rateMedia(tmdb, withWatchlist({ forgotten: true }))
    },

    bookmark: {
      active: !!watchlist,
      onClick: () => rateMedia(tmdb, { ...ratings, watchlist: !watchlist })
    }
  }

  return <Ratings buttons={buttons} className={styles.ratings} />
}

export default RateMedia
