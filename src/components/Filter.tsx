import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useFilter, useDatabase } from '../api/hooks'
import Ratings from './Ratings'
import styles from './Filter.module.scss'

const Filter = () => {
  const [, indexes] = useDatabase()
  const { selected, count, toggle, set } = useFilter()

  /* watched_at */
  const renderYearLink = (year: number) => {
    const isSelected = year === selected.watched_at
    const attrs = {
      className: classNames(styles.tab, isSelected && styles.active),
      to: { search: isSelected ? '' : `?watched_at=${year}` }
    }

    return (
      <Link {...attrs} key={year}>
        {year}
      </Link>
    )
  }

  /* ratings */
  const setRating = (k: keyof Ratings, p: number | boolean) => {
    const active = selected.ratings?.[k] === p
    const next = active ? undefined : { [k]: p }
    return { active, onClick: () => set.ratings!(next) }
  }

  const ratingFilters = {
    increase: setRating('grade', 1),
    decrease: setRating('grade', -1),
    reset: setRating('grade', 0),
    best: setRating('best', true),
    forget: setRating('forgotten', true),
    bookmark: setRating('watchlist', true)
  }

  return (
    <header className={styles.header}>
      <section className={styles.tabs}>
        {indexes.watched_at.map(renderYearLink)}
      </section>

      <section className={styles.sort}>
        <button onClick={toggle.groupWith}>
          {selected.groupWith ? '그룹 해제' : '평가별 그룹'}
        </button>

        <button onClick={toggle.asc}>
          {selected.asc ? '최신영화부터' : '개봉 순서'}
        </button>

        <Ratings buttons={ratingFilters} />

        <Link to="/signin">
          <strong>검색결과 {count}개</strong>
        </Link>

        <input
          value={selected.title}
          onChange={e => set.title!(e.target.value)}
        />
      </section>
    </header>
  )
}

export default Filter
