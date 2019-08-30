import React from 'react'
import Poster from './Poster'
import styles from './Movie.module.scss'

const Movie = ({ tmdb: { title, poster_path } }) => (
  <article className={styles.component}>
    <Poster w={342} path={poster_path} className={styles.poster} />
    <h1 className={styles.title}>{title}</h1>
  </article>
)

export default Movie
