import React from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'
import classNames from 'classnames'
import { useActions } from '../api/hooks'
import Poster, { getPoster } from './Poster'
import Ratings from './Ratings'
import styles from './Movie.module.scss'

const Movie = movie => {
  const { tmdb } = movie
  const { id, title, name, poster_path } = tmdb

  const { moveMovie } = useActions()
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'movie' },
    end: (item, monitor) => {
      const result = monitor.getDropResult()
      result && moveMovie(id, result.genre)
    },
    collect: monitor => ({ isDragging: !!monitor.isDragging() })
  })

  const link = `https://www.themoviedb.org/movie/${id}`
  return (
    <article
      className={classNames(styles.component, isDragging && styles.isDragging)}
      ref={drag}
    >
      <Ratings {...movie} />
      <DragPreviewImage connect={preview} src={getPoster(92, poster_path)} />
      <Poster w={342} path={poster_path} className={styles.poster} />
      <h1 className={styles.title}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {title || name}
        </a>
      </h1>
    </article>
  )
}

export default Movie
