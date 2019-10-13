import React from 'react'
import { helpers } from '../api/tmdb'
import { useApp } from '../api/hooks'
import Poster from './Poster'
import styles from './Results.module.scss'

const Item = ({ onClick, ...item }) => {
  const { movies } = useApp()

  const { id, title, name } = item
  const link = helpers.getLink(item)
  const date = helpers.getYear(item)
  const type = helpers.getType(item)

  const { genre, watched_at } = movies[id] || {}

  const handleClick = e => {
    e.preventDefault()
    onClick()
  }

  return (
    <li className={styles.item}>
      <a href={link} onClick={handleClick} className={styles.movie}>
        <Poster movie={item} w={92} className={styles.poster} />
        <main>
          <h1>{title || name}</h1>
          <p className={styles.meta}>
            {date}
            {type && ` (${type})`}
          </p>
        </main>
      </a>

      <small className={styles.already}>
        {movies[id] && `이미 추가함: ${genre} (${watched_at})`}
      </small>
    </li>
  )
}

const Results = ({ results, onAdd }) => (
  <section className={styles.results}>
    <h1 className={styles.title}>검색 결과</h1>
    <ul className={styles.list}>
      {results.map((item, index) => (
        <Item {...item} onClick={() => onAdd(index)} key={item.id} />
      ))}
    </ul>
  </section>
)

export default Results
