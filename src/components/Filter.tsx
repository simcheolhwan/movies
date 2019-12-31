import React from 'react'
import { Link } from 'react-router-dom'
import { equals } from 'ramda'
import classNames from 'classnames'
import { useAuth, useFilter, useDatabase } from '../api/hooks'
import Ratings from './Ratings'
import styles from './Filter.module.scss'

const Filter = () => {
  const [authenticated] = useAuth()
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
  const setRating = (next: Ratings) => {
    const active = equals(selected.ratings, next)
    return { active, onClick: () => set.ratings!(active ? undefined : next) }
  }

  const ratingFilters = {
    best: setRating({ best: true }),
    good: setRating({ good: true }),
    quality: setRating({ quality: true })
  }

  /* count */
  const link = `검색결과 ${count}개`

  return (
    <header className={styles.header}>
      <section className={styles.tabs}>
        {indexes.watched_at.map(renderYearLink)}
      </section>

      <section className={styles.sort}>
        <button onClick={toggle.groupWith}>
          {selected.groupWith ? '☑︎' : '☒'} 평가별 그룹
        </button>

        <button onClick={toggle.asc}>
          정렬: 개봉일
          {selected.asc ? '↑' : '↓'}
        </button>

        <Ratings buttons={ratingFilters} />

        <strong>
          {authenticated ? (
            <a href="/">{link}</a>
          ) : (
            <Link to="/signin">{link}</Link>
          )}
        </strong>

        <input
          value={selected.title}
          onChange={e => set.title!(e.target.value)}
        />
      </section>
    </header>
  )
}

export default Filter
