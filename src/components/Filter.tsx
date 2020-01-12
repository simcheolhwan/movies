import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useFilter } from '../api/hooks'
import Ratings from './Ratings'
import Years from './Years'
import styles from './Filter.module.scss'

const Filter = () => {
  const [authenticated] = useAuth()
  const { selected, count, toggle, set } = useFilter()

  const link = `검색결과 ${count}개`

  return (
    <header className={styles.header}>
      <Years />

      <section className={styles.sort}>
        <button onClick={toggle.groupWith}>
          {selected.groupWith ? '☑︎' : '☒'} 평가별 그룹
        </button>

        <button onClick={toggle.asc}>
          정렬: 개봉일
          {selected.asc ? '↑' : '↓'}
        </button>

        <Ratings active={selected.best} onClick={toggle.best} />

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
