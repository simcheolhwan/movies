import React, { useState } from 'react'
import classNames from 'classnames'
import { useApp } from '../api/hooks'
import Genres from './Genres'
import Movie from './Movie'
import styles from './Movies.module.scss'

const Movies = ({ match }) => {
  const selectedGenre = match.params.genre || ''
  const [selectedYear, setSelectedYear] = useState()
  const { indexes, movies } = useApp()

  /* render */
  const isFront = !selectedGenre && !selectedYear

  const entries = Object.entries(movies)
  const filtered = entries.filter(
    ([, { watched_at, genre }]) =>
      (!selectedYear || watched_at === selectedYear) &&
      (!selectedGenre || (genre || 'inbox') === selectedGenre)
  )

  const sorted = filtered.sort(([, { tmdb: tmdbA }], [, { tmdb: tmdbB }]) => {
    const { release_date: a } = tmdbA
    const { release_date: b } = tmdbB
    return a > b ? -1 : a < b ? 1 : 0
  })

  const list = fn => (
    <ul className={styles.grid}>
      {sorted
        .filter(([, { ratings = {} }]) => fn(ratings))
        .map(([key, value]) => (
          <li className={styles.item} key={key}>
            <Movie {...value} />
          </li>
        ))}
    </ul>
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

      <section className={styles.content}>
        <nav>
          <Genres selected={selectedGenre} />
        </nav>

        <main>
          {!filtered.length ? (
            <p className={styles.empty}>Empty</p>
          ) : (
            <>
              {list(({ best, grade }) => !best && !Number.isInteger(grade))}
              {list(({ best }) => best)}
              {!isFront && list(({ grade }) => grade === 1)}
              {!isFront && list(({ grade }) => grade === 0)}
              {!isFront && list(({ grade }) => grade === -1)}
            </>
          )}
        </main>
      </section>
    </>
  )
}

export default Movies
