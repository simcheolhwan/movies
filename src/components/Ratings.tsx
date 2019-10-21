import React from 'react'
import classNames from 'classnames'
import Octicon, { OcticonProps } from '@primer/octicons-react'
import { Star, Bookmark, CircleSlash } from '@primer/octicons-react'
import { Thumbsup, Thumbsdown, Check } from '@primer/octicons-react'
import { useActions } from '../api/hooks'
import styles from './Ratings.module.scss'

const Ratings = ({ tmdb, ratings = {} }: Media) => {
  const { best, forgotten, watchlist, grade } = ratings
  const { rateMedia } = useActions()

  const withWatchlist = (ratings: Ratings) =>
    Object.assign({}, ratings, typeof watchlist === 'boolean' && { watchlist })

  interface Button {
    icon: OcticonProps['icon']
    active: boolean
    activeClassName?: string
    next: Ratings
  }

  const buttons: { [action: string]: Button } = {
    best: {
      icon: Star,
      active: !!best,
      next: withWatchlist({ best: true })
    },

    increase: {
      icon: Thumbsup,
      active: grade === 1,
      next: withWatchlist({ grade: 1 })
    },

    decrease: {
      icon: Thumbsdown,
      active: grade === -1,
      next: withWatchlist({ grade: -1 })
    },

    reset: {
      icon: Check,
      active: grade === 0,
      next: withWatchlist({ grade: 0 })
    },

    forget: {
      icon: CircleSlash,
      active: !!forgotten,
      next: withWatchlist({ forgotten: true })
    },

    bookmark: {
      icon: Bookmark,
      active: !!watchlist,
      activeClassName: styles.bookmark,
      next: { ...ratings, watchlist: !watchlist }
    }
  }

  const renderButton = (button: Button) => {
    const { icon, active, activeClassName = styles.active, next } = button
    const attrs = {
      className: classNames(styles.button, active && activeClassName),
      onClick: () => rateMedia(tmdb, next)
    }

    return (
      <button {...attrs}>
        <Octicon icon={icon} />
      </button>
    )
  }

  return (
    <footer className={styles.component}>
      {renderButton(buttons.best)}

      <section className={styles.grade}>
        {renderButton(buttons.increase)}
        {renderButton(buttons.decrease)}
        {renderButton(buttons.reset)}

        <div className={styles.divider} />

        {renderButton(buttons.forget)}
        {renderButton(buttons.bookmark)}
      </section>
    </footer>
  )
}

export default Ratings
