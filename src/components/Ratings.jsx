import React from 'react'
import classNames from 'classnames'
import Octicon, { Star } from '@primer/octicons-react'
import { Thumbsup, Thumbsdown, Check } from '@primer/octicons-react'
import { useActions } from '../api/hooks'
import styles from './Ratings.module.scss'

const Ratings = ({ tmdb, ratings = {} }) => {
  const { best, grade } = ratings
  const { rateMovie } = useActions()

  const attrs = {
    best: {
      className: classNames(styles.button, best && styles.active),
      children: <Octicon icon={Star} />,
      onClick: () => !best && rateMovie(tmdb.id, { best: true })
    },

    increase: {
      className: classNames(styles.button, grade === 1 && styles.active),
      children: <Octicon icon={Thumbsup} />,
      onClick: () => grade !== 1 && rateMovie(tmdb.id, { grade: 1 })
    },

    decrease: {
      className: classNames(styles.button, grade === -1 && styles.active),
      children: <Octicon icon={Thumbsdown} />,
      onClick: () => grade !== -1 && rateMovie(tmdb.id, { grade: -1 })
    },

    reset: {
      className: classNames(styles.button, grade === 0 && styles.active),
      children: <Octicon icon={Check} />,
      onClick: () => grade !== 0 && rateMovie(tmdb.id, { grade: 0 })
    }
  }

  return (
    <footer className={styles.component}>
      <button {...attrs.best} />

      <section className={styles.grade}>
        <button {...attrs.increase} />
        <button {...attrs.decrease} />
        <button {...attrs.reset} />
      </section>
    </footer>
  )
}

export default Ratings
