import React from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'
import classNames from 'classnames'
import { helpers } from '../api/tmdb'
import { useActions } from '../api/hooks'
import Poster, { getPoster } from './Poster'
import Ratings from './Ratings'
import styles from './Movie.module.scss'

const Movie = movie => {
  const { tmdb, watched_at } = movie
  const { id, title, name, poster_path } = tmdb

  const { moveMovie, removeMovie } = useActions()
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'movie' },
    end: (item, monitor) => {
      const result = monitor.getDropResult()
      result && moveMovie(id, result.genre)
    },
    collect: monitor => ({ isDragging: !!monitor.isDragging() })
  })

  const handleContextMenu = e => {
    e.preventDefault()
    window.confirm(`${title || name} 삭제`) && removeMovie(id)
  }

  /* render */
  const link = helpers.getLink(tmdb)
  const type = helpers.getType(tmdb)
  const released = helpers.getYear(tmdb)

  const year =
    released === watched_at ? released : `${released} → ${watched_at}`

  const yearClassName = classNames(
    styles.year,
    released > watched_at && styles.danger
  )

  return (
    <article
      onContextMenu={handleContextMenu}
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
      <p className={yearClassName}>
        {year}
        {type && ` (${type})`}
      </p>
    </article>
  )
}

export default Movie
