import React from 'react'
import { helpers } from '../api/tmdb'
import Poster from './Poster'
import styles from './Results.module.scss'

const Item = ({ onClick, ...item }) => {
  const { title, name, poster_path } = item
  const link = helpers.getLink(item)
  const date = helpers.getYear(item)
  const type = helpers.getType(item)

  const handleClick = e => {
    e.preventDefault()
    onClick()
  }

  return (
    <li className={styles.item}>
      <a href={link} onClick={handleClick} className={styles.movie}>
        <Poster w={92} path={poster_path} className={styles.poster} />
        <main>
          <h1>{title || name}</h1>
          <p className={styles.meta}>
            {date}
            {type && ` (${type})`}
          </p>
        </main>
      </a>
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
