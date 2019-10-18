import React, { useState } from 'react'
import classNames from 'classnames'
import { useApp } from '../api/hooks'
import Genres from './Genres'
import Movie from './Movie'
import styles from './Movies.module.scss'

const Movies = ({ match }) => {
  const selectedGenre = match.params.genre || ''
  const { indexes, movies } = useApp()

  const [selectedYear, setSelectedYear] = useState()
  const [groupWithRatings, setGroupWithRatings] = useState(true)
  const [chronological, setChronological] = useState(false)
  const toggleGroupWithRatings = () => setGroupWithRatings(!groupWithRatings)
  const toggleChronological = () => setChronological(!chronological)

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
    return (chronological ? 1 : -1) * (a > b ? 1 : a < b ? -1 : 0)
  })

  const list = (fn = () => true) => (
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
    <section className={styles.content}>
      <nav>
        <Genres selected={selectedGenre} />
      </nav>

      <main>
        <header className={styles.header}>
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

          <section className={styles.sort}>
            <button onClick={toggleGroupWithRatings}>
              {groupWithRatings ? '그룹 해제' : '평가별 그룹'}
            </button>

            <button onClick={toggleChronological}>
              {chronological ? '최신영화부터' : '개봉 순서'}
            </button>
          </section>
        </header>

        {!filtered.length ? (
          <p className={styles.empty}>Empty</p>
        ) : !groupWithRatings ? (
          list()
        ) : (
          <>
            {list(ratings => !Object.values(ratings).length)}
            {list(({ best }) => best)}
            {isFront && list(({ best, watchlist }) => !best && watchlist)}
            {!isFront && list(({ grade }) => grade === 1)}
            {!isFront && list(({ grade }) => grade === 0)}
            {!isFront && list(({ forgotten }) => forgotten)}
            {!isFront && list(({ grade }) => grade === -1)}
          </>
        )}
      </main>
    </section>
  )
}

export default Movies
