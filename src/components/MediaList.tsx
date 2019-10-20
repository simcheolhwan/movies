import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import classNames from 'classnames'
import { helpers } from '../api/tmdb'
import { useApp } from '../api/hooks'
import Genres from './Genres'
import Movie from './Media'
import styles from './MediaList.module.scss'

interface Params {
  genre: string
}

const MediaList: React.FC<RouteComponentProps<Params>> = ({ match }) => {
  const selectedGenre = match.params.genre || ''
  const { indexes, movie, tv } = useApp()

  const [selectedYear, setSelectedYear] = useState()
  const [groupWithRatings, setGroupWithRatings] = useState(true)
  const [chronological, setChronological] = useState(false)
  const toggleGroupWithRatings = () => setGroupWithRatings(!groupWithRatings)
  const toggleChronological = () => setChronological(!chronological)

  /* render */
  const isFront = !selectedGenre && !selectedYear

  const entries = Object.entries({ ...tv, ...movie })
  const filtered = entries.filter(
    ([, { watched_at, genre }]) =>
      (!selectedYear || watched_at === selectedYear) &&
      (!selectedGenre || (genre || 'inbox') === selectedGenre)
  )

  const sorted = filtered.sort(([, { tmdb: tmdbA }], [, { tmdb: tmdbB }]) => {
    const a = helpers.getDate(tmdbA)
    const b = helpers.getDate(tmdbB)
    return (chronological ? 1 : -1) * (a > b ? 1 : a < b ? -1 : 0)
  })

  const list = (fn: (ratings: Ratings) => boolean = () => true) => (
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
            {list(({ best }) => !!best)}
            {isFront && list(({ best, watchlist }) => !best && !!watchlist)}
            {!isFront && list(({ grade }) => grade === 1)}
            {!isFront && list(({ grade }) => grade === 0)}
            {!isFront && list(({ forgotten }) => !!forgotten)}
            {!isFront && list(({ grade }) => grade === -1)}
          </>
        )}
      </main>
    </section>
  )
}

export default MediaList
