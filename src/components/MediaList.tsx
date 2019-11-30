import React, { useState, Fragment } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import classNames from 'classnames'
import { helpers } from '../api/tmdb'
import { useAuth, useDatabase } from '../api/hooks'
import Search from './Search'
import Genres from './Genres'
import Movie from './Media'
import Ratings from './Ratings'
import styles from './MediaList.module.scss'

const Component = ({ selectedGenre }: { selectedGenre: string }) => {
  const getInitial = () => {
    const isFront = !selectedGenre && !selectedYear
    return isFront ? { best: true } : undefined
  }

  /* hooks */
  const [{ movie, tv }, indexes] = useDatabase()

  /* state */
  const [selectedYear, setSelectedYear] = useState()
  const [groupWithRatings, setGroupWithRatings] = useState(true)
  const [chronological, setChronological] = useState(false)
  const [filter, setFilter] = useState<Ratings | undefined>(getInitial)
  const [input, setInput] = useState<string>('')
  const toggleGroupWithRatings = () => setGroupWithRatings(!groupWithRatings)
  const toggleChronological = () => setChronological(!chronological)
  const matchFilter = (r: Ratings) =>
    Object.entries(r).some(
      ([k, v]) => !!filter && filter[k as keyof Ratings] === v
    )

  /* media list */
  const entries = Object.entries({ ...tv, ...movie })

  const filtered = entries.filter(([, { watched_at, genre, ratings, tmdb }]) =>
    input
      ? helpers.getTitle(tmdb).includes(input)
      : (!selectedYear || watched_at === selectedYear) &&
        (!selectedGenre || (genre || 'inbox') === selectedGenre) &&
        (!filter || matchFilter(ratings || {}))
  )

  const sorted = filtered.sort(([, { tmdb: tmdbA }], [, { tmdb: tmdbB }]) => {
    const a = helpers.getDate(tmdbA)
    const b = helpers.getDate(tmdbB)
    return (chronological ? 1 : -1) * (a > b ? 1 : a < b ? -1 : 0)
  })

  /* year */
  const renderYear = (year: number) => {
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
  }

  /* filter */
  const f = (k: keyof Ratings, p: number | boolean) => {
    const active = !!filter && filter[k] === p
    return { active, onClick: () => setFilter(active ? undefined : { [k]: p }) }
  }

  const filters = {
    increase: f('grade', 1),
    decrease: f('grade', -1),
    reset: f('grade', 0),
    best: f('best', true),
    forget: f('forgotten', true),
    bookmark: f('watchlist', true)
  }

  /* list */
  type Filter = (ratings: Ratings) => boolean

  const list = (fn: Filter = () => true) => (
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

  const renderGroups = () => {
    const order: Filter[] = [
      /* No ratings */ ratings => !Object.values(ratings).length,
      /* Best */ ({ best }) => !!best,
      /* Good */ ({ grade }) => grade === 1,
      /* Watched */ ({ grade }) => grade === 0,
      /* Forgotten */ ({ forgotten }) => !!forgotten,
      /* Worst */ ({ grade }) => grade === -1
    ]

    return order.map((fn, i) => <Fragment key={i}>{list(fn)}</Fragment>)
  }

  return !entries.length ? null : (
    <section className={styles.content}>
      <nav>
        <Genres selected={selectedGenre} />
      </nav>

      <main>
        <header className={styles.header}>
          <section className={styles.tabs}>
            {indexes.watched_at.map(renderYear)}
          </section>

          <section className={styles.sort}>
            <button onClick={toggleGroupWithRatings}>
              {groupWithRatings ? '그룹 해제' : '평가별 그룹'}
            </button>

            <button onClick={toggleChronological}>
              {chronological ? '최신영화부터' : '개봉 순서'}
            </button>

            <Ratings buttons={filters} />

            <input value={input} onChange={e => setInput(e.target.value)} />
          </section>
        </header>

        <section className={styles.list}>
          {!filtered.length ? (
            <p className={styles.empty}>Empty</p>
          ) : !groupWithRatings ? (
            list()
          ) : (
            renderGroups()
          )}
        </section>
      </main>
    </section>
  )
}

interface Params {
  genre: string
}

const MediaList = ({ match }: RouteComponentProps<Params>) => {
  const selectedGenre = match.params.genre || ''
  const [authenticated] = useAuth()
  return (
    <DndProvider backend={HTML5Backend}>
      {authenticated && <Search />}
      <Component selectedGenre={selectedGenre} key={selectedGenre} />
    </DndProvider>
  )
}

export default MediaList
