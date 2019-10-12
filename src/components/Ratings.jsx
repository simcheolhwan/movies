import React from 'react'
import classNames from 'classnames'
import Octicon, { Star, Bookmark, CircleSlash } from '@primer/octicons-react'
import { Thumbsup, Thumbsdown, Check } from '@primer/octicons-react'
import { useActions } from '../api/hooks'
import styles from './Ratings.module.scss'

const Ratings = ({ tmdb, ratings = {} }) => {
  const { best, forgotten, watchlist = null, grade } = ratings
  const { rateMovie } = useActions()

  const buttons = {
    best: {
      icon: Star,
      active: best,
      next: { watchlist, best: true }
    },

    increase: {
      icon: Thumbsup,
      active: grade === 1,
      next: { watchlist, grade: 1 }
    },

    decrease: {
      icon: Thumbsdown,
      active: grade === -1,
      next: { watchlist, grade: -1 }
    },

    reset: {
      icon: Check,
      active: grade === 0,
      next: { watchlist, grade: 0 }
    },

    forget: {
      icon: CircleSlash,
      active: forgotten,
      next: { watchlist, forgotten: true }
    },

    bookmark: {
      icon: Bookmark,
      active: watchlist,
      activeClassName: styles.bookmark,
      next: { ...ratings, watchlist: !watchlist }
    }
  }

  const renderButton = button => {
    const { icon, active, activeClassName = styles.active, next } = button
    const attrs = {
      className: classNames(styles.button, active && activeClassName),
      onClick: () => rateMovie(tmdb.id, next)
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
