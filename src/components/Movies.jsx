import React, { useState } from 'react'
import classNames from 'classnames'
import { useApp } from '../api/hooks'
import Movie from './Movie'
import styles from './Movies.module.scss'

const Movies = () => {
  const [selectedYear, setSelectedYear] = useState()
  const { indexes, movies } = useApp()

  /* render */
  const entries = Object.entries(movies)
  const filtered = entries.filter(
    ([, value]) => !selectedYear || value.watched_at === selectedYear
  )

  return !entries.length ? null : (
    <>
      <section className={styles.tabs}>
        {indexes.watched_at.map(year => {
          const isSelected = year === selectedYear
          const attrs = {
            className: classNames(styles.tab, isSelected && styles.active),
            onClick: () => setSelectedYear(isSelected ? undefined : year)
          }

          return (
            <button {...attrs} key={year}>
              {year}
            </button>
          )
        })}
      </section>

      {!filtered.length ? (
        <p>Empty</p>
      ) : (
        <ul className={styles.grid}>
          {filtered.map(([key, value]) => (
            <li className={styles.item} key={key}>
              <Movie {...value} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default Movies
